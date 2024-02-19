import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    providerId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    uses: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

}
