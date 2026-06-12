import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from 'modules/gestion/entities/proyecto.entity';
import { Tarea } from 'modules/gestion/entities/tarea.entity';
import { EstadosProyectosEnum } from 'modules/gestion/enums/estados-proyectos.enum';
import { EstadosTareasEnum } from 'modules/gestion/enums/estados-tareas.enum';
import { Meta } from 'modules/gestion/entities/meta.entity';
import { EstadosMetasEnum } from 'modules/gestion/enums/estados-metas.enum';

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

            const proyectosActivos = await this.proyectosRepo.count({ where: { estado: EstadosProyectosEnum.ACTIVO } });
            const proyectosFinalizados = await this.proyectosRepo.count({ where: { estado: EstadosProyectosEnum.FINALIZADO } });
            const proyectosBaja = await this.proyectosRepo.count({ where: { estado: EstadosProyectosEnum.BAJA } });

            const totalProyectos = proyectosActivos + proyectosFinalizados + proyectosBaja;
            const porcentajeProyectosFinalizados = totalProyectos > 0
                ? (proyectosFinalizados / totalProyectos) * 100
                : 0;

            const tareasPendientes = await this.tareasRepo.count({ where: { estado: EstadosTareasEnum.PENDIENTE } });
            const tareasCompletadas = await this.tareasRepo.count({ where: { estado: EstadosTareasEnum.FINALIZADO } });
            const tareasBaja = await this.tareasRepo.count({ where: { estado: EstadosTareasEnum.BAJA } });

            const totalTareas = tareasPendientes + tareasCompletadas + tareasBaja;
            const porcentajeTareasCompletadas = totalTareas > 0
                ? (tareasCompletadas / totalTareas) * 100
                : 0;

            const metasActivas = await this.metasRepo.count({ where: { estado: EstadosMetasEnum.ACTIVO } });
            const metasCompletadas = await this.metasRepo.count({ where: { estado: EstadosMetasEnum.FINALIZADA } });
            const metasBaja = await this.metasRepo.count({ where: { estado: EstadosMetasEnum.BAJA } });

            const totalMetas = metasActivas + metasCompletadas + metasBaja;
            const porcentajeMetasCompletadas = totalMetas > 0
                ? (metasCompletadas / totalMetas) * 100
                : 0;

            return {
                proyectos: {
                    activos: proyectosActivos,
                    finalizados: proyectosFinalizados,
                    baja: proyectosBaja,
                    porcentajeFinalizados: porcentajeProyectosFinalizados,
                },
                tareas: {
                    pendientes: tareasPendientes,
                    completadas: tareasCompletadas,
                    baja: tareasBaja,
                    porcentajeCompletadas: porcentajeTareasCompletadas,
                },
                metas: {
                    activas: metasActivas,
                    completadas: metasCompletadas,
                    baja: metasBaja,
                    porcentajeCompletadas: porcentajeMetasCompletadas,
                },
            };
        }
    }