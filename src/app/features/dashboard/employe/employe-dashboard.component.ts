import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.scss']
})
export class EmployeDashboardComponent implements OnInit {
  profile: any = null;

  constructor(public auth: AuthService, private empService: EmployeeService) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      const all = this.empService.getAll();
      // On cherche l'employé par email ou nom+prénom selon ce que getCurrentUser() retourne
      // Adaptez la propriété de correspondance selon votre modèle Employee
      this.profile = all.find(e =>
        (e as any)['email'] === (user as any)['email'] ||
        (e as any)['nom'] === (user as any)['nom']
      ) ?? null;
    }
  }
}