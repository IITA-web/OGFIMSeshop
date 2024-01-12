import { Vendor } from './vendor.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema()
export class VerificationCode {
  @Prop({ required: true })
  code: string;

  @Prop({ type: Date, required: true, default: Date.now, expires: 1800 }) // Expires after 30 minutes
  expiration_date: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ default: false })
  status: boolean;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
