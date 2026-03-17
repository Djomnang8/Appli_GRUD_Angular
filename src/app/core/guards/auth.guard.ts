import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })       // Service disponible dans toute l'app sans l'importer dans un module
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {                // Angular appelle cette méthode avant d'accéder à la route
    if (this.auth.isLoggedIn()) return true;  // Utilisateur connecté → accès autorisé
    this.router.navigate(['/login']);          // Sinon → redirection vers /login
    return false;                             // Accès refusé
  }
}