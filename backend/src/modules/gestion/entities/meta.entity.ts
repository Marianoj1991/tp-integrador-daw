import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Tarea } from './tarea.entity';
import { EstadosMetasEnum } from '../enums/estados-metas.enum';

@Entity({ name: 'metas' })
export class Meta {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column()
  nombre!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadosMetasEnum })
  estado!: EstadosMetasEnum;

  @Column({ name: 'id_proyecto' })
  idProyecto!: number;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'id_proyecto' }) //llave foranea
  proyecto!: Proyecto;

  @OneToMany(() => Tarea, (tarea) => tarea.meta)
  tareas!: Tarea[];
}
