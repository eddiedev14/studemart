import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/stores.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthAccountsService } from './auth-accounts.service';
import { AuthLoginController } from './auth-login.controller';
import { AuthLoginService } from './auth-login.service';
import { AuthSession } from './entities/auth-session.entity';
import { JwtSessionGuard } from './guards/jwt-session.guard';
import { RolesGuard } from './guards/roles.guard';
import { createJwtOptions } from './jwt.config';

@Module({
  imports: [
    UsersModule,
    StoresModule,
    TypeOrmModule.forFeature([AuthSession]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createJwtOptions,
    }),
  ],
  controllers: [AuthController, AuthLoginController],
  providers: [
    AuthService,
    AuthAccountsService,
    AuthLoginService,
    JwtSessionGuard,
    RolesGuard,
  ],
  exports: [AuthLoginService, JwtSessionGuard, RolesGuard],
})
export class AuthModule {}
