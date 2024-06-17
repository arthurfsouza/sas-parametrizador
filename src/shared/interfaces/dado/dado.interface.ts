import { Parametro } from "../parametro/parametro.interface";

export interface Dado {
    id: string;
    informacao: any;
    sas_key: string;
    sas_value: string;
    sas_type?: string;
    created_at?: Date;
    parametro_id?: string;
    parametro?: Parametro;
}