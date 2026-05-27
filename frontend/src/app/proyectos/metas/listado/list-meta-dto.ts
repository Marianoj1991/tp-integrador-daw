import { EstadosMetasEnum } from "../estados-metas-enum";

export interface ListMetaDTO {
    id: number;
    nombre: string;
    estado: EstadosMetasEnum;
    idProyecto: number;
}
