import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { Proyecto } from './proyecto.entity';
import { Meta } from './meta.entity';

@Entity({ name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'estado', type: 'enum', enum: EstadosTareasEnum })
  estado!: EstadosTareasEnum;
  
  @Column()
  descripcion!: string;

  @Column({ name: "id_proyecto" })
  idProyecto!: number;

  @ManyToOne(()=>Proyecto)
  @JoinColumn({name:"id_proyecto"})
  proyecto!: Proyecto

  @Column({ name: "id_meta", nullable: false })
  idMeta!: number;

  @ManyToOne(() => Meta)
  @JoinColumn({ name: "id_meta" })
  meta!: Meta;
}


