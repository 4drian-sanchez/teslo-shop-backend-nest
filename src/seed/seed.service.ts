import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { User } from 'src/auth/entities/user.entity';
import { seedData } from 'src/data/seed.data';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables()
    const seedUserAdmin = await this.insertUsers()

    //* Agregar los productos con la referencia del usuario admin
    this.insertProductsWithUserAdmin( seedUserAdmin[0] )
    return 'Seed executed successfully'

  }

  private async deleteTables() {
    //* Eliminación de los productos y usuarios
    await this.productServices.deleteAllProducts()
    await this.userRepository.deleteAll() // Usa clear() en lugar de deleteAll() para ser más eficiente
  }

  private async insertUsers(): Promise<User[]> {
    const seedUsers = seedData.users
  
    const userPromises = seedUsers.map(seedUser => {
      const user = this.userRepository.create( {
        ...seedUser,
        password: hashSync( seedUser.password, 10 )
      } )
      return this.userRepository.save(user)
    }
    )
    const userSaveds = await Promise.all(userPromises)
    return userSaveds
  }

  private async insertProductsWithUserAdmin(user: User) {
    const seedProducts = seedData.products
    const insertPromises = seedProducts.map(product =>
      this.productServices.create(product, user)
    );
    await Promise.all(insertPromises);
  }


}
