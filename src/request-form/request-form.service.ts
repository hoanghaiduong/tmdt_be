import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestFormDto } from './dto/create-request-form.dto';
import { UpdateRequestFormDto } from './dto/update-request-form.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestForm } from './entities/request-form.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { DeleteResponse } from 'src/common/type';
import { BillsService } from 'src/bills/bills.service';
import { Meta } from 'src/common/pagination/meta.dto';

@Injectable()
export class RequestFormService {
  constructor(
    @InjectRepository(RequestForm)
    private requestFormRepository: Repository<RequestForm>,
    private readonly billService: BillsService
  ) { }
  async create(dto: CreateRequestFormDto): Promise<RequestForm> {
    const bill = await this.billService.findOne(dto.billId);
    const creating = this.requestFormRepository.create({
      ...dto,
      bill
    })
    return await this.requestFormRepository.save(creating)
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<RequestForm>> {
    const searchableFields: Array<keyof RequestForm> = [
      "note",
      "reason"
    ]
    const [entities, itemCount] = await this.requestFormRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
      relations: ['bill'],
      where: searchableFields.reduce((acc, field) => {
         acc[field] = pagination.search ? ILike(`%${pagination.search}%`) : null;
         return acc;
      }, {})
    })
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<RequestForm>(entities, meta);
  }

  async findOne(id: string): Promise<RequestForm> {
    const rqf = await this.requestFormRepository.findOne({
      where: {
        id
      },
    })
    if (!rqf) { throw new NotFoundException(`Phiếu yêu cầu không tồn tại!`) }
    return rqf
  }

  async findOneWithRelations(id: string): Promise<RequestForm> {
    const rqf = await this.requestFormRepository.findOne({
      where: {
        id
      },
      relations: ['bill']
    })
    if (!rqf) { throw new NotFoundException(`Phiếu yêu cầu không tồn tại!`) }
    return rqf
  }

  async update(id: string, dto: UpdateRequestFormDto): Promise<RequestForm> {
    const rqf = await this.findOne(id);
    const bill = await this.billService.findOne(dto.billId);
    const merged = await this.requestFormRepository.merge(rqf, {
      ...dto,
      bill
    });
    const saving = await this.requestFormRepository.update(id, merged);
    if (!saving) throw new BadRequestException(`Update request failed`)
    return await this.findOneWithRelations(id);
  }

  async remove(id: string): Promise<DeleteResponse> {
    const queryBuilder = this.requestFormRepository
      .createQueryBuilder()
      .delete()
      .from(RequestForm)
      .where(`id = :id`, { id }).returning("id");
    const exec = (await queryBuilder.execute()).raw[0];
    return {
      message: "Delete request form successfully with id: " + id,
      id: exec.id,
    }
  }
}
