import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGS = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' }
];

@Injectable({ providedIn: 'root' })
export class TranslateConfigService {

  constructor(private translate: TranslateService) {
    // Déclare toutes les langues supportées
    translate.addLangs(SUPPORTED_LANGS.map(l => l.code));

    // Langue par défaut si aucune traduction trouvée
    translate.setDefaultLang('fr');

    // Récupère la langue sauvegardée ou utilise 'fr'
    const saved = localStorage.getItem('lang') || 'fr';
    translate.use(saved);
  }

  setLang(code: string): void {
    this.translate.use(code);
    localStorage.setItem('lang', code);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'fr';
  }
}