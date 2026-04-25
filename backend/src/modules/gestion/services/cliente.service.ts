import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Repository } from 'typeorm';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
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
}
