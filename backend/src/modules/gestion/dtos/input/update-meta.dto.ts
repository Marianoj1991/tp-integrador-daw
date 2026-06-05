import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMetaDto } from './create-meta.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadosMetasEnum } from '../../enums/estados-metas.enum';

/*

    Esta clase permite actualizar una meta, sin necesidad de enviar todas las propiedades.
    Solo se envía el campo 'estado', el cual es opcional y debe ser un valor del enum EstadosMetasEnum.

    @OmitType(CreateMetaDto, ['idProyecto'] as const):
    - OmitType crea una nueva clase de DTO que es una copia de CreateMetaDto,
    pero excluyendo la propiedad idProyecto.

    @PartialType:
    - PartialType es un decorador que convierte todas las propiedades de un DTO en opcionales.

*/

export class UpdateMetaDto extends PartialType(
  OmitType(CreateMetaDto, ['idProyecto'] as const),
) {
  @ApiProperty({
    enum: EstadosMetasEnum,
    example: EstadosMetasEnum.ACTIVO,
  })
  @IsEnum(EstadosMetasEnum)
  @IsOptional()
  estado?: EstadosMetasEnum;
}
