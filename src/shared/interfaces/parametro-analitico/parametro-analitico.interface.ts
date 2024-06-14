import { Parametro, ParametroModo } from "../parametro/parametro.interface";


export interface ParametroAnalitico {
    id: string;
    nome: string;
    descricao: string;
    modo: ParametroModo;
    data_hora_vigencia: Date;
    versao: string;
    dados: any;
    dados_sas: any;
    sas_domain_id?: string;
    sas_content_id?: string;
    sas_user_id: string;
    sas_user_name?: string;
    sas_user_email?: string;
    created_at?: Date;
    updated_at?: Date;
    parametro_id?: string;
    parametro?: Parametro;
    parametro_analitico_parent_id?: string;
    parametro_analitico?: ParametroAnalitico;
}