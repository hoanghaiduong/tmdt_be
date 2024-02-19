import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { DeleteResponse } from 'src/common/type';
import { User } from 'src/users/entities/user.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
type RelationType = "orderProducts" | "user" | "orderProducts.product"
@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {

  }
  async calculateTotalPrice(order: Order): Promise<void> {
    let totalPrice = 0;
    for (const orderProduct of order.orderProducts) {
      totalPrice += orderProduct.product.price * orderProduct.amount;
    }
    order.totalPrice = totalPrice;
    await this.orderRepository.save(order);
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Order>> {
    const searchableFields: Array<keyof Order> = [
      'id'
    ]


    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .take(pagination.take)
      .skip(pagination.skip)
      .orderBy('order.createdAt', pagination.order)
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('order.user', 'user')
    // .where(searchableFields.map(field => `order.${field} = :search`).join(' OR '), {
    //   search: searchValue
    // });
    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    for (const order of entities) {
      await this.calculateTotalPrice(order);
    }
    const meta = new Meta({ pagination, itemCount });
    return new PaginationModel<Order>(entities, meta);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id }
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`)
    return order
  }

  async findOneRelation(id: string, relations?: RelationType[]): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`)
    return order
  }
  async create(user: User): Promise<Order> {
    const order = this.orderRepository.create({
      user
    });
    return await this.orderRepository.save(order);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<DeleteResponse> {

    const queryBuilder = this.orderRepository
      .createQueryBuilder()
      .delete()
      .from(Order)
      .where('id = :id', { id })
      .returning('id');
    const execute = await queryBuilder.execute();
    return {
      message: 'Remove order successfully',
      id: execute.raw[0].id,
    };

  }
}
