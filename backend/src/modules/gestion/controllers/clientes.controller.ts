import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto.js';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ListClienteDTO } from '../dtos/output/list-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Controller('clientes')
export class ClientesController {
  constructor() {}

  @ApiBearerAuth()
  @Post()
  async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    throw new NotImplementedException();
  }

  @ApiBearerAuth()
  @Put(':id')
  async actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    throw new NotImplementedException();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ListClienteDTO, isArray: true })
  @Get()
  async obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum,
  ): Promise<ListClienteDTO[]> {
    throw new NotImplementedException();
  }
}
