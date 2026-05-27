import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from 'modules/gestion/entities/proyecto.entity';
import { Tarea } from 'modules/gestion/entities/tarea.entity';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { Meta } from 'modules/gestion/entities/meta.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Proyecto, Tarea, Meta])],
    providers: [EstadisticasService],
    controllers: [EstadisticasController],
})
export class EstadisticasModule { }
