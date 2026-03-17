import { Injectable } from '@angular/core';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departments: Department[] = [
    { id: 1, name: 'Informatique', description: 'Matériel et logiciels', active: true },
    { id: 2, name: 'Bureau', description: 'Fournitures de bureau', active: true },
    { id: 3, name: 'Mobilier', description: 'Meubles et rangements', active: false },
  ];

  constructor() { }

  // Récupérer tous les départements
  getAll(): Department[] {
    return [...this.departments];
  }

  // Récupérer un département par son ID
  getById(id: number): Department | undefined {
    return this.departments.find(d => d.id === id);
  }

  // Créer un nouveau département
  create(department: Omit<Department, 'id'>): Department {
    const newId = Math.max(...this.departments.map(d => d.id), 0) + 1;
    const newDepartment = { ...department, id: newId };
    this.departments.push(newDepartment);
    return newDepartment;
  }

  // Mettre à jour un département existant
  update(id: number, updatedDepartment: Partial<Department>): Department | undefined {
    const index = this.departments.findIndex(d => d.id === id);
    if (index !== -1) {
      this.departments[index] = { ...this.departments[index], ...updatedDepartment };
      return this.departments[index];
    }
    return undefined;
  }

  // Supprimer un département
  delete(id: number): boolean {
    const initialLength = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    return this.departments.length !== initialLength;
  }
}