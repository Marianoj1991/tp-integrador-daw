import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre único de usuario para el inicio de sesión',
    example: 'nuevo_usuario',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    description: 'Contraseña en texto plano (será encriptada en el backend)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  clave!: string;
}
