import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { Request } from 'express';
  
  @Controller('cart')
  @UseGuards(JwtAuthGuard)
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    @Get()
    async getCart(@Req() req: Request) {
      const userId = req.user['userId'];
      return this.cartService.getCartByUserId(userId);
    }
  
    @Post()
    async addToCart(@Req() req: Request, @Body() addProductDto: any) {
      const userId = req.user['userId'];
      const { productId, quantity } = addProductDto;
      return this.cartService.addToCart(userId, productId, quantity);
    }
  
    @Put(':productId')
    async updateCartItem(
      @Req() req: Request,
      @Param('productId') productId: string,
      @Body('quantity') quantity: number,
    ) {
      const userId = req.user['userId'];
      return this.cartService.updateCartItem(userId, productId, quantity);
    }
  
    @Delete(':productId')
    async removeFromCart(@Req() req: Request, @Param('productId') productId: string) {
      const userId = req.user['userId'];
      return this.cartService.removeFromCart(userId, productId);
    }
  
    @Delete()
    async clearCart(@Req() req: Request) {
      const userId = req.user['userId'];
      return this.cartService.clearCart(userId);
    }
  }
  