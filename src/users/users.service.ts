import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pagination } from '../common/pagination/pagination.dto';
import { PaginationModel } from '../common/pagination/pagination.model';
import { Meta } from '../common/pagination/meta.dto';

import { hash } from 'bcrypt';
import { isNotEmpty } from 'class-validator';
import { User } from './entities/user.entity';
import { DeleteResponse } from 'src/common/type';
import { ApiException } from 'src/common/exception/api.exception';
import { ErrorMessages } from 'src/common/exception/error.code';
import { MulterUtils } from 'src/common/utils/multer.util';
import { Role } from 'src/common/enum/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserManager } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { GoogleDriveService } from 'nestjs-google-drive';
import { UploadFileDTO } from './dto/file.dto';
import axios from 'axios';
import { StorageService } from 'src/storage/storage.service';
import { ImagePath } from 'src/common/enum';


@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly storageService: StorageService,
    private readonly googleDriveService: GoogleDriveService
  ) { }
  async updateAvatar(dto: UploadFileDTO): Promise<Object> {

    const GOOGLE_DRIVE_FOLDER_ID = '1_Tbqgsj1qEn9UsUzfCsp4c3a-0YkvdTP';

    const avatarUrl = await this.googleDriveService.uploadFile(
      dto.avatar,
      GOOGLE_DRIVE_FOLDER_ID,
    );
    if (avatarUrl) {
      MulterUtils.deleteFileAbsoulutePath(dto.avatar.path);
    } else {
      throw new BadRequestException(`Uploaded avatar failed: ${dto.avatar.filename}`);
    }
    return {
      avatar: dto.avatar,
      urlDownloaded: avatarUrl
    };
  }
  async getFileUrl(url: string) {
    const result = await this.getFileNameFromUrl(url);

    // MulterUtils.deleteFileAbsoulutePath(url);
    return result;
  }
  async getFileNameFromUrl(url: string): Promise<string> {
    try {
      const response = await axios.head(url);
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const startIndex = contentDisposition.indexOf('filename=') + 9;
        const endIndex = contentDisposition.indexOf(';', startIndex);
        return contentDisposition.substring(startIndex, endIndex !== -1 ? endIndex : undefined);
      }
      throw new Error('File name not found in response headers');
    } catch (error) {
      console.error('Error retrieving file name:', error);
      return '';
    }
  }
  async onModuleInit() {
    // xóa toàn bộ user có role là khác ADMIN
    // await this.usersRepository.delete({ id : 'fba35ebc-85ab-4e1e-ab77-180e30614dfe' });
  }

  async removeUser(id: string): Promise<DeleteResponse> {
    // tìm user có role ADMIN thì không xóa
    await this.getUserById(id);
    // if (user.role === Role.ADMIN) {
    //   throw new ApiException(ErrorMessages.CANNOT_DELETE_ADMIN);
    // }
    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .returning('id');
    const execute = await queryBuilder.execute();
    return {
      message: 'User deleted successfully',
      id: execute.raw[0].id,
    };
  }

  async createProfileUser(
    dto: CreateUserDto,
  ): Promise<User> {
    // kiểm tra username đã tồn tại chưa
    if (await this.existsUsername(dto.username)) {
      throw new ApiException(ErrorMessages.USER_ALREADY_EXIST);
    }

    // kiểm tra email đã tồn tại chưa
    if (await this.existsEmail(dto.email)) {
      throw new ApiException(ErrorMessages.EMAIL_ALREADY_EXIST);
    }

    if (
      isNotEmpty(dto.phoneNumber) &&
      (await this.existsPhoneNumber(dto.phoneNumber))
    ) {
      throw new ApiException(ErrorMessages.PHONE_NUMBER_ALREADY_EXIST);
    }
    // taọ user
    const hashedPassword = await hash(dto.password, 10);
    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...dto,
        password: hashedPassword,
        //   avatar: avatar ? MulterUtils.convertPathToUrl(avatar.path) : null,
      })
      .returning('*')
      .execute();
    const execute = (await queryBuilder).raw[0];
    return plainToClass(User, execute);
  }

  async existsPhoneNumber(phoneNumber: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { phoneNumber } });
  }

  async existsEmail(email: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { email } });
  }

  async updateProfile(
    user: User,
    dto: UpdateUserDto,
    // avatar?: Express.Multer.File,
  ): Promise<User> {
    // console.log('dto', isNotEmpty(user.avatar));
    // // nếu có avatar thì xóa avatar cũ
    // isNotEmpty(user.avatar) && MulterUtils.deleteFile(user.avatar);

    // console.log('dto', avatar);
    // update user
    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        ...dto,
        // avatar: isNotEmpty(avatar)
        //   ? MulterUtils.convertPathToUrl(avatar.path)
        //   : user.avatar,
      })
      .where('id = :id', { id: user.id })
      .returning('*');
    const execute = await queryBuilder.execute();
    return execute.raw[0];
  }

  async updateUserInfoByManager(
    myUser: User,
    dto: UpdateUserManager,
  ): Promise<User> {

    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        ...dto,
        password: dto.password ? await hash(dto.password, 10) : myUser.password,
      })
      .where('id = :id', { id: myUser.id })
      .returning('*');
    const execute = await queryBuilder.execute();
    return execute.raw[0];
  }

  // async assignAdminRole(id: string): Promise<User> {
  //   const user = await this.getUserById(id);
  //   return await this.usersRepository.save({
  //     ...user,
  //     role: Role.ADMIN,
  //   });
  // }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }
  async getUserRelations(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id
      },
      relations: ['orders', 'feedBacks'],

    })
    if (!user) {
      throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async getUserByUserName(username: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }

  async existsUsername(username: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { username } });
  }

  async getPaginationUsers(pagination: Pagination) {
    const searchableFields: Array<keyof User> = [
      'email',
      'address',
      'fullName',
      'username',
      'phoneNumber',
    ];
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', pagination.order)
      .take(pagination.take)
      .skip(pagination.skip)
      .where(
        searchableFields
          .map((field) => `user.${field} ILIKE :search`)
          .join(' OR '),
        {
          search: `%${pagination.search || ''}%`,
        },
      );

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }
}
