import { EstadosMetasEnum } from "../estados-metas-enum";

export interface UpdateMetaDTO {
    nombre?: string;
    estado?: EstadosMetasEnum;
}
