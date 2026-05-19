import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTareaDto } from './create-tarea.dto';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';

export class UpdateTareaDto extends PartialType(OmitType(CreateTareaDto, ['idMeta'] as const)) {
  @ApiProperty({
    enum: EstadosTareasEnum,
    example: EstadosTareasEnum.PENDIENTE
  })
  @IsEnum(EstadosTareasEnum)
  @IsOptional()
  estado?: EstadosTareasEnum;
}
