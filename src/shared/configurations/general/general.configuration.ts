export const general = {
    projectName: "Santander - Parametrizador (SAS)",
    routes: {
        auth: {
            error: {
                unauthorized: "error/401/",
                permissionDenied: "error/403/",
                pageNotFound: "error/404/",
                internalError: "error/500/"
            }
        },
        private: {
            segmentos: "segmentos",
            clusters: "clusters",
            politicas: "politicas",
            parametros: "parametros"
        }
    },
    version: "1.0.0",
    versionAPI: "1.0.0"
}