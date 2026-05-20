import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolEnum } from 'common/enums/rol.enum';
import { CreateUsuarioDto } from '../dtos/input/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }
}
