import { ApiProperty } from '@nestjs/swagger';
import { EstadosMetasEnum } from '../../enums/estados-metas.enum';

export class ListMetaDTO {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ enum: EstadosMetasEnum })
  estado!: EstadosMetasEnum;

}
