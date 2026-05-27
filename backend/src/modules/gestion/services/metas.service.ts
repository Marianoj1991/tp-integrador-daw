import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from '../entities/meta.entity';
import { Tarea } from '../entities/tarea.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { CreateMetaDto } from '../dtos/input/create-meta.dto';
import { UpdateMetaDto } from '../dtos/input/update-meta.dto';
import { EstadosMetasEnum } from '../enums/estados-metas.enum';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { ProyectosService } from './proyectos.service';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(Meta)
    private readonly metasRepository: Repository<Meta>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    private readonly proyectosService: ProyectosService,
  ) {}

  async crearMeta(dto: CreateMetaDto): Promise<Meta> {
    if (dto.idProyecto) {
      const proyecto = await this.proyectoRepository.findOne({
        where: { id: dto.idProyecto },
      });
      if (proyecto && proyecto.estado === EstadosProyectosEnum.BAJA) {
        throw new BadRequestException(
          'No se puede crear una meta para un proyecto dado de baja',
        );
      }
      
      const proyectoActivo: boolean =
        await this.proyectosService.existeProyectoActivoPorId(dto.idProyecto);

      if (!proyectoActivo) {
        throw new BadRequestException(
          'Se debe especificar un proyecto activo para la meta',
        );
      }
    }

    const meta: Meta = this.metasRepository.create(dto);
    meta.estado = EstadosMetasEnum.ACTIVO;
    return await this.metasRepository.save(meta);
  }

  async actualizarMeta(dto: UpdateMetaDto, idMeta: number): Promise<void> {
    const meta: Meta | null = await this.metasRepository.findOne({
      where: { id: idMeta },
    });

    if (!meta) {
      throw new BadRequestException(`No existe una meta con id ${idMeta}`);
    }

    const proyecto = await this.proyectoRepository.findOne({
      where: { id: meta.idProyecto },
    });
    if (proyecto && proyecto.estado === EstadosProyectosEnum.BAJA) {
      throw new BadRequestException(
        'No se puede modificar una meta de un proyecto dado de baja',
      );
    }

    if (dto.estado === EstadosMetasEnum.FINALIZADA) {
      const tareasPendientes = await this.tareaRepository.count({
        where: {
          idMeta: idMeta,
          estado: EstadosTareasEnum.PENDIENTE,
        },
      });

      if (tareasPendientes > 0) {
        throw new BadRequestException(
          'No se puede finalizar la meta porque tiene tareas pendientes',
        );
      }
    }

    const estadoAnterior = meta.estado;

    this.metasRepository.merge(meta, dto);

    if (dto.estado === EstadosMetasEnum.BAJA) {
      await this.tareaRepository.update(
        { idMeta: idMeta },
        { estado: EstadosTareasEnum.BAJA },
      );
    } else if (
      estadoAnterior === EstadosMetasEnum.BAJA &&
      dto.estado === EstadosMetasEnum.ACTIVO
    ) {
      await this.tareaRepository.update(
        { idMeta: idMeta, estado: EstadosTareasEnum.BAJA },
        { estado: EstadosTareasEnum.PENDIENTE },
      );
    }

    await this.metasRepository.save(meta);
  }

  async obtenerMetasPorProyecto(idProyecto: number): Promise<Meta[]> {
    return await this.metasRepository.find({
      where: { idProyecto },
      relations: ['proyecto', 'tareas'], //sql join (ademas de la tabla metas, trae tambien proyecto y tareas)
    });
  }

  async exportMetasCsv(idProyecto: number): Promise<string> {
    const metas: Meta[] = await this.metasRepository.find({
      where: { idProyecto },
      order: { id: 'ASC' },
    });

    const escape = (val: any) => {
      if (val === null || val === undefined) return '';
      const s = String(val);
      if (s.includes('"') || s.includes(',') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const headers = ['id', 'nombre', 'estado', 'id_proyecto'];

    const rows = metas.map((m) => [m.id, m.nombre, m.estado, m.idProyecto]);

    const csvLines = [headers.join(',')].concat(
      rows.map((r) => r.map((c) => escape(c)).join(',')),
    );

    return csvLines.join('\n');
  }
}
