import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { initialData } from 'src/data/seed.data';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService
  ) { }

  async executedSeed() {
    this.productServices.deleteAllProducts()
    const products = initialData.products
    try {

      const insertPromises = products.map(product =>
        this.productServices.create(product)
      );
      await Promise.all(insertPromises);

      return 'Seed executed successfully'
    } catch (error) {
      new InternalServerErrorException(error.detail)
    }
  }


}
