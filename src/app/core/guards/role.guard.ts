import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const required: string[] = route.data['roles'] || []; // Lit les rôles requis depuis route.data
    const role = this.auth.getRole();                      // Récupère le rôle de l'utilisateur connecté
    if (role && required.includes(role)) return true;     // Rôle valide → accès autorisé
    this.router.navigate(['/login']);               // Rôle invalide → redirection (⚠️ route non définie)
    return false;
  }
}