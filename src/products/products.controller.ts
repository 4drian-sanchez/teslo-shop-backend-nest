import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/Pagination.dto';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { Roles } from 'src/auth/interfaces';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities';


@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ){}

  @Post()
  @Auth(Roles.admin)
  @ApiResponse({status: 401, description: 'Unauthorized - Invalid JWT'})
  @ApiResponse({status: 403, description: 'User adrian need a valid role: admin'})
  @ApiResponse({status: 201, description: 'Producto creado correctamente', type: Product})

  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user : User
  ) {
    return this.productsService.create(createProductDto, user);
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
  @Auth(Roles.admin)
  update(@Param('id', new ParseUUIDPipe({
    exceptionFactory: () => {
      return new BadRequestException('El ID proporcionado no es un UUID válido');
    },})) id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productsService.update(id, updateProductDto);
    }
    
  @Delete(':id')
  @Auth(Roles.admin)
  remove(@Param('id', new ParseUUIDPipe({
        exceptionFactory: () => {
      return new BadRequestException('El ID proporcionado no es un UUID válido');
    },}) ) id: string) {
    return this.productsService.remove(id);
  }
}
