import { Variavel } from "../variavel/variavel.interface";

export interface VariavelLista {
    id: string;
    nome: string;
    is_visivel: boolean;
    variavel_id?: string;
    variavel?: Variavel;
}