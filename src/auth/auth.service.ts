import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcrypt'
import { User } from './entities/user.entity';
import { LoginDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService : JwtService
  ) {}

  async signUp(signUpDto: SignUpDto) {

    const { password: plainPassword, ...restDto } = signUpDto
    try {
      const user = this.authRepository.create({
        ...restDto,
        password: hashSync(plainPassword, 10)
      })

      await this.authRepository.save(user)
      
      return {
        jwt: this.generateJwt( {id : user.id} )
      }


    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async login(loginDto: LoginDto) {
  
      const user = await this.authRepository.findOne({
        where: { email: loginDto.email },
        select: {
          email: true,
          password: true,
          id: true
        }
      })
      
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!compareSync(loginDto.password, user.password)) {
        throw new BadRequestException('Contraseña incorrecta');
      }

      return {
        jwt: this.generateJwt({id: user.id})
      }
  }

  checkAuthStatus( id : string ) {
      return {
        ok: true,
        jwt: this.generateJwt({id})
      }
  }

  generateJwt( payload : { id : string } ) {
    return this.jwtService.sign( payload )
  }

  handleExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('El email no esta disponible. Por favor intenta con otro')
    }
    throw new InternalServerErrorException('Error interno del servidor.')
  }
}
