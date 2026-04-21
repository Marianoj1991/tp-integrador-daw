import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/clientes.controller';
import { ProyectosController } from './controllers/proyectos.controller';
import { TareasController } from './controllers/tareas.controller';

@Module({
  controllers: [ClientesController, ProyectosController, TareasController],
  providers: [],
  imports: [],
  exports: [],
})
export class GestionModule {}
