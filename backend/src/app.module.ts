import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'modules/auth/auth.module';
import { GestionModule } from 'modules/gestion/gestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    GestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
