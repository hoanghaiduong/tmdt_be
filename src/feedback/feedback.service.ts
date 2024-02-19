import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { DeleteResponse } from 'src/common/type';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly productService: ProductsService
  ) { }

  async create(dto: CreateFeedbackDto): Promise<Feedback> {
    const product = await this.productService.findOne(dto.productId);
    if (!dto.user) {
      throw new UnauthorizedException()
    }
    const creating = await this.feedbackRepository.create({
      ...dto,
      product,
      user: dto.user
    })
    return await this.feedbackRepository.save(creating);
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Feedback>> {
    const searchableFields: Array<keyof Feedback> = [
      "description"
    ]
    const [entities, itemCount] = await this.feedbackRepository.findAndCount({
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
    const meta = new Meta({ itemCount, pagination })
    return new PaginationModel<Feedback>(entities, meta);
  }

  async findOne(id: string): Promise<Feedback> {
    const feed = await this.feedbackRepository.findOne({
      where: { id },
      loadEagerRelations: false
    })
    if (!feed) throw new NotFoundException()
    return feed;
  }
  async findOneWithRelation(id: string): Promise<Feedback> {
    const feed = await this.feedbackRepository.findOne({
      where: { id },
    })
    if (!feed) throw new NotFoundException()
    return feed;
  }
  async update(id: string, dto: UpdateFeedbackDto): Promise<Feedback> {
    const feed = await this.findOne(id);
    if (!dto.user) {
      throw new UnauthorizedException()
    }
    const product = await this.productService.findOne(dto.productId);
    const merged = this.feedbackRepository.merge(feed, {
      ...dto,
      product,
    })
    const updated = await this.feedbackRepository.save(merged);
    if (!updated) throw new BadRequestException()
    return await this.findOneWithRelation(id);
  }

  async remove(id: string): Promise<DeleteResponse> {
    await this.findOne(id);
    const queryBuilder = this.feedbackRepository
      .createQueryBuilder()
      .delete()
      .from(Feedback)
      .where(`id = :id`, { id })
      .returning("id");
    const execute = (await queryBuilder.execute()).raw[0];
    return execute
  }
}
