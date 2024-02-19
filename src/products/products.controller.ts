import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('products')
@ApiTags("API Quản lý sản phẩm")
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('gets')
  findAll(@Query() pagination: Pagination) {
    return this.productsService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.productsService.remove(id);
  }
}
