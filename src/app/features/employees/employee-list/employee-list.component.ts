import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,       // *ngIf, *ngFor
    FormsModule,        // [(ngModel)]
    TranslateModule,    // | translate
    NavbarComponent,    // <app-navbar>
    SidebarComponent    // <app-sidebar>
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filtered: any[] = [];
  search = '';

  constructor(private empService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.employees = this.empService.getAll();
    this.filtered = [...this.employees];
  }

  applyFilter(): void {
    const term = this.search.toLowerCase();
    this.filtered = this.employees.filter(e =>
      e.nom.toLowerCase().includes(term) ||
      e.prenom.toLowerCase().includes(term) ||
      e.poste.toLowerCase().includes(term) ||
      e.departement.toLowerCase().includes(term)
    );
  }

  add(): void { this.router.navigate(['/employees/new']); }
  edit(id: number): void { this.router.navigate(['/employees/edit', id]); }
  delete(id: number): void {
    this.empService.delete(id);
    this.employees = this.empService.getAll();
    this.applyFilter();
  }
}