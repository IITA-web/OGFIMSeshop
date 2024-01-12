// payment.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';
import { Product } from './product.schema';

@Schema()
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  listing: Product;

  @Prop({ required: true })
  payment_reference: string;

  @Prop({ required: true })
  payment_amount: number;

  @Prop({ required: true })
  payment_date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
