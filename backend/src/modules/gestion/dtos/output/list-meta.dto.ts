import { ApiProperty } from '@nestjs/swagger';
import { EstadosMetasEnum } from '../../enums/estados-metas.enum';

/*
      Aca se define un DTO (Data Transfer Object) que es una clase, con los datos del backend 
      que se envian al frontend para listar las metas de un proyecto. 
      Se utiliza la libreria "@nestjs/swagger" para generar la documentacion de la API.
      Se utiliza el operador "!" para indicar que los valores son obligatorios. 
      
*/

export class ListMetaDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ enum: EstadosMetasEnum })
  estado!: EstadosMetasEnum;

}
