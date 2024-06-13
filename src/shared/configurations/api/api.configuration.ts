import { environment } from "../../../environments/environment";

const apiURL: string = environment.application.api.url;

export const api = {
    private: {
        login: apiURL + "v1/front/login",
        segmento: {
            delete: apiURL + "v1/front/segmentos/{SEGMENTO_ID}",
            getAll: apiURL + "v1/front/segmentos",
            getByID: apiURL + "v1/front/segmentos/{SEGMENTO_ID}",
            post: apiURL + "v1/front/segmentos" + "_base",
            put: apiURL + "v1/front/segmentos/{SEGMENTO_ID}"
        },
        cluster: {
            get: apiURL + "v1/front/clusters",
            post: apiURL + "v1/front/clusters",
            put: apiURL + "v1/front/clusters",
        },
        politica: {
            get: apiURL + "v1/front/politicas",
            post: apiURL + "v1/front/politicas",
            put: apiURL + "v1/front/politicas",
        }
    }
};