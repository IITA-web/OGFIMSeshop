import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema()
export class Activity extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  listing: Product;

  @Prop({ default: 1 })
  views: number;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
