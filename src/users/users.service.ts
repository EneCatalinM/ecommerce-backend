import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

async createUser(name: string, email: string, password: string): Promise<UserDocument> {
    const user = new this.userModel({
      name,
      email,
      password,
    });
  
    return user.save();
  }
  
  async findUserByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }
}
