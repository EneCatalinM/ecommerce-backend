// src/cart/cart.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Cart {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ])
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
}

// Acest tip reprezintă un document salvat în baza de date
export type CartDocument = Cart & Document;

// Creează schema Mongoose pe baza clasei Cart
export const CartSchema = SchemaFactory.createForClass(Cart);
