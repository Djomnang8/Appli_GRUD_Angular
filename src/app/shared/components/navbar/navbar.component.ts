import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateConfigService, SUPPORTED_LANGS } from '../../../core/services/translate-config.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  langs = SUPPORTED_LANGS;
  showLangMenu = false;

  constructor(
    public auth: AuthService,
    public translateConfig: TranslateConfigService,
    public theme: ThemeService
  ) {}

  logout(): void { this.auth.logout(); }

  setLang(code: string): void {
    this.translateConfig.setLang(code);
    this.showLangMenu = false;
  }
}