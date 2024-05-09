export interface Segmento {
    id: number;
    nome: string;
    descricao: string;
    isAtivo: boolean;
}

export interface Cluster {
    id: number;
    nome: string;
    descricao: string;
    isAtivo: boolean;
    segmento: Segmento;
}

export interface Politica {
    id: number;
    nome: string;
    descricao: string;
    isAtivo: boolean;
    cluster: Cluster;
}

export interface Parametro {
    id: number;
    nome: string;
    descricao: string;
    modo: 'chave' | 'global';
    dataVigencia: Date;
    horaVigencia: Date;
    cluster: Cluster;
    politica: Politica;
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
}

/** Antes de fazer a lockup (pastas dentro do SAS), precisa preparar o ambiente.
 * Como é feito? Pedimos ao time de Riscos para criar um "Cluster" e uma "Política"
*/