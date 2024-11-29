import { Controller, Get, Post, Body, UseGuards, Req, Param, Delete, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/roles.decorator';
import { Request } from 'express';
import { Types } from 'mongoose';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async placeOrder(@Body() orderData: any, @Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.userId;
    const userEmail = req.user.email;
  
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
  
    return this.ordersService.placeOrder(userId, orderData.products, userEmail);
  }

  @Get('my')
  async getUserOrders(@Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.userId;
    return this.ordersService.getUserOrders(userId);
  }

  @Get()
  @Role('admin')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Delete(':id')
  async cancelOrder(@Param('id') id: string, @Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.userId;
    return this.ordersService.cancelOrder(id, userId);
  }
}
