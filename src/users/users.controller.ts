import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Role } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async registerUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name, email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      userId: req.user['userId'],
      email: req.user['email'],
      role: req.user['role'],
    };
  }

  @Get('/')
  @Role('admin')
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }
}
