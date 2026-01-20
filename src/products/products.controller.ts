import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/Pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll( @Query() paginationDto : PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({
        exceptionFactory: () => {
      return new BadRequestException('El ID proporcionado no es un UUID válido');
    },})) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({
        exceptionFactory: () => {
      return new BadRequestException('El ID proporcionado no es un UUID válido');
    },}) ) id: string) {
    return this.productsService.remove(id);
  }
}
