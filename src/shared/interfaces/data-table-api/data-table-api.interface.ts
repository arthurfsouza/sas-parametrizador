export interface DataTableAPIFilter {
    column: string;
    value: string;
}
export interface DataTableAPI {
    offset: number; // Default 0
    limit: number; // Default 25
    order: { column: string, direction: "ASC" | "DESC" };
    count: number;
    filters: DataTableAPIFilter[];    
    items: any[];
}