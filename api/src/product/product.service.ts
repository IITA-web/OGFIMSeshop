import { SubCategoryService } from './../sub-category/sub-category.service';
import { CategoryService } from './../category/category.service';
import { Promotion } from 'src/schemas/promotion.schema';
import { Vendor } from './../schemas/vendor.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { ProductDto } from './dto/product.dto';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name, 'NEW')
    private productModel: mongoose.Model<Product>,
    @InjectModel(Vendor.name, 'NEW')
    private vendorModel: mongoose.Model<Vendor>,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private categorySubService: SubCategoryService,
  ) {}

  async getProductQuery(
    query: Record<any, any>,
    sort: any,
    skip: number,
    pageCount: number,
  ): Promise<ProductDocument[]> {
    return this.productModel
      .find(query)
      .populate('vendor', '_id first_name image last_name createdAt')
      .sort(sort)
      .skip(skip)
      .limit(+pageCount)
      .exec();
  }

  async getProducts(
    search: string,
    location: string,
    category: string,
    subcategory: string,
    pageCount: number,
    page: number,
    sort: any,
    oldSort?: string,
  ): Promise<{ data: Product[]; pagination: any; vendors: Vendor[] }> {
    const skip = +pageCount * (+page - 1);

    const query: any = {
      is_deleted: false,
      is_published: true,
    };

    if (search) {
      const vendors = await this.vendorModel
        .find(
          {
            $or: [
              { first_name: { $regex: new RegExp(search, 'i') } },
              { last_name: { $regex: new RegExp(search, 'i') } },
              { tags: { $in: [new RegExp(search, 'i')] } },
            ],
          },
          { _id: 1, id: 1 },
        )
        .exec();

      const searchConditions = [
        { name: { $regex: new RegExp(search, 'i') } },
        { vendor: { $in: vendors.map((vendor) => vendor.id) } },
      ];

      query['$or'] = searchConditions;
    }

    if (location) {
      query.local_goverment = location;
    }

    if (category) {
      query.category = (await this.categoryService.findOne(category))?.id;

      if (subcategory) {
        query.sub_category = (
          await this.categorySubService.findOne(subcategory)
        )?.id;
      }
    }

    const [totalCount, products] = await Promise.all([
      this.productModel.countDocuments(query).exec(),
      this.getProductQuery(query, sort, skip, +pageCount),
    ]);
    const sponsoredProducts =
      products.length > 0
        ? await this.productModel
            .aggregate([
              {
                $addFields: {
                  vendor: { $toObjectId: '$vendor' },
                  randomSort: { $rand: {} },
                },
              },
              {
                $match: {
                  active_promotion: { $ne: null },
                  is_deleted: false,
                  is_published: true,
                  _id: { $nin: products.map((p) => p._id) },
                },
              },
              { $sort: { randomSort: 1 } },
              { $limit: products.length > 5 ? 2 : 1 },
              {
                $lookup: {
                  from: 'vendors',
                  localField: 'vendor',
                  foreignField: '_id',
                  as: 'vendorArray',
                },
              },
              {
                $addFields: {
                  vendor: { $arrayElemAt: ['$vendorArray', 0] },
                },
              },
              {
                $project: {
                  vendorArray: 0,
                  randomSort: 0,
                },
              },
            ])
            .exec()
        : [];
    const allProducts = this.shuffle([
      ...products,
      ...sponsoredProducts,
    ]) as any[];
    const sortedProducts: Product[] = allProducts.sort((a, b) => {
      const fieldA = oldSort === 'latest' ? new Date(a.createdAt) : a.price;
      const fieldB = oldSort === 'latest' ? new Date(b.createdAt) : b.price;

      return oldSort === 'latest' ? fieldB - fieldA : fieldA - fieldB;
    });
    const response = {
      vendors: await this.vendorModel
        .find({
          $or: [
            { first_name: { $regex: new RegExp(search, 'i') } },
            { last_name: { $regex: new RegExp(search, 'i') } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ],
        })
        .skip(skip)
        .limit(+pageCount)
        .exec(),
      data:
        products.length === 1
          ? [...products, ...sponsoredProducts]
          : sortedProducts,
      pagination: {
        total: totalCount,
        pageCount: +pageCount,
        page: +page,
      },
    };

    return response;
  }

  shuffle(array: Product[]): Product[] {
    for (
      let currentIndex = array.length - 1;
      currentIndex > 0;
      currentIndex--
    ) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  async getProductsByVendor(
    vendorId: string,
    pageCount: number = 10,
    page: number = 1,
  ): Promise<Product[]> {
    const query: Record<string, unknown> = {
      is_deleted: false,
      vendor: vendorId,
    };

    const skip = pageCount * (page - 1);
    const products = await this.productModel
      .find(query)
      .populate(
        'vendor',
        '_id first_name image last_name createdAt',
        Vendor.name,
      )
      .skip(skip)
      .limit(pageCount)
      .exec();

    return products;
  }

  async getProductsById(productId: string): Promise<Product | null> {
    const product = await this.productModel
      .findOne({ _id: productId, is_deleted: false })
      .populate(
        'vendor',
        '_id first_name image last_name createdAt phone_number email',
        Vendor.name,
      )
      .exec();

    if (product) {
      let resp: Product = product.toObject();
      const rate = await this.reviewService.getVendorReviewAverage(
        product.vendor.id,
      );

      resp = {
        ...resp,
        vendor: {
          ...resp.vendor,
          rate,
        } as Vendor & { rate: number },
      };

      return resp;
    }

    return null;
  }

  async getProductForPromotion(productId: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ _id: productId, is_deleted: false })
      .populate(
        'active_promotion',
        'end_date duration start_date',
        Promotion.name,
      )
      .exec();

    return product;
  }

  async getProductsBySlug(slug: string): Promise<Product | null> {
    const product = await this.productModel
      .findOne({ slug, is_deleted: false })
      .populate(
        'vendor',
        '_id first_name image last_name createdAt phone_number email',
        Vendor.name,
      )
      .exec();

    if (product) {
      let resp: Product = product.toObject();
      const rate = await this.reviewService.getVendorReviewAverage(
        product.vendor.id,
      );

      resp = {
        ...resp,
        vendor: {
          ...resp.vendor,
          rate,
        } as Vendor & { rate: number },
      };

      return resp;
    }

    return null;
  }

  async createProduct(
    createProductDto: ProductDto,
    vendor: Vendor,
  ): Promise<Product> {
    const payload = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      category: createProductDto.category,
      sub_category: createProductDto.sub_category,
      local_goverment: createProductDto.local_goverment,
      images: createProductDto.images,
      is_service: createProductDto.is_service,
      billing_type: createProductDto.billing_type,
      is_negotiable: createProductDto.is_negotiable,
      show_email: createProductDto.show_email,
      show_phone_number: createProductDto.show_phone_number,
      show_whatsapp: createProductDto.show_whatsapp,
      vendor: vendor.id,
    };
    const product = await this.productModel.create(payload);

    return product;
  }

  async updateProduct(id: string, createProductDto: ProductDto): Promise<any> {
    try {
      await this.productModel.updateOne(
        { _id: id },
        {
          ...createProductDto,
        },
      );

      return this.productModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const product = await this.productModel.findOne({
        _id: id,
        is_deleted: false,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      product.is_deleted = true;
      await (
        await product.save()
      ).populate(
        'vendor',
        '_id first_name image last_name createdAt phone_number email',
      );

      return true;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async togglePublish(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findOne({
        _id: id,
        is_deleted: false,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      product.is_published = !product.is_published;
      await (
        await product.save()
      ).populate(
        'vendor',
        '_id first_name image last_name createdAt phone_number email',
      );

      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }
}
