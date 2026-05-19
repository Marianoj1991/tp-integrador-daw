import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from '../entities/meta.entity';
import { CreateMetaDto } from '../dtos/input/create-meta.dto';
import { UpdateMetaDto } from '../dtos/input/update-meta.dto';
import { EstadosMetasEnum } from '../enums/estados-metas.enum';
import { ProyectosService } from './proyectos.service';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(Meta)
    private readonly metasRepository: Repository<Meta>,
    private readonly proyectosService: ProyectosService,
  ) {}

  async crearMeta(dto: CreateMetaDto): Promise<Meta> {
    const meta: Meta = this.metasRepository.create(dto);
    meta.estado = EstadosMetasEnum.ACTIVO;

    if (dto.idProyecto) {
      const proyectoActivo: boolean =
        await this.proyectosService.existeProyectoActivoPorId(dto.idProyecto);

      if (!proyectoActivo) {
        throw new BadRequestException(
          'Se debe especificar un proyecto activo para la meta',
        );
      }
    }
    return await this.metasRepository.save(meta);
  }

  async actualizarMeta(dto: UpdateMetaDto, idMeta: number): Promise<void> {
    const meta: Meta | null = await this.metasRepository.findOne({
      where: { id: idMeta },
    });

    if (!meta) {
      throw new BadRequestException(`No existe una meta con id ${idMeta}`);
    }

    this.metasRepository.merge(meta, dto);
    await this.metasRepository.save(meta);
  }

  async obtenerMetasPorProyecto(idProyecto: number): Promise<Meta[]> {
    return await this.metasRepository.find({
      where: { idProyecto },
      relations: ['proyecto', 'tareas'], //sql join (ademas de la tabla metas, trae tambien proyecto y tareas)
    });
  }
}
