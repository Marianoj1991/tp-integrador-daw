import { EstadosMetasEnum } from "../estados-metas-enum";

/*
      Aca se define un DTO (Data Transfer Object) que es una interfaz, con los datos que se
      reciben desde el frontend cuando se actualiza una meta.
      Todos los campos son opcionales.
*/

export interface UpdateMetaDTO {
    nombre?: string;
    estado?: EstadosMetasEnum;
}
