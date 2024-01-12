import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';

export type CallbackDocument = Callback & Document;

@Schema()
export class Callback {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;
}

export const CallbackSchema = SchemaFactory.createForClass(Callback);
