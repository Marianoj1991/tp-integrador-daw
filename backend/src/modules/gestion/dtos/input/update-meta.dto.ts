import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMetaDto } from './create-meta.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadosMetasEnum } from '../../enums/estados-metas.enum';

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
