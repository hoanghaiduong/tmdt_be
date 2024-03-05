import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards, UploadedFile } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserManager } from './dto/update-user.dto';
import { UserService } from './users.service';
import { Note } from 'src/common/decorator/description.decorator';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/common/meta/public.meta';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { UUIDQuery } from 'src/common/decorator/uuid.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiFile, ApiMemoryFile } from 'src/common/decorator/file.decorator';
import { MulterUtils, UploadTypesEnum } from 'src/common/utils/multer.util';
import { FileTypes, ImagePath } from 'src/common/enum';
import { UploadFileDTO } from './dto/file.dto';

@Controller('users')
@ApiTags("API Quản lý người dùng")
@UseGuards(JwtAuthGuard)

export class UsersController {
  constructor(private readonly userService: UserService) { }
  @Get(`getFileUpload`)
  async getFileUpload(@Query('file') file: string): Promise<string> {
    return await this.userService.getFileUrl(file);
  }
  @Post('upload-avatar-user')

  @ApiFile(
    'avatar',
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_USER)
  )
  async uploadAvatarUser(@AuthUser() user: User, @Body() dto: UploadFileDTO, @UploadedFile() avatar?: Express.Multer.File): Promise<Object> {
    return this.userService.updateAvatar({
      ...dto,
      user,
      avatar
    });
  }

  @Get('my')
  @Note('Lấy thông tin người dùng')
  async getAccount(@AuthUser() user: User) {
    return user;
  }

  @Public()
  @Get()
  @Note('Lấy thông tin tất cả người dùng')
  async getAllUsers(@Query() pagination: Pagination) {
    return await this.userService.getPaginationUsers(pagination);
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard)
  // @Note('Cấp quyền ADMIN cho tài khoản (admin)')
  // @Post('admin')
  // async assignAdminRole(@UUIDQuery('id') id: string): Promise<User> {
  //   return await this.userService.assignAdminRole(id);
  // }

  @Note('Cập nhật thông tin người dùng ')
  // @Roles(Role.ADMIN, Role.USER, Role.ASSOCIATIONS, Role.FARMER)
  @Put()
  // @UseGuards(JwtAuthGuard)
  // @ApiFile(
  //   'avatar',
  //   MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_USER),
  // )
  async updateProfile(
    @AuthUser() user: User,
    @Body() dto: UpdateUserDto,
    // @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    return await this.userService.updateProfile(user, dto);
  }

  @Note("Tìm người dùng theo id")
  @Get('getOne')
  async getUserById(@Query('id') id: string): Promise<User> {
    return await this.userService.getUserRelations(id);
  }

  @Note('Tạo tài khoản người dùng')
  //@Roles(Role.ADMIN)
  @Post()
  // @ApiFile(
  //   'avatar',
  //   MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_USER),
  // )
  async createUser(
    @Body() dto: CreateUserDto,
    // @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    return await this.userService.createProfileUser(dto);
  }

  // @Roles(Role.ADMIN)
  @Note(
    'Cập nhật thông tin người dùng - muốn cập nhật field nào thì gửi field đó',
  )
  @Put('updateByUser')
  async updateUserInfoByManager(
    @UUIDQuery('userId') userId: string,
    @Body() dto: UpdateUserManager,
  ): Promise<User> {
    const myUser = await this.userService.getUserById(userId);
    return await this.userService.updateUserInfoByManager(myUser, dto);
  }

  // @Roles(Role.ADMIN)
  @Note('Xóa tài khoản người dùng ')
  //@UseGuards(JwtAuthGuard)
  @Delete()
  async removeUser(@UUIDQuery('id') id: string) {
    return await this.userService.removeUser(id);
  }
}
