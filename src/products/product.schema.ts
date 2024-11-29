import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop([String])
  tags: string[];

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
