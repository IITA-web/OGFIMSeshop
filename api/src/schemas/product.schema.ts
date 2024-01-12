import { Promotion } from './promotion.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './vendor.schema';
import { Category } from './category.schema';
import { SubCategory } from './sub-category.schema';

export type ProductDocument = Product & Document;

enum BillingType {
  'FLAT',
  'USAGE',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'ANNUAL',
}

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ type: Types.ObjectId, required: true, ref: Vendor.name })
  vendor: Vendor;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  sub_category: SubCategory;

  @Prop({ required: true })
  local_goverment: string;

  @Prop()
  images: { url: string; id: string }[];

  @Prop({ required: true })
  is_service: boolean;

  @Prop()
  billing_type: string;

  @Prop({ required: true })
  is_negotiable: boolean;

  @Prop()
  show_phone_number: boolean;

  @Prop()
  show_email: boolean;

  @Prop()
  show_whatsapp: boolean;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: true })
  is_published: boolean;

  @Prop({ type: Types.ObjectId, ref: Promotion.name })
  active_promotion: Promotion;

  @Prop({ slug: 'name', unique: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
