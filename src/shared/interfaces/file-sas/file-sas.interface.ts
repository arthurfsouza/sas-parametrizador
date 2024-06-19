export type FileType = "IMAGE" | "VIDEO" | "DOCUMENT" | "TEXT" | "PDF" | 
    "SPREADSHEET" | "SLIDESHOW" | "FORM" | "JSON" | "OTHER";

export interface FileSAS {
    id: string;
    name: string;
    extension: string;
    directory: string;
    size: string;
    file_url: string;
    table_name: string;
    row_id: string;
    file_type: FileType;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date; 
}