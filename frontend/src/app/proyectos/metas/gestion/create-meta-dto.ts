/*
      Aca se define un DTO (Data Transfer Object) que es una interfaz, con los datos que se
      envian desde el frontend cuando se crea una nueva meta.
*/
export interface CreateMetaDTO {
    nombre: string;
    idProyecto: number;
}

