import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { MetasService } from '../services/metas.service';
import { CreateMetaDto } from '../dtos/input/create-meta.dto';
import { UpdateMetaDto } from '../dtos/input/update-meta.dto';
import { Meta } from '../entities/meta.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolEnum } from '../../../common/enums/rol.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('metas')
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Post()
  async crearMeta(
    @Body() createMetaDto: CreateMetaDto
  ): Promise<Meta> {
    return await this.metasService.crearMeta(createMetaDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('proyecto/:idProyecto')
  async obtenerMetasPorProyecto(
    @Param('idProyecto', ParseIntPipe) idProyecto: number
  ): Promise<Meta[]> {
    return await this.metasService.obtenerMetasPorProyecto(idProyecto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @Put(':id')
  async actualizarMeta(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetaDto: UpdateMetaDto,
  ): Promise<void> {
    return await this.metasService.actualizarMeta(updateMetaDto, id);
  }

}
