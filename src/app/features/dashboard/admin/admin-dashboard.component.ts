import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NavbarComponent, SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  totalEmployees = 0;
  uniqueDepartmentsCount = 0;
  totalProducts = 0;
  lowStockCount = 0;
  totalQuantity = 0;

  // Stock alert
  showStockAlertData = false;
  lowStockProducts: Product[] = [];

  // Inventory
  showInventoryData = false;
  inventoryYear = 2026;
  inventoryProductId: number | 'all' = 'all';
  availableYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  availableProducts: Product[] = [];
  inventoryData: { monthKey: string; quantity: number }[] = [];

  private needsChartDraw = false;
  private seedCache: Map<string, number[]> = new Map();

  // Clés de mois pour traduction
  private readonly MONTH_KEYS = [
    'MONTH.JAN', 'MONTH.FEB', 'MONTH.MAR', 'MONTH.APR', 'MONTH.MAY', 'MONTH.JUN',
    'MONTH.JUL', 'MONTH.AUG', 'MONTH.SEP', 'MONTH.OCT', 'MONTH.NOV', 'MONTH.DEC'
  ];

  constructor(
    public auth: AuthService,
    private empService: EmployeeService,
    private deptService: DepartmentService,
    private productService: ProductService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const employees = this.empService.getAll();
    this.totalEmployees = employees.length;

    const departments = this.deptService.getAll();
    const uniqueNames = new Set(departments.map(d => d.name));
    this.uniqueDepartmentsCount = uniqueNames.size;

    const products = this.productService.getAll();
    this.availableProducts = products;
    this.totalProducts = products.length;
    this.totalQuantity = products.reduce((s, p) => s + (p.quantity || 0), 0);
    this.lowStockCount = products.filter(p => p.quantity < 5).length;
  }

  ngAfterViewChecked(): void {
    if (this.needsChartDraw && this.chartCanvas) {
      this.drawChart();
      this.needsChartDraw = false;
    }
  }

  showStockAlert(): void {
    this.lowStockProducts = this.productService.getAll().filter(p => p.quantity < 5);
    this.showStockAlertData = true;
    this.showInventoryData = false;
  }

  showInventory(): void {
    this.showInventoryData = true;
    this.showStockAlertData = false;
    this.loadInventoryData();
  }

  onYearChange(event: Event): void {
    this.inventoryYear = +(event.target as HTMLSelectElement).value;
    this.loadInventoryData();
  }

  onProductChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.inventoryProductId = val === 'all' ? 'all' : +val;
    this.loadInventoryData();
  }

  private loadInventoryData(): void {
    const year = this.inventoryYear;
    const pid = this.inventoryProductId;

    if (year === 2026) {
      // Pour 2026, on utilise le mois courant (mars) et on considère que les produits
      // n'existent qu'à partir de ce mois. Donc seule la barre de mars affiche la quantité actuelle.
      const products = this.productService.getAll();
      const filtered = pid === 'all' ? products : products.filter(p => p.id === pid);
      const currentQuantity = filtered.reduce((s, p) => s + (p.quantity || 0), 0);
      
      // Mois courant (0 = janvier, 2 = mars)
      const currentMonth = new Date().getMonth(); // 2 pour mars 2026
      
      this.inventoryData = this.MONTH_KEYS.map((monthKey, index) => {
        // Seul le mois courant a une quantité non nulle
        const quantity = (index === currentMonth) ? currentQuantity : 0;
        return { monthKey, quantity };
      });
    } else {
      // Données fictives stables pour les autres années
      const key = `${year}-${pid}`;
      if (!this.seedCache.has(key)) {
        const base = (year * 31 + (pid === 'all' ? 0 : +pid * 7)) % 800 + 100;
        const values = this.MONTH_KEYS.map((_, i) => {
          const v = Math.abs(Math.sin(year * 3.14 + i + (pid === 'all' ? 0 : +pid)) * 500 + base + i * 15);
          return Math.floor(v);
        });
        this.seedCache.set(key, values);
      }
      const vals = this.seedCache.get(key)!;
      this.inventoryData = this.MONTH_KEYS.map((monthKey, i) => ({ monthKey, quantity: vals[i] }));
    }

    this.needsChartDraw = true;
  }

  private drawChart(): void {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas || !this.inventoryData.length) return;

    const ctx = canvas.getContext('2d')!;
    const W = canvas.offsetWidth || 700;
    const H = 260;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    const padLeft = 50, padRight = 16, padTop = 20, padBottom = 50;
    const chartW = W - padLeft - padRight;
    const chartH = H - padTop - padBottom;
    const barCount = this.inventoryData.length;
    const barGap = 6;
    const barW = (chartW - barGap * (barCount - 1)) / barCount;
    const maxVal = Math.max(...this.inventoryData.map(d => d.quantity), 1);

    // Grille
    const gridCount = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i <= gridCount; i++) {
      const y = padTop + chartH - (i / gridCount) * chartH;
      ctx.beginPath(); ctx.moveTo(padLeft, y); ctx.lineTo(padLeft + chartW, y); ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round((i / gridCount) * maxVal)), padLeft - 6, y + 4);
    }

    // Barres et labels des mois
    this.inventoryData.forEach((d, i) => {
      const x = padLeft + i * (barW + barGap);
      const barH = (d.quantity / maxVal) * chartH;
      const y = padTop + chartH - barH;

      // Dégradé pour la barre
      const grad = ctx.createLinearGradient(0, y, 0, padTop + chartH);
      grad.addColorStop(0, 'rgba(192,57,43,0.9)');
      grad.addColorStop(1, 'rgba(33,150,243,0.5)');
      ctx.fillStyle = grad;

      // Dessiner la barre avec des coins arrondis
      const r = Math.min(4, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, padTop + chartH);
      ctx.lineTo(x, padTop + chartH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // Label du mois (traduit)
      const monthLabel = this.translate.instant(d.monthKey);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(monthLabel, x + barW / 2, H - padBottom + 18);
    });
  }
}