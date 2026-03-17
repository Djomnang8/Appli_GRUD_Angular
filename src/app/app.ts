import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminDashboardComponent } from './features/dashboard/admin/admin-dashboard.component';
import { EmployeDashboardComponent } from './features/dashboard/employe/employe-dashboard.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form.component';
import { ProductComponent } from './features/products/product.component';
import { DepartmentComponent } from './features/departments/department.component';

// IMPORTANT : exporté sous le nom "appRoutes" pour être utilisé dans main.ts
export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'employe-dashboard', component: EmployeDashboardComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/new', component: EmployeeFormComponent },
  { path: 'employees/edit/:id', component: EmployeeFormComponent },
  {path : 'products', component: ProductComponent},
  {path : 'departments', component: DepartmentComponent},
  { path: '**', redirectTo: 'login' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule    // <router-outlet>
  ],
  templateUrl: './app.html',
  
})
export class AppComponent {}