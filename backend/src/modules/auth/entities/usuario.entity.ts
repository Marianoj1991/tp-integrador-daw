import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estado-usuarios.enum';
import { RolEnum } from 'common/enums/rol.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  clave!: string;

  @Column({ type: 'enum', enum: EstadosUsuariosEnum })
  estado!: EstadosUsuariosEnum;

  @Column({
    type: 'enum',
    enum: RolEnum,
    default: RolEnum.USER,
  })
  rol!: RolEnum;
}
