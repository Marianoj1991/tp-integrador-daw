import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ListProyectoDTO } from '../dtos/output/list-proyecto.dto';
import { ProyectoDTO } from '../dtos/output/proyecto.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ProyectosService } from '../services/proyectos.service';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { RolEnum } from 'common/enums/rol.enum';
import { Roles } from 'modules/auth/decorators/roles.decorator';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    return await this.proyectosService.crearProyecto(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Put(':id')
  async actualizarProyecto(
    @Body() dto: UpdateProyectoDto,
    @Param('id') id: number,
  ): Promise<void> {
    return await this.proyectosService.actualizarProyecto(id, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
  @UseGuards(AuthGuard)
  @Get()
  async obtenerProyectos(): Promise<ListProyectoDTO[]> {
    return await this.proyectosService.obtenerProyectos();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async obtenerProyecto(@Param('id') id: number): Promise<ProyectoDTO> {
    return await this.proyectosService.obtenerProyecto(id);
  }
}
