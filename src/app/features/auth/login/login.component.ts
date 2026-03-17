import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateConfigService, SUPPORTED_LANGS } from '../../../core/services/translate-config.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,          // *ngIf, *ngFor
    ReactiveFormsModule,   // [formGroup], formControlName
    TranslateModule        // | translate
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;    // Formulaire réactif Angular
  error = false;           // true = affiche le message d'erreur dans le template
  hidePassword = true;     // true = champ password masqué
  langs = SUPPORTED_LANGS; // Liste des langues pour les boutons dans le template

  constructor(
    private fb: FormBuilder,               // Construit le FormGroup facilement
    private auth: AuthService,
    private router: Router,
    public translateConfig: TranslateConfigService // public car appelé depuis le template
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  // Champ obligatoire
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;    // Sécurité : ne soumet pas si le formulaire est invalide
    const { username, password } = this.loginForm.value;
    if (this.auth.login(username, password)) {
      const role = this.auth.getRole();
      // Redirige selon le rôle : admin → /admin, employé → /employe-dashboard
      this.router.navigate([role === 'admin' ? '/admin' : '/employe-dashboard']);
    } else {
      this.error = true; // Identifiants incorrects → affiche l'erreur
    }
  }

  changeLang(code: string): void {
    this.translateConfig.setLang(code); // Délègue au service de traduction
  }
}
