import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('orders')
@ApiTags("API Quản lý đơn hàng")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@AuthUser() user: User) {
    return this.ordersService.create(user);
  }

  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.ordersService.findAll(pagination);
  }

  @Get('get')
  findOne(@Query('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch('update')
  update(@Query('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete('remove')
  remove(@Query('id') id: string) {
    return this.ordersService.remove(id);
  }
}
