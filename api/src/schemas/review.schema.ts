import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ required: true })
  google_auth_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;
  
  @Prop()
  name: string;

  @Prop({ default: false })
  is_approved: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
