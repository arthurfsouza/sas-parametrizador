import { environment } from "../../../environments/environment";

const apiURL: string = environment.application.api.url;

export const api = {
    private: {
        login: apiURL + "v1/front/login",
        segmento: {
            delete: apiURL + "v1/front/segmentos/{SEGMENTO_ID}",
            getAll: apiURL + "v1/front/segmentos",
            getByID: apiURL + "v1/front/segmentos/{SEGMENTO_ID}",
            post: apiURL + "v1/front/segmentos",
            put: apiURL + "v1/front/segmentos/{SEGMENTO_ID}"
        },
        cluster: {
            delete: apiURL + "v1/front/clusters/{CLUSTER_ID}",
            getAll: apiURL + "v1/front/clusters",
            getByID: apiURL + "v1/front/clusters/{CLUSTER_ID}",
            post: apiURL + "v1/front/clusters",
            put: apiURL + "v1/front/clusters/{CLUSTER_ID}",
        },
        politica: {
            delete: apiURL + "v1/front/politicas/{POLITICA_ID}",
            getAll: apiURL + "v1/front/politicas",
            getByID: apiURL + "v1/front/politicas/{POLITICA_ID}",
            post: apiURL + "v1/front/politicas",
            put: apiURL + "v1/front/politicas/{POLITICA_ID}",
        },
        parametro: {
            delete: apiURL + "v1/front/parametros/{PARAMETRO_ID}",
            getAll: apiURL + "v1/front/parametros/datatable",
            getByID: apiURL + "v1/front/parametros/{PARAMETRO_ID}",
            post: apiURL + "v1/front/parametros",
            put: apiURL + "v1/front/parametros/{PARAMETRO_ID}",
            variavel: { post: apiURL + "v1/front/parametros/{PARAMETRO_ID}/variaveis" },
            dado: { post: apiURL + "v1/front/parametros/{PARAMETRO_ID}/dados" },
            status: { post: apiURL + "v1/front/parametros/{PARAMETRO_ID}/status" }
        }
    }
};