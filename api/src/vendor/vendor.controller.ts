import { Controller, Param, Get } from '@nestjs/common';
import { Product } from 'src/schemas/product.schema';
import { Vendor } from 'src/schemas/vendor.schema';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get('/:vendorId')
  async getVendorsDetails(@Param('vendorId') vendorId: string): Promise<{
    vendor: Vendor;
    products: Product[];
    rate: number;
  }> {
    return await this.vendorService.getVendorDetialsAndProducts(vendorId);
  }
}
