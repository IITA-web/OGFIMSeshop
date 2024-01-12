import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({
  timestamps: true,
})
export class Vendor extends Document {
  @Prop({ required: true })
  main_app_vendor_id: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop()
  image: string;

  @Prop()
  bio: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ unique: [true, 'This user has been activated'] })
  phone_number: string;

  @Prop({ unique: [true, 'This user has been activated'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  active: boolean;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

export const VendorModel = model<VendorDocument>('Vendor', VendorSchema);
