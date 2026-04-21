import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTareaDto } from './create-tarea.dto';
import { EstadosTareasEnum } from 'modules/gestion/enums/estados-tareas.enum';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {
  @ApiProperty({
    enum: EstadosTareasEnum,
    example: EstadosTareasEnum.PENDIENTE,
  })
  @IsEnum(EstadosTareasEnum)
  @IsOptional()
  estado?: EstadosTareasEnum;
}
