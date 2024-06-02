import { Auth } from "../../guards/auth/auth.interface";

export type DataStorageTypes = 'auth' | 'permissions';

export interface LocalStorage { auth?: Auth | null; permissions?: string[] | null; }

export interface DataStorage { data?: any; type?: DataStorageTypes; }