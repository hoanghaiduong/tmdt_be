import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "src/common/enum/auth";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;


    // @ApiPropertyOptional({
    //     type: 'string',
    //     format: 'binary',
    // })
    // @IsOptional()
    // avatar?: Express.Multer.File;

    // @ApiPropertyOptional({
    //     enum: Role,
    //     default: Role.USER,
    // })
    // @IsOptional()
    // @IsEnum(Role)
    // role?: Role;
}
