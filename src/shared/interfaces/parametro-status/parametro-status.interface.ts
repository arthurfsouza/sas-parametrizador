export type ParametroStatusCode = "001" | "002" | "003" | "004" | "005" | "006" | "007" | "008" | "009" | "010" | "011";

export type ParametroStatusType = "CREATED" | "UPDATED" | "DELETED" | "AVAILABLE_FOR_REVIEW" | "ANALYTICAL_ENVIRONMENT" |
    "PENDING_INITIAL_APPROVAL" | "INITIAL_APPROVAL_COMPLETED" | "PENDING_FIINAL_APPROVAL" | "FINAL_APPROVAL_COMPLETED" |
    "AWAITING_IMPLEMENTATION" | "PRODUCTION_ENVIRONMENT";

export interface ParametroStatus {
    code: ParametroStatusCode;
    type: ParametroStatusType;
    description: string;
}