import { Cluster, Evento, Parametrizador, Politica, Segmento } from "../interfaces/parametrizador.interface";

export const segmentos: Segmento[] = [
    { id: 1, nome: "segmento_1", descricao: "Segmento 1 - Descrição 1", isAtivo: true },
    { id: 2, nome: "segmento_2", descricao: "Segmento 2 - Descrição 2", isAtivo: false },
    { id: 3, nome: "segmento_3", descricao: "Segmento 3 - Descrição 3", isAtivo: true },
    { id: 4, nome: "segmento_4", descricao: "Segmento 4 - Descrição 4", isAtivo: false },
    { id: 5, nome: "segmento_5", descricao: "Segmento 5 - Descrição 5", isAtivo: true }
];

export const clusters: Cluster[] = [
    { id: 1, nome: "cluster_1", descricao: "Cluster 1 - Descrição 1", isAtivo: true, segmento: segmentos[0] },
    { id: 2, nome: "cluster_2", descricao: "Cluster 2 - Descrição 2", isAtivo: false, segmento: segmentos[0] },
    { id: 3, nome: "cluster_3", descricao: "Cluster 3 - Descrição 3", isAtivo: true, segmento: segmentos[0] },
    { id: 4, nome: "cluster_4", descricao: "Cluster 4 - Descrição 4", isAtivo: false, segmento: segmentos[1] },
    { id: 5, nome: "cluster_5", descricao: "Cluster 5 - Descrição 5", isAtivo: true, segmento: segmentos[1] },
    { id: 6, nome: "cluster_6", descricao: "Cluster 6 - Descrição 6", isAtivo: false, segmento: segmentos[1] },
    { id: 7, nome: "cluster_7", descricao: "Cluster 7 - Descrição 7", isAtivo: true, segmento: segmentos[2] },
    { id: 8, nome: "cluster_8", descricao: "Cluster 8 - Descrição 8", isAtivo: false, segmento: segmentos[2] },
    { id: 9, nome: "cluster_9", descricao: "Cluster 9 - Descrição 9", isAtivo: true, segmento: segmentos[2] },
    { id: 10, nome: "cluster_10", descricao: "Cluster 10 - Descrição 10", isAtivo: false, segmento: segmentos[3] },
    { id: 11, nome: "cluster_11", descricao: "Cluster 11 - Descrição 11", isAtivo: true, segmento: segmentos[3] },
    { id: 12, nome: "cluster_12", descricao: "Cluster 12 - Descrição 12", isAtivo: false, segmento: segmentos[3] },
    { id: 13, nome: "cluster_13", descricao: "Cluster 13 - Descrição 13", isAtivo: true, segmento: segmentos[4] },
    { id: 14, nome: "cluster_14", descricao: "Cluster 14 - Descrição 14", isAtivo: false, segmento: segmentos[4] },
    { id: 15, nome: "cluster_15", descricao: "Cluster 15 - Descrição 15", isAtivo: true, segmento: segmentos[4] }
];

export const politicas: Politica[] = [
    { id: 1, nome: "politica_1", descricao: "Politica 1 - Descrição 1", isAtivo: true, cluster: clusters[0] },
    { id: 2, nome: "politica_2", descricao: "Politica 2 - Descrição 2", isAtivo: false, cluster: clusters[0] },
    { id: 3, nome: "politica_3", descricao: "Politica 3 - Descrição 3", isAtivo: true, cluster: clusters[0] },
    { id: 4, nome: "politica_4", descricao: "Politica 4 - Descrição 4", isAtivo: false, cluster: clusters[1] },
    { id: 5, nome: "politica_5", descricao: "Politica 5 - Descrição 5", isAtivo: true, cluster: clusters[1] },
    { id: 6, nome: "politica_6", descricao: "Politica 6 - Descrição 6", isAtivo: false, cluster: clusters[1] },
    { id: 7, nome: "politica_7", descricao: "Politica 7 - Descrição 7", isAtivo: true, cluster: clusters[2] },
    { id: 8, nome: "politica_8", descricao: "Politica 8 - Descrição 8", isAtivo: false, cluster: clusters[2] },
    { id: 9, nome: "politica_9", descricao: "Politica 9 - Descrição 9", isAtivo: true, cluster: clusters[2] },
    { id: 10, nome: "politica_10", descricao: "Politica 10 - Descrição 10", isAtivo: false, cluster: clusters[3] },
    { id: 11, nome: "politica_11", descricao: "Politica 11 - Descrição 11", isAtivo: true, cluster: clusters[3] },
    { id: 12, nome: "politica_12", descricao: "Politica 12 - Descrição 12", isAtivo: false, cluster: clusters[3] },
    { id: 13, nome: "politica_13", descricao: "Politica 13 - Descrição 13", isAtivo: true, cluster: clusters[4] },
    { id: 14, nome: "politica_14", descricao: "Politica 14 - Descrição 14", isAtivo: false, cluster: clusters[4] },
    { id: 15, nome: "politica_15", descricao: "Politica 15 - Descrição 15", isAtivo: true, cluster: clusters[4] },
    { id: 16, nome: "politica_16", descricao: "Politica 16 - Descrição 16", isAtivo: false, cluster: clusters[5] },
    { id: 17, nome: "politica_17", descricao: "Politica 17 - Descrição 17", isAtivo: true, cluster: clusters[5] },
    { id: 18, nome: "politica_18", descricao: "Politica 18 - Descrição 18", isAtivo: false, cluster: clusters[5] },
    { id: 19, nome: "politica_19", descricao: "Politica 19 - Descrição 19", isAtivo: true, cluster: clusters[6] },
    { id: 20, nome: "politica_20", descricao: "Politica 20 - Descrição 20", isAtivo: false, cluster: clusters[6] },
    { id: 21, nome: "politica_21", descricao: "Politica 21 - Descrição 21", isAtivo: true, cluster: clusters[6] },
    { id: 22, nome: "politica_22", descricao: "Politica 22 - Descrição 22", isAtivo: false, cluster: clusters[7] },
    { id: 23, nome: "politica_23", descricao: "Politica 23 - Descrição 23", isAtivo: true, cluster: clusters[7] },
    { id: 24, nome: "politica_24", descricao: "Politica 24 - Descrição 24", isAtivo: false, cluster: clusters[7] },
    { id: 25, nome: "politica_25", descricao: "Politica 25 - Descrição 25", isAtivo: true, cluster: clusters[8] },
    { id: 26, nome: "politica_26", descricao: "Politica 26 - Descrição 26", isAtivo: false, cluster: clusters[8] },
    { id: 27, nome: "politica_27", descricao: "Politica 27 - Descrição 27", isAtivo: true, cluster: clusters[8] },
    { id: 28, nome: "politica_28", descricao: "Politica 28 - Descrição 28", isAtivo: false, cluster: clusters[9] },
    { id: 29, nome: "politica_29", descricao: "Politica 29 - Descrição 29", isAtivo: true, cluster: clusters[9] },
    { id: 30, nome: "politica_30", descricao: "Politica 30 - Descrição 30", isAtivo: false, cluster: clusters[9] },
    { id: 31, nome: "politica_31", descricao: "Politica 31 - Descrição 31", isAtivo: true, cluster: clusters[10] },
    { id: 32, nome: "politica_32", descricao: "Politica 32 - Descrição 32", isAtivo: false, cluster: clusters[10] },
    { id: 33, nome: "politica_33", descricao: "Politica 33 - Descrição 33", isAtivo: true, cluster: clusters[10] },
    { id: 34, nome: "politica_34", descricao: "Politica 34 - Descrição 34", isAtivo: false, cluster: clusters[11] },
    { id: 35, nome: "politica_35", descricao: "Politica 35 - Descrição 35", isAtivo: true, cluster: clusters[11] },
    { id: 36, nome: "politica_36", descricao: "Politica 36 - Descrição 36", isAtivo: false, cluster: clusters[11] },
    { id: 37, nome: "politica_37", descricao: "Politica 37 - Descrição 37", isAtivo: true, cluster: clusters[12] },
    { id: 38, nome: "politica_38", descricao: "Politica 38 - Descrição 38", isAtivo: false, cluster: clusters[12] },
    { id: 39, nome: "politica_39", descricao: "Politica 39 - Descrição 39", isAtivo: true, cluster: clusters[12] },
    { id: 40, nome: "politica_40", descricao: "Politica 40 - Descrição 40", isAtivo: false, cluster: clusters[13] },
    { id: 41, nome: "politica_41", descricao: "Politica 41 - Descrição 41", isAtivo: true, cluster: clusters[13] },
    { id: 42, nome: "politica_42", descricao: "Politica 42 - Descrição 42", isAtivo: false, cluster: clusters[13] },
    { id: 43, nome: "politica_43", descricao: "Politica 43 - Descrição 43", isAtivo: true, cluster: clusters[14] },
    { id: 44, nome: "politica_44", descricao: "Politica 44 - Descrição 44", isAtivo: false, cluster: clusters[14] },
    { id: 45, nome: "politica_45", descricao: "Politica 45 - Descrição 45", isAtivo: true, cluster: clusters[14] }
];

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
            dataVigencia: new Date(2024, 0, 1), horaVigencia: new Date(), cluster: politicas[0].cluster, politica: politicas[0] 
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