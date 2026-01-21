import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { UUID_V4_REGEX } from 'src/helpers';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productReposity: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageReposity: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {
    //* transforma el slug a lowerCase
    createProductDto.slug = createProductDto.slug?.toLowerCase()

    const { images = [], ...productDetails } = createProductDto
    try {
      const product = this.productReposity.create({
        ...productDetails,
        images: images.map(url => this.productImageReposity.create({ url }))
      })
      await this.productReposity.save(product)
      return product

    } catch (error) {
      this.exceptionsDB(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit: limmit = 10, skip = 0 } = paginationDto

    const products = await this.productReposity.find({
      take: limmit,
      skip,
      relations: {
        images: true
      }
    })
    if (!products) throw new NotFoundException('No se encontraron productos en la BD')
    return products.map(product => ({
      ...product,
      images: product.images?.map(image => image.url)
    }))
  }

  async findOne(term: string) {

    let product: Product | null = null;

    if (UUID_V4_REGEX.test(term)) {
      product = await this.productReposity.findOne({
        where: { id: term }
      });
    } else {
      // Buscar por slug o título del producto
      const queryBuilder = this.productReposity.createQueryBuilder('prod');
      product = await queryBuilder
        .leftJoinAndSelect('prod.images', 'images')
        .where('UPPER(prod.title) = :title OR prod.slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`El producto con el id ${term} no ha sido encontrado`)

    return {
      ...product,
      images: product.images?.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...updatedProduct } = updateProductDto

    const product = await this.productReposity.preload({
      id,
      ...updatedProduct
    });

    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    //* Una transacción son varias query que pueden afectar a la base de datos

    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: id })
        product.images = images.map(image => {
          return this.productImageReposity.create({ url: image })
        })
      }

      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()
      await queryRunner.release()
      return {
        ...product,
        images: product.images?.map(image => image.url)
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.exceptionsDB(error)
    }
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
  
    deleteAllProducts() {
      try {
        this.productReposity.deleteAll()
      } catch (error) {
        this.exceptionsDB(error)
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
