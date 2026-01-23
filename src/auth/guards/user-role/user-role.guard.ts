import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { ROLE_TAG } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> | never{

    const validRoles: string[] = this.reflector.get(ROLE_TAG, context.getHandler())
    if( !validRoles ) return true
    if( !validRoles.length ) {
      throw new BadRequestException('Agrega los roles en un array como segundo argumento en el SetMetadata')
    }
    
    const req = context.switchToHttp().getRequest()
    const user = req.user as User

    for (const role of user.roles) {
        if( validRoles.includes(role) ) {
          return true
        }  
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: ${validRoles}`
    )
    
  }
}
