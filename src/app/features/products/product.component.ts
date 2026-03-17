import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NavbarComponent, SidebarComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  productForm!: FormGroup;
  showForm = false;
  selectedProduct: Product | null = null;
  isEditMode = false;
  duplicateError = false;

  // Stats dashboard
  totalProducts = 0;
  lowStockCount = 0;
  totalQuantity = 0;
  avgPrice = 0;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProducts(): void {
    this.products = this.productService.getAll();
    this.applyFilter();
    this.computeStats();
  }

  private computeStats(): void {
    this.totalProducts = this.products.length;
    this.lowStockCount = this.products.filter(p => p.quantity < 5).length;
    this.totalQuantity = this.products.reduce((s, p) => s + (p.quantity || 0), 0);
    this.avgPrice = this.products.length
      ? Math.round(this.products.reduce((s, p) => s + p.price, 0) / this.products.length)
      : 0;
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = term
      ? this.products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          (p.category && p.category.toLowerCase().includes(term)))
      : [...this.products];
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm(): void {
    this.productForm.reset({ name: '', price: 0, category: '', quantity: 0 });
    this.selectedProduct = null;
    this.isEditMode = false;
    this.duplicateError = false;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.isEditMode = true;
    this.productForm.patchValue(product);
    this.showForm = true;
    this.duplicateError = false;
  }

  deleteProduct(id: number): void {
    const confirmMsg = this.translate.instant('PRODUCT.CONFIRM_DELETE');
    if (confirm(confirmMsg)) {
      this.productService.delete(id);
      this.loadProducts();
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    const formValue = this.productForm.value;
    const nameNorm = formValue.name.trim().toLowerCase();

    const isDuplicate = this.products.some(p =>
      p.name.trim().toLowerCase() === nameNorm &&
      (!this.isEditMode || p.id !== this.selectedProduct?.id)
    );
    if (isDuplicate) {
      this.duplicateError = true;
      return;
    }

    if (this.isEditMode && this.selectedProduct) {
      this.productService.update(this.selectedProduct.id, formValue);
    } else {
      this.productService.create(formValue);
    }
    this.loadProducts();
    this.toggleForm();
    this.resetForm();
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }
}