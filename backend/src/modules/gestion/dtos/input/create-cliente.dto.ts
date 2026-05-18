import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, Matches } from 'class-validator';


export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/)
  telefono?: string;

  @ApiProperty({required:false})
  @IsOptional()
  @IsEmail()
  email?: string;


}
