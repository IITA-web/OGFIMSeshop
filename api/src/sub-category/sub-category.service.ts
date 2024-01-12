import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import {
  SubCategory,
  SubCategoryDocument,
} from 'src/schemas/sub-category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name, 'NEW')
    private subCategoryModel: mongoose.Model<SubCategory>,
  ) {}

  async findOne(subCategory): Promise<SubCategoryDocument> {
    return await this.subCategoryModel.findOne({
      slug: subCategory,
    });
  }

  async findAll(category: string): Promise<SubCategory[]> {
    return await this.subCategoryModel.find({
      $or: [
        {
          category_id: category,
        },
        {
          category_id: new mongoose.Types.ObjectId(category),
        },
        {
          slug: category,
        },
      ],
    });
  }

  async findAllCategories() {
    return await this.subCategoryModel
      .find({}, { name: 1, _id: 1, slug: 1 })
      .populate('category_id', '_id name slug', Category.name)
      .exec();
  }

  async create(category: SubCategory): Promise<SubCategory> {
    return await this.subCategoryModel.create(category);
  }
}
