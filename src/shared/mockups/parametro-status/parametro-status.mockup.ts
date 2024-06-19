import { ParametroStatus } from "../../interfaces";

export const parametrosStatus: ParametroStatus[] = [
    { code: "001", type: "CREATED", description: "Criado" },
    { code: "002", type: "UPDATED", description: "Editável" },
    { code: "003", type: "DELETED", description: "Excluído" },
    { code: "004", type: "AVAILABLE_FOR_REVIEW", description: "Em Revisão" },
    { code: "005", type: "ANALYTICAL_ENVIRONMENT", description: "Em Homologação" },
    { code: "006", type: "PENDING_INITIAL_APPROVAL", description: "Aguardando Aprovação: Riscos" },
    { code: "007", type: "INITIAL_APPROVAL_REFUSED", description: "Recusado: Riscos" },
    { code: "008", type: "INITIAL_APPROVAL_COMPLETED", description: "Aprovado: Riscos" },
    { code: "009", type: "PENDING_FINAL_APPROVAL", description: "Aguardando Aprovação: T&O" },
    { code: "010", type: "FINAL_APPROVAL_REFUSED", description: "Recusado: T&O" },
    { code: "011", type: "FINAL_APPROVAL_COMPLETED", description: "Aprovado: T&O" },
    { code: "012", type: "AWAITING_IMPLEMENTATION", description: "Aguardando Implantação" },
    { code: "013", type: "PRODUCTION_ENVIRONMENT", description: "Em Produção" }
];