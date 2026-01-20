import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/Pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productReposity: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productReposity.create(createProductDto)
      await this.productReposity.save(product)
      return product

    } catch (error) {
      this.exceptionsDB(error)
    }
  }

  async findAll( paginationDto : PaginationDto) {
    
    const {limit: limmit = 10, skip = 0}= paginationDto

    const products = await this.productReposity.find({
      take:limmit,
      skip
    })
    if( !products ) throw new NotFoundException('No se encontraron productos en la BD')
    return products
  }

  async findOne(id: string) {
    const product = await this.productReposity.findOne({
      where: {
        id
      }
    })
    if( !product ) throw new NotFoundException(`El producto con el id ${id} no ha sido encontrado`)
    return product
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    //* Si el producto no ha sido encontrado o el uuid no es válido devuelve un BadRequestException
    await this.findOne(id)
    

    const productDeleted = await this.productReposity.delete(id)
    return {
      message: 'Producto eliminado exitosamente',
      productDeleted
    }
  }

  private exceptionsDB(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Oops! Hubo un error en el servidor')
  }
}
