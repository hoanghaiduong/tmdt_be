import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('order-product')
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) { }

  @Post()
  create(@Body() createOrderProductDto: CreateOrderProductDto) {
    return this.orderProductService.create(createOrderProductDto);
  }

  @Get('gets')
  findAll(@Query() pagination:Pagination) {
    return this.orderProductService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.orderProductService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() dto: UpdateOrderProductDto) {
    return this.orderProductService.update(id, dto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.orderProductService.remove(id);
  }
}
