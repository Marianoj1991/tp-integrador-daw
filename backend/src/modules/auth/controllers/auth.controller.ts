import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    throw new NotImplementedException();
  }
}
