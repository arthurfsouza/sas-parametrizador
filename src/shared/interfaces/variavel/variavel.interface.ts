import { Parametro } from "../parametro/parametro.interface";
import { VariavelLista } from "../variavel-lista/variavel-lista.interface";

export type VariavelTipo = "DECIMAL" | "NUMERICO" | "LISTA" | "TEXTO";

export interface Variavel {
    id: string;
    nome: string;
    descricao: string;
    tipo: VariavelTipo;
    is_chave: boolean;
    tamanho: number;
    qtd_casas_decimais?: number;
    created_at?: Date;
    parametro_id: string;
    parametro?: Parametro;

    listas?: VariavelLista[];
}

export interface VariavelUpload {
    variavel: Variavel;
    controle: {
      nomeObrigatorio: boolean;
      nomeInvalido: boolean;
      tipoObrigatorio: boolean;
      tipoInexistente: boolean;
      descricaoObrigatorio: boolean;
      descricaoEnorme: boolean;
      tamanhoObrigatorio: boolean;
      tamanhoNaoNumerico: boolean;
      tamanhoIgualZero: boolean;
      qtdCasasDecimaisObrigatorio: boolean;
      qtdCasasDecimaisNaoNumerico: boolean;
      qtdCasasDecimaisIgualZero: boolean;
      chaveObrigatorio: boolean;
      chaveNaoBooleano: boolean;
    }
}