import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from '../entities/tarea.entity';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { Meta } from '../entities/meta.entity';
import { Proyecto } from '../entities/proyecto.entity';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { EstadosMetasEnum } from '../enums/estados-metas.enum';

@Injectable()
export class TareaService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Meta) private readonly metaRepository: Repository<Meta>,
    @InjectRepository(Proyecto) private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async crearTarea(
    dto: CreateTareaDto,
    idProyecto: number,
  ): Promise<{ id: number; nombre: string }> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: idProyecto },
    });
    if (proyecto && proyecto.estado === EstadosProyectosEnum.BAJA) {
      throw new BadRequestException(
        'No se puede crear una tarea para un proyecto dado de baja',
      );
    }

    const idMeta = dto.idMeta;
    const meta = await this.metaRepository.findOne({
      where: { id: idMeta },
    });
    if (!meta) {
      throw new BadRequestException(`No existe una meta con id ${idMeta}`);
    }

    if (meta.estado === EstadosMetasEnum.BAJA) {
      throw new BadRequestException(
        'No se puede crear una tarea asociada a una meta dada de baja',
      );
    }

    if (meta.estado === EstadosMetasEnum.FINALIZADA) {
      throw new BadRequestException(
        'No se puede crear una tarea asociada a una meta finalizada',
      );
    }

    const tarea: Tarea = this.tareaRepository.create({
      ...dto,
      idMeta,
    });
    tarea.estado = EstadosTareasEnum.PENDIENTE;
    tarea.idProyecto = idProyecto;
    await this.tareaRepository.save(tarea);
    return { id: tarea.id, nombre: tarea.descripcion };
  }

  async actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void> {
    const tarea: Tarea | null = await this.tareaRepository.findOne({
      where: { id: idTarea },
    });

    if (!tarea) {
      throw new BadRequestException(`No existe una tarea con id ${idTarea}`);
    }

    const proyecto = await this.proyectoRepository.findOne({
      where: { id: tarea.idProyecto },
    });
    if (proyecto && proyecto.estado === EstadosProyectosEnum.BAJA) {
      throw new BadRequestException(
        'No se puede modificar una tarea de un proyecto dado de baja',
      );
    }

    const meta = await this.metaRepository.findOne({
      where: { id: tarea.idMeta },
    });
    if (meta && meta.estado === EstadosMetasEnum.BAJA) {
      throw new BadRequestException(
        'No se puede modificar una tarea asociada a una meta dada de baja',
      );
    }

    if (meta && meta.estado === EstadosMetasEnum.FINALIZADA) {
      throw new BadRequestException(
        'No se puede modificar una tarea asociada a una meta finalizada',
      );
    }

    this.tareaRepository.merge(tarea, dto);
    await this.tareaRepository.save(tarea);
  }

  async exportTareasCsv(idProyecto: number): Promise<string> {
    const tareas: Tarea[] = await this.tareaRepository.find({
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

    const headers = ['id', 'descripcion', 'estado', 'id_proyecto'];

    const rows = tareas.map((t) => [
      t.id,
      t.descripcion,
      t.estado,
      t.idProyecto,
    ]);

    const csvLines = [headers.join(',')].concat(
      rows.map((r) => r.map((c) => escape(c)).join(',')),
    );

    return csvLines.join('\n');
  }
}
