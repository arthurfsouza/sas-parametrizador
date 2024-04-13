export interface Segmento {
    id: number;
    nome: string;
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

export interface Variavel {
    id: number;
    nome: string;
    tipo: "a" | "b" | "c";
    qtdCasasDecimais: number;
    tamanho: number;
    isChave: boolean;
}

/** Antes de fazer a lockup (pastas dentro do SAS), precisa preparar o ambiente.
 * Como é feito? Pedimos ao time de Riscos para criar um "Cluster" e uma "Política"
*/