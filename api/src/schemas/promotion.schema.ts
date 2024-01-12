import { Product } from 'src/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';

export type PromotionDocument = Promotion & Document;

@Schema({
  timestamps: true,
})
export class Promotion {
  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  paystack_reference: string;

  @Prop({ required: true, default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  product: Product;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
