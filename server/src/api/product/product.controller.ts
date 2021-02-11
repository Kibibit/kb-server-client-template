import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { Product } from 'src/models/product.model';

import { ProductService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':name')
  @UseInterceptors(ClassSerializerInterceptor)
  async getProduct(@Param('name') name: string) {
    const product = await this.productService.findByName(name);

    // will show secret fields as well!
    console.log(product);

    // will only include exposed fields
    return product;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createProduct(@Body() item: Product) {

    const product = await this.productService.create(item);
    // const product = new Product(persistedProduct.toObject());

    return product
  }
}
