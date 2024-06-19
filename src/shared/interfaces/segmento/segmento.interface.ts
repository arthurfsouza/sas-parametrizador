export interface Segmento {
    id: string;
    nome: string;
    descricao: string;
    is_ativo: boolean;
    sas_folder_id?: string;
    sas_parent_uri?: string;
    sas_test_folder_id?: string;
    sas_test_parent_uri?: string;
    created_at?: Date;
    updated_at?: Date;
    has_association?: boolean;
}