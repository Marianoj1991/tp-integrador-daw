import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from 'modules/gestion/entities/proyecto.entity';
import { Tarea } from 'modules/gestion/entities/tarea.entity';
import { EstadosProyectosEnum } from 'modules/gestion/enums/estados-proyectos.enum';
import { EstadosTareasEnum } from 'modules/gestion/enums/estados-tareas.enum';
import { Meta } from 'modules/gestion/entities/meta.entity';

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectRepository(Proyecto)
        private readonly proyectosRepo: Repository<Proyecto>,
        @InjectRepository(Tarea)
        private readonly tareasRepo: Repository<Tarea>,
        @InjectRepository(Meta)
        private readonly metasRepo: Repository<Meta>,
    ) { }

    async obtenerEstadisticas() {
        const proyectosActivos = await this.proyectosRepo.count({
            where: { estado: EstadosProyectosEnum.ACTIVO },
        });

        const proyectosFinalizados = await this.proyectosRepo.count({
            where: { estado: EstadosProyectosEnum.FINALIZADO },
        });

        const proyectosBaja = await this.proyectosRepo.count({
            where: { estado: EstadosProyectosEnum.BAJA },
        })

        const proyectosPorCliente = await this.proyectosRepo
            .createQueryBuilder('proyecto')
            .leftJoin('proyecto.cliente', 'cliente')
            .select('cliente.nombre', 'nombreCliente')
            .addSelect('COUNT(*)', 'cantidad')
            .groupBy('cliente.nombre')
            .getRawMany();


        const tareasPendientes = await this.tareasRepo.count({
            where: { estado: EstadosTareasEnum.PENDIENTE },
        });

        const tareasCompletadas = await this.tareasRepo.count({
            where: { estado: EstadosTareasEnum.FINALIZADO },
        });

        const totalTareas = tareasPendientes + tareasCompletadas;
        const porcentajeCompletadas = totalTareas > 0
            ? (tareasCompletadas / totalTareas) * 100 : 0;

        const tareasPorProyecto = await this.tareasRepo
            .createQueryBuilder('tarea')
            .select('tarea.idProyecto', 'idProyecto')
            .addSelect(
                `SUM(CASE WHEN tarea.estado = :pendiente THEN 1 ELSE 0 END)`,
                'pendientes',
            )
            .addSelect(
                `SUM(CASE WHEN tarea.estado = :finalizado THEN 1 ELSE 0 END)`,
                'finalizadas',
            )
            .setParameter('pendiente', EstadosTareasEnum.PENDIENTE)
            .setParameter('finalizado', EstadosTareasEnum.FINALIZADO)
            .groupBy('tarea.idProyecto')
            .getRawMany();


        const progresoPorMetas = await this.tareasRepo
            .createQueryBuilder('tarea')
            .select('tarea.idMeta', 'idMeta')
            .addSelect('COUNT(*)', 'totalTareas')
            .addSelect(
                `SUM(CASE WHEN tarea.estado = :estadoFinalizada THEN 1 ELSE 0 END)`,
                'tareasCompletadas',
            )
            .setParameter('estadoFinalizada', EstadosTareasEnum.FINALIZADO)
            .groupBy('tarea.idMeta')
            .getRawMany();

        const metas = await this.metasRepo
            .createQueryBuilder('meta')
            .leftJoin('meta.tareas', 'tarea')
            .select('meta.id', 'idMeta')
            .addSelect(
                `CASE WHEN COUNT(tarea.id) > 0 
                AND SUM(CASE WHEN tarea.estado = :finalizado THEN 1 ELSE 0 END) = COUNT(tarea.id)
                THEN true ELSE false END`,
                'cumplida',
            )
            .setParameter('finalizado', EstadosTareasEnum.FINALIZADO)
            .groupBy('meta.id')
            .getRawMany();


        return {
            proyectosActivos, proyectosFinalizados, proyectosBaja, proyectosPorCliente, tareasPendientes, tareasCompletadas, porcentajeCompletadas, tareasPorProyecto, progresoPorMetas: metas,

        };
    }


}

