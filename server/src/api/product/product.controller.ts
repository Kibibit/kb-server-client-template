import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import {
  KbApiValidateErrorResponse
} from 'src/kb-api-validation-error-response.decorator';
import {
  KbValidationExceptionFilter
} from 'src/kb-validation-exception.filter';
import { Product } from 'src/models/product.model';

import { ProductService } from './product.service';

@Controller('api/product')
@ApiTags('product')
@UseFilters(new KbValidationExceptionFilter())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':name')
  @ApiOperation({ summary: 'Get an existing Product' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getProduct(@Param('name') name: string) {
    const product = await this.productService.findByName(name);

    // will show secret fields as well!
    console.log(product);

    // will only include exposed fields
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Create a Product' })
  @ApiCreatedResponse({
    description: 'The Product has been successfully created.',
    type: Product
  })
  @KbApiValidateErrorResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async createProduct(@Body() item: Product) {

    const product = await this.productService.create(item);
    // const product = new Product(persistedProduct.toObject());

    return product
  }

  @Patch(':name')
  @ApiOperation({ summary: 'Update a Product. expects a partial Product' })
  @ApiOkResponse({ type: Product, description: 'Product updated' })
  @KbApiValidateErrorResponse()
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async changeProduct(
    @Param('name') name: string,
    @Body() changes: Product
  ) {
    const existingProductDB = await this.productService.findOneAsync({ name });

    if (!existingProductDB) {
      throw new NotFoundException(`Product with name ${ name } not found`);
    }

    const existingProduct = new Product(existingProductDB.toObject());
    const product = await this.productService.updateAsync({
      ...existingProduct,
      ...changes
    })
    return product.toObject();
  }

  @Put(':name')
  @ApiOperation({ summary: 'Replace a Product. expects a full Product' })
  @KbApiValidateErrorResponse()
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async changeProduct2(
    @Param('name') name: string,
    @Body() changes: Product
  ) {
    const existingProductDB = await this.productService.findOneAsync({ name });
    const existingProduct = new Product(existingProductDB.toObject());
    const product = await this.productService.updateAsync({
      ...existingProduct,
      ...changes
    })
    return product.toObject();
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete an existing product' })
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteProduct(@Param('name') name: string) {
    const product = await this.productService.deleteAsync({ name });

    const parsed = new Product(product.toObject());

    console.log(parsed);

    // will only include exposed fields
    return parsed;
  }
}
