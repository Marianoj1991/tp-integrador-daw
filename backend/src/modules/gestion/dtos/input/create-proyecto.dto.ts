import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProyectoDto {
  @ApiProperty({ example: 'Sitio Web Cuchillería Orix' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  idCliente?: number;
}
