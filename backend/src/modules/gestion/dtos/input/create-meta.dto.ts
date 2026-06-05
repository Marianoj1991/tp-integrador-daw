import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

/*
      Aca se define un DTO (Data Transfer Object) que es una clase, con los datos del frontend 
      que se envian al backend para crear una meta. 
      Se utiliza la libreria "class-validator" para validar los datos que se reciben. 
      Se utiliza la libreria "@nestjs/swagger" para generar la documentacion de la API.
      Se utiliza el operador "!" para indicar que los valores son obligatorios.
*/

export class CreateMetaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idProyecto!: number;
}
