import { ParametroStatus } from "../parametro-status/parametro-status.interface";
import { Politica } from "../politica/politica.interface";

export type ParametroModo = "CHAVE" | "GLOBAL";

export interface Parametro {
    id: string;
    nome: string;
    descricao: string;
    modo: ParametroModo;
    data_hora_vigencia: Date;
    versao: string;
    is_vigente: boolean;
    sas_domain_id?: string;
    sas_content_id?: string;
    sas_user_id: string;
    sas_user_name?: string;
    sas_user_email?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;    
    status_code?: string;
    parametro_status?: ParametroStatus;
    politica_id?: string;
    politica?: Politica;
    parametro_parent_id?: string;
    parametro_parent?: Parametro;
}