// src/cart/cart.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(new Types.ObjectId(productId)));
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }

    return cart.save();
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(new Types.ObjectId(productId)));
    if (itemIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    return cart.save();
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    return cart.save();
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = [];

    return cart.save();
  }
}
