import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { Product, ProductDocument } from 'src/products/product.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>, 
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async placeOrder(userId: string, products: any[], userEmail: string): Promise<Order> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const userObjectId = new Types.ObjectId(userId);

    if (!Array.isArray(products) || products.length === 0) {
      throw new BadRequestException('Products array is invalid or empty');
    }

    let totalPrice = 0;
    const productDetails = [];

    for (const product of products) {
      if (!product.productId || !Types.ObjectId.isValid(product.productId)) {
        throw new BadRequestException('Invalid product ID');
      }

      const productDetail = await this.productModel.findById(product.productId).exec();
      if (!productDetail) {
        throw new NotFoundException(`Product not found with ID: ${product.productId}`);
      }

      if (typeof product.quantity !== 'number' || product.quantity <= 0) {
        throw new BadRequestException('Invalid product quantity');
      }

      totalPrice += productDetail.price * product.quantity;
      
      productDetails.push({
        productId: product.productId,
        quantity: product.quantity,
        price: productDetail.price
      });
    }

    const order = new this.orderModel({
      userId: userObjectId,
      products: productDetails,
      totalPrice,
      status: 'pending',
    });

    const savedOrder = await order.save();

    // Set Email adress in order for notificationService to work
    // await this.notificationsService.sendOrderConfirmation(userEmail, savedOrder._id.toString());
    this.notificationsGateway.notifyOrderUpdate(savedOrder._id.toString(), 'pending');
    
    return savedOrder;
  }


  async getUserOrders(userId: string): Promise<Order[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    return this.orderModel.find({ userId: userObjectId }).exec();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid order or user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    const orderObjectId = new Types.ObjectId(orderId);

    const order = await this.orderModel.findOne({ _id: orderObjectId, userId: userObjectId }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = 'cancelled';
    return order.save();
  }
}
