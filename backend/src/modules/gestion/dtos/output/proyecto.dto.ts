import { ApiProperty } from '@nestjs/swagger';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';
import { ListTareaDTO } from './list-tarea.dto';
import { EstadosMetasEnum } from '../../enums/estados-metas.enum';

export class ProyectoDTO {
  @ApiProperty()
  nombre!: string;

  @ApiProperty({ enum: EstadosProyectosEnum })
  estado!: EstadosProyectosEnum;

  @ApiProperty()
  cliente!: string;

  @ApiProperty({ type: [ListTareaDTO] })
  tareas!: ListTareaDTO[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        nombre: { type: 'string' },
        estado: { type: 'string', enum: Object.values(EstadosMetasEnum) }
      }
    }
  })
  metas!: { id: number; nombre: string; estado: EstadosMetasEnum }[];
}