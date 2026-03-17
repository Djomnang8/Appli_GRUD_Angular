export type Role = 'admin' | 'employe';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  nom: string;
  prenom: string;
}