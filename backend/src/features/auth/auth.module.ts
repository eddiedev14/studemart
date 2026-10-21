import { Module } from '@nestjs/common';
import { StoresModule } from '../stores/stores.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, StoresModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
