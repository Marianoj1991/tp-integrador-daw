import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { Proyecto } from './proyecto.entity';

@Entity({ name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

<<<<<<< HEAD
  @Column()
  descripcion!: string;
=======
    @PrimaryGeneratedColumn()
    id!: number;
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca

  @Column({ name: 'estado', type: 'enum', enum: EstadosTareasEnum })
  estado!: EstadosTareasEnum;

<<<<<<< HEAD
  @Column({ name: 'id_proyecto' })
  idProyecto!: number;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto!: Proyecto;
=======
    @Column({ name: "estado", type: "enum", enum: EstadosTareasEnum })
    estado!: EstadosTareasEnum;

    @Column({ name: "id_proyecto" })
    idProyecto!: number;

    @ManyToOne(()=>Proyecto)
    @JoinColumn({name:"id_proyecto"})
    proyecto!: Proyecto
    
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca
}
