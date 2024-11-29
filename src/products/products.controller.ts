import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.decorator';
import { Types } from 'mongoose';
import elasticsearchClient from 'src/elasticsearch.client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async createProduct(@Body() createProductDto: any): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    const response = await elasticsearchClient.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'description', 'category'],
          },
        },
      },
    });

    return response.hits.hits.map((hit: any) => {
      return {_id: hit._id, ...hit._source};
    } )
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    return this.productsService.getProductById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: any): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.deleteProduct(id);
  }
}
