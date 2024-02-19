import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { OrdersService } from 'src/orders/orders.service';
import { RequestFormService } from 'src/request-form/request-form.service';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { DeleteResponse } from 'src/common/type';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    private readonly orderService: OrdersService,
  ) { }

  async create(dto: CreateBillDto) {
    const order = await this.orderService.findOne(dto.orderId);
    const creating = this.billRepository.create({
      ...dto,
      order
    })
    return await this.billRepository.save(creating);
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Bill>> {
    const searchableFields: Array<keyof Bill> = [
      "note",
      "address",
      "totalPrice"
    ]
    const [entities, itemCount] = await this.billRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
      where: searchableFields.reduce((acc, field) => {
        acc[field] = pagination.search ? ILike(`%${pagination.search}%`) : null;
        return acc;
      }, {})
    })
    const meta = new Meta({
      itemCount,
      pagination
    })
    return new PaginationModel<Bill>(entities, meta);
  }

  async findOne(id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      loadEagerRelations: false
    });
    if (!bill) throw new NotFoundException(`Bill not found`);
    return bill
  }
  async findOneWithRelation(id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id }
    });
    if (!bill) throw new NotFoundException(`Bill not found`);
    return bill
  }

  async update(id: string, dto: UpdateBillDto): Promise<Bill> {
    const bill = await this.findOne(id);
    const order = await this.orderService.findOne(dto.orderId);
    const merged = this.billRepository.merge(bill, {
      ...dto,
      order
    })

    await this.billRepository.update(id, merged);
    return await this.findOneWithRelation(id);
  }

  async remove(id: string): Promise<DeleteResponse> {
    const queryBuilder = this.billRepository
      .createQueryBuilder()
      .delete()
      .from(Bill)
      .where(`id = :id`, { id })
      .returning("id");
    const execute = await queryBuilder.execute();
    return {
      message: `Removing bill with id: ${id} successfully`,
      id: execute.raw[0].id
    }
  }
}
