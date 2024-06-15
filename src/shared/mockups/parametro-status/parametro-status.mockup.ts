import { ParametroStatus } from "../../interfaces";

export const parametrosStatus: ParametroStatus[] = [
    { code: "001", type: "CREATED", description: "Criado" },
    { code: "002", type: "UPDATED", description: "Atualizado" },
    { code: "003", type: "DELETED", description: "Excluído" },
    { code: "004", type: "AVAILABLE_FOR_REVIEW", description: "Disponível para Revisão" },
    { code: "005", type: "ANALYTICAL_ENVIRONMENT", description: "Em ambiente Analítico" },
    { code: "006", type: "PENDING_INITIAL_APPROVAL", description: "Pendente de Aprovação Inicial" },
    { code: "007", type: "INITIAL_APPROVAL_REFUSED", description: "Aprovação Inicial Recusada" },
    { code: "008", type: "INITIAL_APPROVAL_COMPLETED", description: "Aprovação Inicial Concluída" },
    { code: "009", type: "PENDING_FINAL_APPROVAL", description: "Pendente de Aprovação Final" },
    { code: "010", type: "FINAL_APPROVAL_REFUSED", description: "Aprovação Final Recusada" },
    { code: "011", type: "FINAL_APPROVAL_COMPLETED", description: "Aprovação Final Concluída" },
    { code: "012", type: "AWAITING_IMPLEMENTATION", description: "Aguardando Implantação" },
    { code: "013", type: "PRODUCTION_ENVIRONMENT", description: "Em Ambiente de Produção" }
];