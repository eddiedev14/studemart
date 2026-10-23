import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('nodeEnv') !== 'production',
        namingStrategy: new SnakeNamingStrategy(),
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
  ],
})
export class DatabaseModule {}
