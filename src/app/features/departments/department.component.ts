import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models/department.model';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NavbarComponent, SidebarComponent],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchTerm = '';
  departmentForm!: FormGroup;
  showForm = false;
  selectedDepartment: Department | null = null;
  isEditMode = false;
  duplicateError = false;

  // Stats
  totalDepts = 0;
  activeDepts = 0;
  inactiveDepts = 0;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private initForm(): void {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      active: [true]
    });
  }

  loadDepartments(): void {
    this.departments = this.departmentService.getAll();
    this.applyFilter();
    this.computeStats();
  }

  private computeStats(): void {
    this.totalDepts = this.departments.length;
    this.activeDepts = this.departments.filter(d => d.active).length;
    this.inactiveDepts = this.departments.filter(d => !d.active).length;
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDepartments = term
      ? this.departments.filter(d =>
          d.name.toLowerCase().includes(term) ||
          (d.description && d.description.toLowerCase().includes(term)))
      : [...this.departments];
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  resetForm(): void {
    this.departmentForm.reset({ name: '', description: '', active: true });
    this.selectedDepartment = null;
    this.isEditMode = false;
    this.duplicateError = false;
  }

  editDepartment(dept: Department): void {
    this.selectedDepartment = dept;
    this.isEditMode = true;
    this.departmentForm.patchValue(dept);
    this.showForm = true;
    this.duplicateError = false;
  }

  deleteDepartment(id: number): void {
    const confirmMsg = this.translate.instant('DEPARTMENT.CONFIRM_DELETE');
    if (confirm(confirmMsg)) {
      this.departmentService.delete(id);
      this.loadDepartments();
    }
  }

  saveDepartment(): void {
    if (this.departmentForm.invalid) return;
    const formValue = this.departmentForm.value;
    const nameNorm = formValue.name.trim().toLowerCase();

    const isDuplicate = this.departments.some(d =>
      d.name.trim().toLowerCase() === nameNorm &&
      (!this.isEditMode || d.id !== this.selectedDepartment?.id)
    );
    if (isDuplicate) {
      this.duplicateError = true;
      return;
    }

    if (this.isEditMode && this.selectedDepartment) {
      this.departmentService.update(this.selectedDepartment.id, formValue);
    } else {
      this.departmentService.create(formValue);
    }
    this.loadDepartments();
    this.toggleForm();
    this.resetForm();
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }
}