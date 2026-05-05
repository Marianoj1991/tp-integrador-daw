import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tarea } from "../entities/tarea.entity";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";


@Injectable()
export class TareaService {

    constructor(@InjectRepository(Tarea) private readonly tareaRepository: Repository<Tarea>) {}

    async crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{ id: number, nombre: string }> {
        const tarea: Tarea = this.tareaRepository.create(dto);
        tarea.estado = EstadosTareasEnum.PENDIENTE;
        tarea.idProyecto = idProyecto;
        await this.tareaRepository.save(tarea);
        return { id: tarea.id, nombre: tarea.descripcion };
    }

    async actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void> {
        const tarea: Tarea | null = await this.tareaRepository.findOne({ where: { id: idTarea } });

        if (!tarea) {
            throw new BadRequestException(`No existe una tarea con id ${idTarea}`);
        }
        this.tareaRepository.merge(tarea, dto);
        await this.tareaRepository.save(tarea);
    }
}