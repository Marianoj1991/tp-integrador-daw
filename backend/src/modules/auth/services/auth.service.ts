import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/input/login.dto';
import { UsuarioService } from './usuarios.service';
import { CreateUsuarioDto } from '../dtos/input/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { RolEnum } from 'common/enums/rol.enum';
import { EstadosUsuariosEnum } from '../enums/estado-usuarios.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const usuario = await this.usuarioService.buscarUsuarioActivoPorNombre(
      dto.nombre,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
      throw new UnauthorizedException();
    }

    const payload = {
      nombre: usuario.nombre,
      sub: usuario.id,
      rol: usuario.rol,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUsuarioDto): Promise<{ accessToken: string }> {
    const { clave, nombre } = dto;

    const existeUsuario =
      await this.usuarioService.buscarUsuarioActivoPorNombre(nombre);
    if (existeUsuario) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const claveEncriptada = await bcrypt.hash(clave, salt);

    const nuevoUsuario = this.usuariosRepository.create({
      nombre,
      clave: claveEncriptada,
      estado: EstadosUsuariosEnum.ACTIVO,
      rol: RolEnum.USER,
    });

    const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario);

    const payload = {
      nombre: usuarioGuardado.nombre,
      sub: usuarioGuardado.id,
      rol: usuarioGuardado.rol,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
