import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import mongoose, { Types } from 'mongoose';
import { SubCategory } from 'src/schemas/sub-category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name, 'NEW')
    private categoryModel: mongoose.Model<Category>,
    @InjectModel(SubCategory.name, 'NEW')
    private subCategoryModel: mongoose.Model<SubCategory>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find({});
  }

  async findOne(category): Promise<CategoryDocument> {
    return await this.categoryModel.findOne({
      slug: category,
    });
  }

  async create(category: Category): Promise<Category> {
    return await this.categoryModel.create(category);
  }

  async findAllWithSubCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find(
      {},
      { name: 1, _id: 1, slug: 1 },
    );
    const categoriesWithSubCategories: Category[] = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await this.subCategoryModel.find(
          {
            $or: [
              {
                category_id: category.id,
              },
              {
                category_id: new Types.ObjectId(category.id),
              },
              {
                slug: category,
              },
            ],
          },
          { name: 1, _id: 1, slug: 1 },
        );

        return {
          ...category.toObject(),
          subCategories,
        };
      }),
    );

    return categoriesWithSubCategories;
  }
}
