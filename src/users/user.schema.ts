import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document & {
  validatePassword: (password: string) => Promise<boolean>;
};

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ required: true, enum: ['admin', 'customer'], default: 'customer' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password.trim(), this.password);
};


UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
