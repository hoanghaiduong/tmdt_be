import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('providers')
@ApiTags("API Quản lý nhà cung cấp")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) { }

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get('gets')
  findAll(@Query() pagination: Pagination) {
    return this.providersService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.providersService.remove(id);
  }
}
