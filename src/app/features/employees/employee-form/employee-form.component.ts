import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,          // *ngIf, *ngFor
    ReactiveFormsModule,   // [formGroup], formControlName
    TranslateModule,       // | translate
    NavbarComponent,       // <app-navbar>
    SidebarComponent       // <app-sidebar>
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  successMsg = '';
  departments = ['RH', 'Informatique', 'Finance', 'Marketing', 'Logistique', 'Commercial'];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom:          ['', Validators.required],
      prenom:       ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      telephone:    ['', Validators.required],
      poste:        ['', Validators.required],
      departement:  ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      salaire:      [null, [Validators.required, Validators.min(0)]],
      actif:        [true]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const emp = this.empService.getById(+id);
      if (emp) this.form.patchValue(emp);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (this.isEdit) {
      const id = this.route.snapshot.paramMap.get('id');
      this.empService.update(+id!, this.form.value);
      this.successMsg = 'Employé mis à jour avec succès.';
    } else {
      this.empService.create(this.form.value);
      this.successMsg = 'Employé créé avec succès.';
    }
    setTimeout(() => this.router.navigate(['/employees']), 1500);
  }

  cancel(): void { this.router.navigate(['/employees']); }
}