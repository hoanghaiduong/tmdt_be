import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('categories')
@ApiTags("API Quản lý danh mục sản phẩm")

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('gets')
  findAll(@Query() pagination:Pagination) {
    return this.categoriesService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
