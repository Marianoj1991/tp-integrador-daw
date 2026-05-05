import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { Cliente } from './cliente.entity';
import { Tarea } from './tarea.entity';

<<<<<<< HEAD
@Entity({ name: 'proyectos' })
=======
@Entity({ name: "proyectos" })
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca
export class Proyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ type: 'enum', enum: EstadosProyectosEnum })
  estado!: EstadosProyectosEnum;

  @Column({ name: 'id_cliente' })
  idCliente!: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

<<<<<<< HEAD
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas!: Tarea[];
}
=======
    @ManyToOne(()=>Cliente)
    @JoinColumn({name: "id_cliente"})
    cliente!: Cliente;

    @OneToMany(()=>Tarea, (tarea)=> tarea.proyecto)
    tareas!: Tarea[];

}
>>>>>>> 100729f0344e56cf2ed2a300aeb32ca7ed2585ca
