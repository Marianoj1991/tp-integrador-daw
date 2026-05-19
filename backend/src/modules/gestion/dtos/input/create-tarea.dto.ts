import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idMeta!: number;
}

