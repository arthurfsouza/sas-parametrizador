import { Cluster } from "./cluster/cluster.interface";
import { Politica } from "./politica/politica.interface";

export interface Parametro {
    id: number;
    nome: string;
    descricao: string;
    modo: 'chave' | 'global';
    dataVigencia: Date;
    horaVigencia: Date;
    cluster?: Cluster;
    politica?: Politica;
}

export interface VariavelLista {
    id: number;
    nome: string;
    checked: boolean;
}

export interface Variavel {
    id: number;
    nome: string;
    descricao: string;
    tipo: "DECIMAL" | "NUMERICO" | "LISTA" | "TEXTO";
    qtdCasasDecimais: number | null;
    tamanho: number;
    isChave: boolean;
    lista: VariavelLista[] | null;
}

export interface Parametrizador {
    id: number;
    parametro: Parametro | null;
    variaveis: Variavel[];
    dados: any[];
    status?: 'CREATED' | 'ACTIVE' | 'AWAITING_RISK_DECISION' | 'DELETED';
    versao?: string;
    eventos?: Evento[];
}

export interface Evento {
    id: number;
    nome: string;
    status: string;
    dataOcorrencia: Date;
    responsavel: string;
}

/** Antes de fazer a lockup (pastas dentro do SAS), precisa preparar o ambiente.
 * Como é feito? Pedimos ao time de Riscos para criar um "Cluster" e uma "Política"
*/