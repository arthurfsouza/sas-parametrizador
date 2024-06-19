import { Auth } from "../../guards/auth/auth.interface";

export type DataStorageTypes = 'auth';

export interface LocalStorage { auth?: Auth | null; }

export interface DataStorage { data?: any; type?: DataStorageTypes; }