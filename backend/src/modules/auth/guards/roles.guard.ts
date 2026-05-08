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
    // 1. Obtenemos los roles requeridos desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<RolEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Si la ruta no tiene el decorador @Roles, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtenemos al usuario que el AuthGuard pegó en la request
    const { usuario } = context.switchToHttp().getRequest();

    // 4. Verificamos si el usuario tiene el rol necesario
    const tieneRol = requiredRoles.some((rol) => usuario.rol === rol);

    if (!tieneRol) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}
