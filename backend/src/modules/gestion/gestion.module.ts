import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/clientes.controller';
import { ProyectosController } from './controllers/proyectos.controller';
import { TareasController } from './controllers/tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Proyecto } from './entities/proyecto.entity';
import { Tarea } from './entities/tarea.entity';
import { TareaService } from './services/tarea.service'
import { AuthModule } from '../auth/auth.module';
import { ClientesService } from './services/clientes.service';
import { ProyectosService } from './services/proyectos.service';
import { MetasController } from './controllers/metas.controller';
import { MetasService } from './services/metas.service';
import { Meta } from './entities/meta.entity';

@Module({
  controllers: [ClientesController, ProyectosController, TareasController, MetasController],
  providers: [TareaService, ClientesService, ProyectosService, MetasService],
  imports: [
    TypeOrmModule.forFeature([Cliente, Proyecto, Tarea, Meta]), 
    AuthModule
  ],
  exports: [],
})
export class GestionModule {}
