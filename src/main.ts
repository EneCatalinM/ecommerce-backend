import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { ProductsService } from './products/products.service';

async function bootstrap() {
  dotenv.config();
  
  const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*', // NOT RECOMMENDED FOR PRODUCTION
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, 
    });

  await app.listen(process.env.PORT || 6060);

  Logger.log('Application is running on: http://localhost:6060');
}
bootstrap();
