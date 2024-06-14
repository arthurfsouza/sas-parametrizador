import { Parametro } from "../parametro/parametro.interface";

export type VariavelTipo = "DECIMAL" | "NUMERICO" | "LISTA" | "TEXTO";

export interface Variavel {
    id: string;
    nome: string;
    descricao: string;
    tipo: VariavelTipo;
    is_chave: boolean;
    tamanho: number;
    qtd_casas_decimais?: number;
    parametro_id: string;
    parametro?: Parametro;
}