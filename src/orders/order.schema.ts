import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ productId: Types.ObjectId, quantity: Number }], required: true })
  products: { productId: Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending' })
  status: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
