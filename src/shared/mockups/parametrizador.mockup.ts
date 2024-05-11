import { Cluster, Parametrizador, Politica, Segmento } from "../interfaces/parametrizador.interface";

export const segmentos: Segmento[] = [
    { id: 1, nome: "Segmento 1", descricao: "Segmento 1 - Descrição 1", isAtivo: true },
    { id: 2, nome: "Segmento 2", descricao: "Segmento 2 - Descrição 2", isAtivo: false },
    { id: 3, nome: "Segmento 3", descricao: "Segmento 3 - Descrição 3", isAtivo: true },
    { id: 4, nome: "Segmento 4", descricao: "Segmento 4 - Descrição 4", isAtivo: false },
    { id: 5, nome: "Segmento 5", descricao: "Segmento 5 - Descrição 5", isAtivo: true }
];

export const clusters: Cluster[] = [
    { id: 1, nome: "Cluster 1", descricao: "Cluster 1 - Descrição 1", isAtivo: true, segmento: segmentos[0] },
    { id: 2, nome: "Cluster 2", descricao: "Cluster 2 - Descrição 2", isAtivo: false, segmento: segmentos[0] },
    { id: 3, nome: "Cluster 3", descricao: "Cluster 3 - Descrição 3", isAtivo: true, segmento: segmentos[0] },
    { id: 4, nome: "Cluster 4", descricao: "Cluster 4 - Descrição 4", isAtivo: false, segmento: segmentos[1] },
    { id: 5, nome: "Cluster 5", descricao: "Cluster 5 - Descrição 5", isAtivo: true, segmento: segmentos[1] },
    { id: 6, nome: "Cluster 6", descricao: "Cluster 6 - Descrição 6", isAtivo: false, segmento: segmentos[1] },
    { id: 7, nome: "Cluster 7", descricao: "Cluster 7 - Descrição 7", isAtivo: true, segmento: segmentos[2] },
    { id: 8, nome: "Cluster 8", descricao: "Cluster 8 - Descrição 8", isAtivo: false, segmento: segmentos[2] },
    { id: 9, nome: "Cluster 9", descricao: "Cluster 9 - Descrição 9", isAtivo: true, segmento: segmentos[2] },
    { id: 10, nome: "Cluster 10", descricao: "Cluster 10 - Descrição 10", isAtivo: false, segmento: segmentos[3] },
    { id: 11, nome: "Cluster 11", descricao: "Cluster 11 - Descrição 11", isAtivo: true, segmento: segmentos[3] },
    { id: 12, nome: "Cluster 12", descricao: "Cluster 12 - Descrição 12", isAtivo: false, segmento: segmentos[3] },
    { id: 13, nome: "Cluster 13", descricao: "Cluster 13 - Descrição 13", isAtivo: true, segmento: segmentos[4] },
    { id: 14, nome: "Cluster 14", descricao: "Cluster 14 - Descrição 14", isAtivo: false, segmento: segmentos[4] },
    { id: 15, nome: "Cluster 15", descricao: "Cluster 15 - Descrição 15", isAtivo: true, segmento: segmentos[4] }
];

export const politicas: Politica[] = [
    { id: 1, nome: "Politica 1", descricao: "Politica 1 - Descrição 1", isAtivo: true, cluster: clusters[0] },
    { id: 2, nome: "Politica 2", descricao: "Politica 2 - Descrição 2", isAtivo: false, cluster: clusters[0] },
    { id: 3, nome: "Politica 3", descricao: "Politica 3 - Descrição 3", isAtivo: true, cluster: clusters[0] },
    { id: 4, nome: "Politica 4", descricao: "Politica 4 - Descrição 4", isAtivo: false, cluster: clusters[1] },
    { id: 5, nome: "Politica 5", descricao: "Politica 5 - Descrição 5", isAtivo: true, cluster: clusters[1] },
    { id: 6, nome: "Politica 6", descricao: "Politica 6 - Descrição 6", isAtivo: false, cluster: clusters[1] },
    { id: 7, nome: "Politica 7", descricao: "Politica 7 - Descrição 7", isAtivo: true, cluster: clusters[2] },
    { id: 8, nome: "Politica 8", descricao: "Politica 8 - Descrição 8", isAtivo: false, cluster: clusters[2] },
    { id: 9, nome: "Politica 9", descricao: "Politica 9 - Descrição 9", isAtivo: true, cluster: clusters[2] },
    { id: 10, nome: "Politica 10", descricao: "Politica 10 - Descrição 10", isAtivo: false, cluster: clusters[3] },
    { id: 11, nome: "Politica 11", descricao: "Politica 11 - Descrição 11", isAtivo: true, cluster: clusters[3] },
    { id: 12, nome: "Politica 12", descricao: "Politica 12 - Descrição 12", isAtivo: false, cluster: clusters[3] },
    { id: 13, nome: "Politica 13", descricao: "Politica 13 - Descrição 13", isAtivo: true, cluster: clusters[4] },
    { id: 14, nome: "Politica 14", descricao: "Politica 14 - Descrição 14", isAtivo: false, cluster: clusters[4] },
    { id: 15, nome: "Politica 15", descricao: "Politica 15 - Descrição 15", isAtivo: true, cluster: clusters[4] },
    { id: 16, nome: "Politica 16", descricao: "Politica 16 - Descrição 16", isAtivo: false, cluster: clusters[5] },
    { id: 17, nome: "Politica 17", descricao: "Politica 17 - Descrição 17", isAtivo: true, cluster: clusters[5] },
    { id: 18, nome: "Politica 18", descricao: "Politica 18 - Descrição 18", isAtivo: false, cluster: clusters[5] },
    { id: 19, nome: "Politica 19", descricao: "Politica 19 - Descrição 19", isAtivo: true, cluster: clusters[6] },
    { id: 20, nome: "Politica 20", descricao: "Politica 20 - Descrição 20", isAtivo: false, cluster: clusters[6] },
    { id: 21, nome: "Politica 21", descricao: "Politica 21 - Descrição 21", isAtivo: true, cluster: clusters[6] },
    { id: 22, nome: "Politica 22", descricao: "Politica 22 - Descrição 22", isAtivo: false, cluster: clusters[7] },
    { id: 23, nome: "Politica 23", descricao: "Politica 23 - Descrição 23", isAtivo: true, cluster: clusters[7] },
    { id: 24, nome: "Politica 24", descricao: "Politica 24 - Descrição 24", isAtivo: false, cluster: clusters[7] },
    { id: 25, nome: "Politica 25", descricao: "Politica 25 - Descrição 25", isAtivo: true, cluster: clusters[8] },
    { id: 26, nome: "Politica 26", descricao: "Politica 26 - Descrição 26", isAtivo: false, cluster: clusters[8] },
    { id: 27, nome: "Politica 27", descricao: "Politica 27 - Descrição 27", isAtivo: true, cluster: clusters[8] },
    { id: 28, nome: "Politica 28", descricao: "Politica 28 - Descrição 28", isAtivo: false, cluster: clusters[9] },
    { id: 29, nome: "Politica 29", descricao: "Politica 29 - Descrição 29", isAtivo: true, cluster: clusters[9] },
    { id: 30, nome: "Politica 30", descricao: "Politica 30 - Descrição 30", isAtivo: false, cluster: clusters[9] },
    { id: 31, nome: "Politica 31", descricao: "Politica 31 - Descrição 31", isAtivo: true, cluster: clusters[10] },
    { id: 32, nome: "Politica 32", descricao: "Politica 32 - Descrição 32", isAtivo: false, cluster: clusters[10] },
    { id: 33, nome: "Politica 33", descricao: "Politica 33 - Descrição 33", isAtivo: true, cluster: clusters[10] },
    { id: 34, nome: "Politica 34", descricao: "Politica 34 - Descrição 34", isAtivo: false, cluster: clusters[11] },
    { id: 35, nome: "Politica 35", descricao: "Politica 35 - Descrição 35", isAtivo: true, cluster: clusters[11] },
    { id: 36, nome: "Politica 36", descricao: "Politica 36 - Descrição 36", isAtivo: false, cluster: clusters[11] },
    { id: 37, nome: "Politica 37", descricao: "Politica 37 - Descrição 37", isAtivo: true, cluster: clusters[12] },
    { id: 38, nome: "Politica 38", descricao: "Politica 38 - Descrição 38", isAtivo: false, cluster: clusters[12] },
    { id: 39, nome: "Politica 39", descricao: "Politica 39 - Descrição 39", isAtivo: true, cluster: clusters[12] },
    { id: 40, nome: "Politica 40", descricao: "Politica 40 - Descrição 40", isAtivo: false, cluster: clusters[13] },
    { id: 41, nome: "Politica 41", descricao: "Politica 41 - Descrição 41", isAtivo: true, cluster: clusters[13] },
    { id: 42, nome: "Politica 42", descricao: "Politica 42 - Descrição 42", isAtivo: false, cluster: clusters[13] },
    { id: 43, nome: "Politica 43", descricao: "Politica 43 - Descrição 43", isAtivo: true, cluster: clusters[14] },
    { id: 44, nome: "Politica 44", descricao: "Politica 44 - Descrição 44", isAtivo: false, cluster: clusters[14] },
    { id: 45, nome: "Politica 45", descricao: "Politica 45 - Descrição 45", isAtivo: true, cluster: clusters[14] }
];

export const parametrizadores: Parametrizador[] = [
    { 
        id: 1, status: 'CREATED', versao: "1.0", dados: [],
        parametro: { 
            id: 1, nome: "Parâmetro 1", descricao: "Parâmetro 1 - Descrição 1", modo: "chave", 
            dataVigencia: new Date(2024, 0, 1), horaVigencia: new Date(), cluster: politicas[0].cluster, politica: politicas[0] 
        },
        variaveis: [
            { id: 1, nome: "Var 1", descricao: "Desc 1", isChave: true, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 2, nome: "Var 2", descricao: "Desc 2", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 3, nome: "Var 3", descricao: "Desc 3", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 4, nome: "Var 4", descricao: "Desc 4", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 1, nome: "Item 1", checked: true },
                { id: 2, nome: "Item 2", checked: false },
                { id: 3, nome: "Item 3", checked: true },
                { id: 4, nome: "Item 4", checked: false },
                { id: 5, nome: "Item 5", checked: true },
            ] },
        ]
    },
    { 
        id: 2, status: 'ACTIVE', versao: "1.0", dados: [],
        parametro: { 
            id: 2, nome: "Parâmetro 2", descricao: "Parâmetro 2 - Descrição 2", modo: "global", 
            dataVigencia: new Date(2024, 1, 1), horaVigencia: new Date(), cluster: politicas[1].cluster, politica: politicas[1] 
        },
        variaveis: [
            { id: 5, nome: "Var 1", descricao: "Desc 1", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 6, nome: "Var 2", descricao: "Desc 2", isChave: true, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 7, nome: "Var 3", descricao: "Desc 3", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 8, nome: "Var 4", descricao: "Desc 4", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 6, nome: "Item 1", checked: false },
                { id: 7, nome: "Item 2", checked: true },
                { id: 8, nome: "Item 3", checked: false },
                { id: 9, nome: "Item 4", checked: true },
                { id: 10, nome: "Item 5", checked: false },
            ] },
        ]
    },
    { 
        id: 3, status: 'AWAITING_RISK_DECISION', versao: "2.0", dados: [],
        parametro: { 
            id: 3, nome: "Parâmetro 3", descricao: "Parâmetro 3 - Descrição 3", modo: "global", 
            dataVigencia: new Date(2024, 2, 1), horaVigencia: new Date(), cluster: politicas[3].cluster, politica: politicas[3] 
        },
        variaveis: [
            { id: 9, nome: "Var 1", descricao: "Desc 1", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 10, nome: "Var 2", descricao: "Desc 2", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 11, nome: "Var 3", descricao: "Desc 3", isChave: true, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 12, nome: "Var 4", descricao: "Desc 4", isChave: false, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 11, nome: "Item 1", checked: false },
                { id: 12, nome: "Item 2", checked: true },
                { id: 13, nome: "Item 3", checked: true },
                { id: 14, nome: "Item 4", checked: true },
                { id: 15, nome: "Item 5", checked: false },
            ] },
        ]
    },
    { 
        id: 4, status: 'DELETED', versao: "1.0", dados: [],
        parametro: { 
            id: 4, nome: "Parâmetro 4", descricao: "Parâmetro 4 - Descrição 4", modo: "chave", 
            dataVigencia: new Date(2024, 3, 1), horaVigencia: new Date(), cluster: politicas[30].cluster, politica: politicas[30] 
        },
        variaveis: [
            { id: 13, nome: "Var 1", descricao: "Desc 1", isChave: false, tipo: "DECIMAL", tamanho: 2, qtdCasasDecimais: 2, lista: [] },
            { id: 14, nome: "Var 2", descricao: "Desc 2", isChave: false, tipo: "NUMERICO", tamanho: 6, qtdCasasDecimais: null, lista: [] },
            { id: 15, nome: "Var 3", descricao: "Desc 3", isChave: false, tipo: "TEXTO", tamanho: 50, qtdCasasDecimais: null, lista: [] },
            { id: 16, nome: "Var 4", descricao: "Desc 4", isChave: true, tipo: "LISTA", tamanho: 3, qtdCasasDecimais: null, lista: [
                { id: 16, nome: "Item 1", checked: false },
                { id: 17, nome: "Item 2", checked: true },
                { id: 18, nome: "Item 3", checked: true },
                { id: 19, nome: "Item 4", checked: true },
                { id: 20, nome: "Item 5", checked: false },
            ] },
        ]
    }
];