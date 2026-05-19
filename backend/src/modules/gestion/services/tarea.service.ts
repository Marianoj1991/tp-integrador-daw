import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from '../entities/tarea.entity';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { Meta } from '../entities/meta.entity';

@Injectable()
export class TareaService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Meta) private readonly metaRepository: Repository<Meta>,
  ) {}

  async crearTarea(
    dto: CreateTareaDto,
  ): Promise<{ id: number; nombre: string }> {
    const meta = await this.metaRepository.findOne({
      where: { id: dto.idMeta },
    });
    if (!meta) {
      throw new BadRequestException(`No existe una meta con id ${dto.idMeta}`);
    }

    const tarea: Tarea = this.tareaRepository.create(dto);
    tarea.estado = EstadosTareasEnum.PENDIENTE;
    tarea.idProyecto = meta.idProyecto;
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
