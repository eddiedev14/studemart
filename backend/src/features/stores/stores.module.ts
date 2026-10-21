import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCategory } from './entities/store-category.entity';
import { Tenant } from './entities/tenant.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, StoreCategory])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [TypeOrmModule],
})
export class StoresModule {}
