import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('bills')
@ApiTags("API Quản lý hoá đơn")
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get('gets')
  findAll(@Query() pagination: Pagination) {
    return this.billsService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.billsService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(id, updateBillDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.billsService.remove(id);
  }
}
