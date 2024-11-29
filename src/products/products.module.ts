import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CacheModule.register(), // Importă CacheModule aici pentru a rezolva dependința CACHE_MANAGER
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
