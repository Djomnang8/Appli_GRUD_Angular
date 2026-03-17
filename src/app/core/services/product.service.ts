import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Ordinateur portable', price: 899.99, category: 'Informatique',  quantity: 8 },
    { id: 2, name: 'Souris sans fil', price: 29.99, category: 'Informatique',  quantity: 89 },
    { id: 3, name: 'Écran 24"', price: 199.99, category: 'Informatique',  quantity: 3 },
  ];

  constructor() { }

  // Récupérer tous les produits
  getAll(): Product[] {
    return [...this.products]; // Retourne une copie pour éviter les modifications directes
  }

  // Récupérer un produit par son ID
  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Créer un nouveau produit
  create(product: Omit<Product, 'id'>): Product {
    const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
    const newProduct = { ...product, id: newId };
    this.products.push(newProduct);
    return newProduct;
  }

  // Mettre à jour un produit existant
  update(id: number, updatedProduct: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      return this.products[index];
    }
    return undefined;
  }

  // Supprimer un produit
  delete(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length !== initialLength; // Retourne true si un élément a été supprimé
  }
}