import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User)
        private readonly authRepository : Repository< User >,
        configService : ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload : { id : string } ) {
        const { id } = payload
        const user = await this.authRepository.findOneBy({id})
        if( !user ) throw new UnauthorizedException('Token no válid')
        if( !user.isActive ) throw new UnauthorizedException('User is inactive')
        //* Sacar el password de la request de user
        return user;
    }
}