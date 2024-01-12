import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';

export type SubCategoryDocument = SubCategory & Document;

@Schema({
  timestamps: true,
})
export class SubCategory {
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category_id: Category;

  @Prop({ required: true })
  name: string;

  @Prop({ slug: 'name', unique: true })
  slug: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
