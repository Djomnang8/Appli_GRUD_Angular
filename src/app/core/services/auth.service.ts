import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: User[] = [   // Liste d'utilisateurs simulée (pas de BDD)
    { id:1, username:'admin',   password:'admin123', role:'admin',   nom:'Dupont', prenom:'Alice' },
    { id:2, username:'employe', password:'emp123',   role:'employe', nom:'Martin', prenom:'Bob'   }
  ];

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Cherche un utilisateur dont username ET password correspondent
    const user = this.users.find(u => u.username===username && u.password===password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // Sauvegarde l'utilisateur en session
      return true;
    }
    return false; // Identifiants incorrects
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // Efface la session
    this.router.navigate(['/login']);        // Redirige vers la page de login
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null; // Restitue l'objet User ou null
  }

  isLoggedIn(): boolean { return !!this.getCurrentUser(); } // true si un utilisateur est en session
  getRole(): Role | null { return this.getCurrentUser()?.role || null; } // Retourne 'admin' ou 'employe'
  isAdmin(): boolean { return this.getRole() === 'admin'; } // Raccourci pour tester le rôle admin
}