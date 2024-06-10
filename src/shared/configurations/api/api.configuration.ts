import { environment } from "../../../environments/environment";

const apiURL: string = environment.application.api.url;

export const api = {
    private: {
        login: apiURL + "v1/front/login",
        segmento: {
            get: apiURL + "v1/front/segmentos",
            post: apiURL + "v1/front/segmentos",
            put: apiURL + "v1/front/segmentos",
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