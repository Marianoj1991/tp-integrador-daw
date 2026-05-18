import { Body, Controller, Param, Post, Put, UseGuards, Get, Res } from '@nestjs/common';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TareaService } from '../services/tarea.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { Roles } from 'modules/auth/decorators/roles.decorator';
import { RolEnum } from 'common/enums/rol.enum';
import type {Response} from 'express';

@Controller('proyectos/:idProyecto/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareaService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('export/csv')
  async exportCsv(@Param('idProyecto') idProyecto: number, @Res() res: Response): Promise<void> {
    const csv = await this.tareasService.exportTareasCsv(idProyecto);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="tareas_${idProyecto}.csv"`);
    res.send(csv);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Post()
  async crearTarea(
    @Body() dto: CreateTareaDto,
    @Param('idProyecto') idProyecto: number,
  ): Promise<{ id: number }> {
    return await this.tareasService.crearTarea(dto, idProyecto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Put(':id')
  async actualizarTarea(
    @Body() dto: UpdateTareaDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.tareasService.actualizarTarea(dto, id);
  }
}
