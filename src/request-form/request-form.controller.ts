import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RequestFormService } from './request-form.service';
import { CreateRequestFormDto } from './dto/create-request-form.dto';
import { UpdateRequestFormDto } from './dto/update-request-form.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';

@ApiTags("API Quản lý phiếu yêu cầu")
@Controller('request-form')
export class RequestFormController {
  constructor(private readonly requestFormService: RequestFormService) { }

  @Post()
  create(@Body() createRequestFormDto: CreateRequestFormDto) {
    return this.requestFormService.create(createRequestFormDto);
  }

  @Get('gets')
  findAll(@Query() pagination:Pagination) {
    return this.requestFormService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.requestFormService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateRequestFormDto: UpdateRequestFormDto) {
    return this.requestFormService.update(id, updateRequestFormDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.requestFormService.remove(id);
  }
}
