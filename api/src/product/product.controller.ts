import { Product } from 'src/schemas/product.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Vendor } from 'src/schemas/vendor.schema';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  getAllProducts(
    @Query('page') page: number,
    @Query('search') search: string,
    @Query('location') location: string,
    @Query('category') category: string,
    @Query('subcategory') subcategory: string,
    @Query('pageCount') pageCount: number,
    @Query('sort') sort: 'latest' | 'popular',
  ): Promise<{ data: Product[]; pagination: any; vendors: Vendor[] }> {
    const newSort = sort === 'latest' ? { createdAt: -1 } : { price: 1 };

    return this.productService.getProducts(
      search,
      location,
      category,
      subcategory,
      pageCount,
      page,
      newSort,
      sort,
    );
  }

  @Get('/vendor/:vendorId')
  getProductsByVendor(
    @Param('vendorId') vendorId: string,
    @Query('page') page: number,
    @Query('pageCount') pageCount: number,
  ): Promise<Product[]> {
    return this.productService.getProductsByVendor(vendorId, pageCount, page);
  }

  @Get('/:productId')
  getProductsById(@Param('productId') productId: string): Promise<Product> {
    return this.productService.getProductsById(productId);
  }

  @Get('/slug/:slug')
  async getProductsBySlug(
    @Param('slug') slug: string,
  ): Promise<Product | null> {
    return await this.productService.getProductsBySlug(slug);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  createProduct(
    @Body() createProductDto: ProductDto,
    @Req() request,
  ): Promise<Product> {
    return this.productService.createProduct(createProductDto, request.user);
  }

  @Put('/:productId')
  @UseGuards(AuthGuard('jwt'))
  updateProduct(
    @Param('productId') productId: string,
    @Body() createProductDto: ProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(productId, createProductDto);
  }

  @Put('/toggle-publish/:productId')
  @UseGuards(AuthGuard('jwt'))
  togglePublish(@Param('productId') productId: string): Promise<Product> {
    return this.productService.togglePublish(productId);
  }

  @Delete('/:productId')
  @UseGuards(AuthGuard('jwt'))
  deleteProduct(@Param('productId') productId: string): Promise<boolean> {
    return this.productService.deleteProduct(productId);
  }
}
