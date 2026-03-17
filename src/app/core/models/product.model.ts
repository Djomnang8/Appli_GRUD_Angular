export interface Product {
  id: number;
  name: string;
  price: number;
  category?: string;
  quantity: number;   // <-- ajout
  // active?: boolean; // optionnel, selon votre besoin
}