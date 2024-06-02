import { Evento, Parametrizador } from "../interfaces/parametrizador.interface";
import { politicas } from "./politica/politica.mockup";


export const eventos: Evento[] = [
    { id: 1, nome: "Criação", status: "CREATED", dataOcorrencia: new Date(2024, 0, 1), responsavel: "Arthur Ferreira" },
    { id: 2, nome: "Enviado para o Ambiente Analítico", status: "AWAITING_ANALYTIC_DECISION", dataOcorrencia: new Date(2024, 0, 2), responsavel: "Arthur Ferreira" },
    { id: 3, nome: "Enviado para Aprovação de Riscos", status: "AWAITING_RISK_DECISION", dataOcorrencia: new Date(2024, 0, 3), responsavel: "Arthur Ferreira" },
    { id: 4, nome: "Enviado para Aprovação de Riscos", status: "AWAITING_RISK_DECISION", dataOcorrencia: new Date(2024, 0, 4), responsavel: "Arthur Ferreira" },
    { id: 5, nome: "Enviado para o SAS", status: "ACTIVE", dataOcorrencia: new Date(2024, 0, 5), responsavel: "Arthur Ferreira" },
    { id: 6, nome: "Criação", status: "CREATED", dataOcorrencia: new Date(2024, 0, 6), responsavel: "Arthur Ferreira" },
    { id: 7, nome: "Excluído", status: "ACTIVE", dataOcorrencia: new Date(2024, 0, 7), responsavel: "Arthur Ferreira" }
] 

export const parametrizadores: Parametrizador[] = [
    { 
        id: 1, status: 'CREATED', versao: "1.0", dados: [],
        parametro: { 
            id: 1, nome: "parametro_1", descricao: "Parâmetro 1 - Descrição 1", modo: "chave", 
            dataVigencia: new Date(2024, 0, 1), horaVigencia: new Date(), cluster: politicas[0]?.cluster, politica: politicas[0] 
        },
        variaveis: [
            { id: 1, nome: "var_1", descricao: "Variável 1 - Descrição 1", isChave: true, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 2, nome: "var_2", descricao: "Variável 2 - Descrição 2", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 3, nome: "var_3", descricao: "Variável 3 - Descrição 3", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 4, nome: "var_4", descricao: "Variável 4 - Descrição 4", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 1, nome: "Item 1", checked: true },
                { id: 2, nome: "Item 2", checked: false },
                { id: 3, nome: "Item 3", checked: true },
                { id: 4, nome: "Item 4", checked: false },
                { id: 5, nome: "Item 5", checked: true },
            ] },
        ],
        eventos: eventos.slice(0, 1)
    },
    { 
        id: 2, status: 'ACTIVE', versao: "1.0", dados: [],
        parametro: { 
            id: 2, nome: "parametro_2", descricao: "Parâmetro 2 - Descrição 2", modo: "global", 
            dataVigencia: new Date(2024, 1, 1), horaVigencia: new Date(), cluster: politicas[1].cluster, politica: politicas[1] 
        },
        variaveis: [
            { id: 5, nome: "var_a", descricao: "Variável A - Descrição A", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 6, nome: "var_b", descricao: "Variável B - Descrição B", isChave: true, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 7, nome: "var_c", descricao: "Variável C - Descrição C", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 8, nome: "var_d", descricao: "Variável D - Descrição D", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 6, nome: "Item A", checked: false },
                { id: 7, nome: "Item B", checked: true },
                { id: 8, nome: "Item C", checked: false },
                { id: 9, nome: "Item D", checked: true },
                { id: 10, nome: "Item E", checked: false },
            ] },
        ],
        eventos: eventos.slice(0, 4)
    },
    { 
        id: 3, status: 'AWAITING_RISK_DECISION', versao: "2.0", dados: [],
        parametro: { 
            id: 3, nome: "parametro_3", descricao: "Parâmetro 3 - Descrição 3", modo: "global", 
            dataVigencia: new Date(2024, 2, 1), horaVigencia: new Date(), cluster: politicas[3].cluster, politica: politicas[3] 
        },
        variaveis: [
            { id: 9, nome: "var_5", descricao: "Variável 5 - Descrição 5", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 10, nome: "var_6", descricao: "Variável 6 - Descrição 6", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 11, nome: "var_7", descricao: "Variável 7 - Descrição 7", isChave: true, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 12, nome: "var_8", descricao: "Variável 8 - Descrição 8", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 11, nome: "Item 6", checked: false },
                { id: 12, nome: "Item 7", checked: true },
                { id: 13, nome: "Item 8", checked: true },
                { id: 14, nome: "Item 9", checked: true },
                { id: 15, nome: "Item 10", checked: false },
            ] },
        ],
        eventos: eventos.slice(0, 3)
    },
    { 
        id: 4, status: 'DELETED', versao: "1.0", dados: [],
        parametro: { 
            id: 4, nome: "parametro_4", descricao: "Parâmetro 4 - Descrição 4", modo: "chave", 
            dataVigencia: new Date(2024, 3, 1), horaVigencia: new Date(), cluster: politicas[30].cluster, politica: politicas[30] 
        },
        variaveis: [
            { id: 13, nome: "var_e", descricao: "Variável E - Descrição E", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 14, nome: "var_f", descricao: "Variável F - Descrição F", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 15, nome: "var_g", descricao: "Variável G - Descrição G", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 16, nome: "var_h", descricao: "Variável H - Descrição H", isChave: true, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 16, nome: "Item F", checked: false },
                { id: 17, nome: "Item G", checked: true },
                { id: 18, nome: "Item H", checked: true },
                { id: 19, nome: "Item I", checked: true },
                { id: 20, nome: "Item J", checked: false },
            ] },
        ],
        eventos: eventos.slice(5, 7)
    }
];