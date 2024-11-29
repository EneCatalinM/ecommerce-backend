import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CartModule } from './cart/cart.module';
import * as ioredisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      store: ioredisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600, // Timpul de expirare pentru cache în secunde (10 minute)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    NotificationsModule,
    CartModule
  ],
})
export class AppModule {}
