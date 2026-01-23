import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, RoleProtected, GetUser } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Roles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('/signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request : Request
    @GetUser('email') user: User,
    @RawHeaders() rawHeaders: string[],
    //@Headers() headers : IncomingHttpHeaders ← Otra forma de obtener los headers
  ) {
    console.log(rawHeaders)
    return {
      user
    }
  }

  @Get('private2')
  @RoleProtected( Roles.superUser)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User,
  ) {
    return user
  }

}
