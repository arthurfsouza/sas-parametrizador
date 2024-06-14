import { Parametro } from "../parametro/parametro.interface";
import { ParametroStatus } from "../parametro-status/parametro-status.interface";

export interface Evento {
    id: string;
    justificativa: string;
    sas_user_id: string;
    sas_user_name?: string;
    sas_user_email?: string;
    created_at?: Date;
    file_id?: string;
    status_code?: string;
    parametro_status?: ParametroStatus;
    parametro_id: string;
    parametro?: Parametro;
}