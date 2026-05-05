<<<<<<< HEAD
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { Proyecto } from './proyecto.entity';

@Entity({ name: 'clientes' })
=======
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { Proyecto } from "./proyecto.entity";

@Entity({name: "clientes"})
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

<<<<<<< HEAD
  @Column({ type: 'enum', enum: EstadosClientesEnum })
  estado!: EstadosClientesEnum;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
=======
    @Column({type: 'enum', enum: EstadosClientesEnum})
    estado!: EstadosClientesEnum;

    @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
    proyectos!: Proyecto [];
    
}
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca
