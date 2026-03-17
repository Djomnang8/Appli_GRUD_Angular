import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme'; // Clé utilisée dans localStorage
  isDark = false;                          // État courant du thème (public pour le binding dans le template)

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY); // Cherche une préférence sauvegardée
    if (saved) {
      this.isDark = saved === 'dark';       // Restitue la préférence
    } else {
      // Aucune préférence → détecte celle du système d'exploitation
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme(); // Applique immédiatement au démarrage
  }

  toggle(): void {
    this.isDark = !this.isDark;                                      // Inverse le thème
    localStorage.setItem(this.STORAGE_KEY, this.isDark ? 'dark' : 'light'); // Sauvegarde
    this.applyTheme();
  }

  private applyTheme(): void {
    const root = document.documentElement; // Cible la balise <html>
    root.setAttribute('data-theme', this.isDark ? 'dark' : 'light'); // Ex: <html data-theme="dark">
    // Le CSS utilise [data-theme="dark"] { ... } pour changer les variables de couleur
  }
}