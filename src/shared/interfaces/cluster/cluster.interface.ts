import { Segmento } from "../segmento/segmento.interface";

export interface Cluster {
    id: string;
    nome: string;
    descricao: string;
    is_ativo: boolean;
    sas_folder_id?: string;
    sas_parent_uri?: string;
    created_at?: Date;
    updated_at?: Date;
    segmento_id: string;
    segmento?: Segmento;
}