import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import elasticsearchClient from 'src/elasticsearch.client';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const cacheKey = 'all_products';

    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productModel.find().exec();

    await this.cacheManager.set(cacheKey, products, 600);

    return products;
  }

  async getProductById(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }


  async createProduct(createProductDto: any): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    const product = await createdProduct.save();

    await this.cacheManager.del('all_products');

    await elasticsearchClient.index({
      index: 'products',
      id: product._id.toString(),
      body: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        tags: product.tags,
        images: product.images,
        stock: product.stock,
      },
    });

    return product;
  }

  async updateProduct(id: string, updateProductDto: any): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();

    await this.cacheManager.del('all_products');

    if (product) {
      await elasticsearchClient.update({
        index: 'products',
        id: product._id.toString(),
        body: {
          doc: {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tags: product.tags,
            images: product.images,
            stock: product.stock,
          },
        },
      });
    }

    return product;
  }

  async deleteProduct(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id).exec();

    await this.cacheManager.del('all_products');

    if (product) {
      await elasticsearchClient.delete({
        index: 'products',
        id: product._id.toString(),
      });
    }
  
    return product;
  }

  async reindexProducts() {
    const products = await this.productModel.find().exec();
    for (const product of products) {
      await elasticsearchClient.index({
        index: 'products',
        id: product._id.toString(),
        body: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          tags: product.tags,
          images: product.images,
          stock: product.stock,
        },
      });
    }
  }
}