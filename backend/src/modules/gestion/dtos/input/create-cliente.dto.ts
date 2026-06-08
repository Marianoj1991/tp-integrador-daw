import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'El teléfono solo puede contener números',
  })
  @MinLength(10, { message: 'Debe incluir característica y número (mínimo 10 dígitos)' })
  @MaxLength(15, { message: 'El teléfono no puede superar los 15 dígitos' })
  telefono?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
