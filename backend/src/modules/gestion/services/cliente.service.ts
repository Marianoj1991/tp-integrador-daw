import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Repository } from 'typeorm';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { Proyecto } from '../entities/proyecto.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    private readonly proyectosRepository: Repository<Proyecto>,
  ) {}

  async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
    const cliente: Cliente = this.clientesRepository.create(dto);

    cliente.estado = EstadosClientesEnum.ACTIVO;

    await this.clientesRepository.save(cliente);

    return { id: cliente.id };
  }

  async actualizarCliente(
    dto: UpdateClienteDto,
    idCliente: number,
  ): Promise<void> {
    const cliente: Cliente | null = await this.clientesRepository.findOne({
      where: { id: idCliente },
    });

    if (!cliente) {
      throw new BadRequestException('La cliente indicada no existe');
    }

    this.clientesRepository.merge(cliente, dto);

    await this.clientesRepository.save(cliente);
  }

  async darBajaCliente(idCliente: number): Promise<void> {
    const cantidadProyectos: number = await this.proyectosRepository.count({
      where: { idCliente },
    });

    if (cantidadProyectos > 0) {
      throw new BadRequestException('El cliente tiene proyecto vinculados.');
    }

    await this.clientesRepository.update(idCliente, {
      estado: EstadosClientesEnum.BAJA,
    });
  }
}
