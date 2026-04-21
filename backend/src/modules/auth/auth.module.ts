import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';

@Module({
  providers: [],
  controllers: [AuthController],
  imports: [],
  exports: [],
})
export class AuthModule {}
