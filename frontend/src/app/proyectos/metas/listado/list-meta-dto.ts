import { EstadosMetasEnum } from "../estados-metas-enum";
/*
        Aca se define un DTO (Data Transfer Object) que es una interfaz, con los datos que se
        reciben desde el backend cuando se soliciten todas las metas de un proyecto.
        No recibimos todos los datos de la meta, solo los que se necesitan para 
        mostrar en la tabla de metas.
*/
export interface ListMetaDTO {
    id: number;
    nombre: string;
    estado: EstadosMetasEnum;
}
