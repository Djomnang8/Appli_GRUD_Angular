import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [ /* 3 employés de départ */ ];
  private nextId = 4; // Compteur auto-incrémenté pour les nouveaux IDs

  getAll(): Employee[] { return [...this.employees]; }  // Retourne une copie (évite les mutations)
  getById(id: number): Employee | undefined { return this.employees.find(e => e.id===id); }

  create(emp: Omit<Employee,'id'>): Employee { // Omit<> = Employee sans le champ 'id'
    const newEmp = { ...emp, id: this.nextId++ }; // Ajoute l'ID automatiquement
    this.employees.push(newEmp);
    return newEmp;
  }

  update(id: number, emp: Partial<Employee>): Employee | null { // Partial<> = tous les champs optionnels
    const idx = this.employees.findIndex(e => e.id===id);
    if (idx===-1) return null;                            // Employé introuvable
    this.employees[idx] = { ...this.employees[idx], ...emp }; // Fusionne les anciens et nouveaux champs
    return this.employees[idx];
  }

  delete(id: number): boolean {
    const idx = this.employees.findIndex(e => e.id===id);
    if (idx===-1) return false;
    this.employees.splice(idx,1); // Retire l'élément du tableau
    return true;
  }
}