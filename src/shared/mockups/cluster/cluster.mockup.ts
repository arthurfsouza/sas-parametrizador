import { Cluster } from "../../interfaces";
import { segmentos } from "../segmento/segmento.mockup";

export const clusters: Cluster[] = [
    { id: "d5acfcc5-0925-4a13-9c91-6b846069c3bc", nome: "cluster_1", descricao: "Cluster 1 - Descrição 1", is_ativo: true, segmento_id: "6e6f135f-0b46-4883-b52c-05fa2109d127", segmento: segmentos[0] },
    { id: "51d31770-15fc-4d82-b3c1-f8e2802b19e8", nome: "cluster_2", descricao: "Cluster 2 - Descrição 2", is_ativo: false, segmento_id: "6e6f135f-0b46-4883-b52c-05fa2109d127", segmento: segmentos[0] },
    { id: "e13f6564-d4e5-400f-acde-7a7a4a210b53", nome: "cluster_3", descricao: "Cluster 3 - Descrição 3", is_ativo: true, segmento_id: "6e6f135f-0b46-4883-b52c-05fa2109d127", segmento: segmentos[0] },
    { id: "113a8798-775a-437b-8182-7b697d075b2c", nome: "cluster_4", descricao: "Cluster 4 - Descrição 4", is_ativo: false, segmento_id: "44c4c2b5-80c6-499a-bccc-e402f7c41410", segmento: segmentos[1] },
    { id: "9284ff1c-797f-48e7-8028-9be8a856f1f3", nome: "cluster_5", descricao: "Cluster 5 - Descrição 5", is_ativo: true, segmento_id: "44c4c2b5-80c6-499a-bccc-e402f7c41410", segmento: segmentos[1] },
    { id: "ae8612a6-a6f1-4825-be53-46d81f7d5064", nome: "cluster_6", descricao: "Cluster 6 - Descrição 6", is_ativo: false, segmento_id: "44c4c2b5-80c6-499a-bccc-e402f7c41410", segmento: segmentos[1] },
    { id: "35272da0-4e91-4918-bbb3-97e28b0e1f7f", nome: "cluster_7", descricao: "Cluster 7 - Descrição 7", is_ativo: true, segmento_id: "4e54dd47-fa34-4e8e-9e0d-214afb21a280", segmento: segmentos[2] },
    { id: "fee98eeb-7cac-4113-b75c-81d10eb00ba1", nome: "cluster_8", descricao: "Cluster 8 - Descrição 8", is_ativo: false, segmento_id: "4e54dd47-fa34-4e8e-9e0d-214afb21a280", segmento: segmentos[2] },
    { id: "edb08787-928e-4ac5-a7f2-634e1d8907d4", nome: "cluster_9", descricao: "Cluster 9 - Descrição 9", is_ativo: true, segmento_id: "4e54dd47-fa34-4e8e-9e0d-214afb21a280", segmento: segmentos[2] },
    { id: "178cd87f-cd3e-4deb-b4a1-7f6c6fffee34", nome: "cluster_10", descricao: "Cluster 10 - Descrição 10", is_ativo: false, segmento_id: "7e94a362-f9d2-4d2b-ac05-aa6166ab79e6", segmento: segmentos[3] },
    { id: "c314124c-485e-4b76-90a3-4824a99f5c0c", nome: "cluster_11", descricao: "Cluster 11 - Descrição 11", is_ativo: true, segmento_id: "7e94a362-f9d2-4d2b-ac05-aa6166ab79e6", segmento: segmentos[3] },
    { id: "d9cf194f-aeb5-4394-90b8-46a5bb2eaff6", nome: "cluster_12", descricao: "Cluster 12 - Descrição 12", is_ativo: false, segmento_id: "7e94a362-f9d2-4d2b-ac05-aa6166ab79e6", segmento: segmentos[3] },
    { id: "48ccfcb2-1953-4f0f-b13e-5726397ed947", nome: "cluster_13", descricao: "Cluster 13 - Descrição 13", is_ativo: true, segmento_id: "2d35fe74-23f6-4f57-9e5d-f270ecca1232", segmento: segmentos[4] },
    { id: "3c6f4cdb-73cd-4e50-a9ab-c526aff05fd4", nome: "cluster_14", descricao: "Cluster 14 - Descrição 14", is_ativo: false, segmento_id: "2d35fe74-23f6-4f57-9e5d-f270ecca1232", segmento: segmentos[4] },
    { id: "7772f322-7ca0-4bb6-a303-78e67751a6ff", nome: "cluster_15", descricao: "Cluster 15 - Descrição 15", is_ativo: true, segmento_id: "2d35fe74-23f6-4f57-9e5d-f270ecca1232", segmento: segmentos[4] }
];