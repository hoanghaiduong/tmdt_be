import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['username', 'password']) { }
export class UpdateUserManager extends OmitType(CreateUserDto, [] as const) { }