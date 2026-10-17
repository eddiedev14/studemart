import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { CartsModule } from './features/carts/carts.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { OrdersModule } from './features/orders/orders.module';
import { ProductsModule } from './features/products/products.module';
import { StoresModule } from './features/stores/stores.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    StoresModule,
    ProductsModule,
    CartsModule,
    OrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
