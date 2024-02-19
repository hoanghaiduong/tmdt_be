import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Note } from 'src/common/decorator/description.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { TokenModel } from './model/token.model';

@Controller('auth')
@ApiTags("Auth APIs  (auth)")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }


  @UseGuards(LocalAuthGuard)
  @Note("Đăng nhập")
  @ApiBody({
    type: LoginDto,
    examples: {
      string: {
        value: {
          username: 'string',
          password: '123456'
        } as LoginDto,
      },
      string1: {
        value: {
          username: 'string1',
          password: '123456'
        } as LoginDto,
      }

    },
  })
  @Post('login')
  async login(@Body() dto: LoginDto, @AuthUser() user: User) {
    return this.authService.login(user);
  }


  @Post('register')
  @Note("Đăng ký")
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createProfileUser(dto);
  }

  @Post("refresh-tokens")
  @Note("Lấy lại token mới khi hết hạn")
  @UseGuards(RefreshAuthGuard)
  async refreshTokens(
    @AuthUser() myUser: User,
    @Body() dto: RefreshTokenDto,
  ): Promise<TokenModel> {
    return this.authService.refreshToken(myUser);

  }

}
