import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolEnum } from '../../../common/enums/rol.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const { usuario } = context.switchToHttp().getRequest();

    const tieneRol = requiredRoles.some((rol) => usuario.rol === rol);

    if (!tieneRol) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}
