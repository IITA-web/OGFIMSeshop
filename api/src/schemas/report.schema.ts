import { Product } from 'src/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';

export type ReportDocument = Report & Document;

@Schema()
export class Report {
  @Prop({ required: true })
  google_auth_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  is_approved: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
