import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { DeleteResponse } from 'src/common/type';

@Injectable()
export class ProvidersService {
  constructor(@InjectRepository(Provider) private readonly providerRepository: Repository<Provider>) {

  }
  async create(dto: CreateProviderDto): Promise<Provider> {
    const creating = this.providerRepository.create(dto);
    return await this.providerRepository.save(creating);
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Provider>> {
    const searchableFields: Array<keyof Provider> = [
      'name',
      'description',
    ];
    const queryBuilder = this.providerRepository
      .createQueryBuilder('provider')
      .orderBy('provider.createdAt', pagination.order)
      .leftJoinAndSelect('provider.products', 'products')
      .take(pagination.take)
      .skip(pagination.skip)
      .where(
        searchableFields
          .map((field) => `provider.${field} ILIKE :search`)
          .join(' OR '),
        {
          search: `%${pagination.search || ''}%`,
        },
      );

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }

  async findOne(id: string): Promise<Provider> {
    const provider = this.providerRepository
      .createQueryBuilder("provider")
      .where("provider.id= :id", { id })
      .getOne();
    if (!provider) throw new NotFoundException()
    return provider
  }

  async update(id: string, dto: UpdateProviderDto): Promise<Provider> {
    const queryBuilder = this.providerRepository
      .createQueryBuilder('provider')
      .update()
      .set({
        ...dto
      })
      .where("id= :id", { id })
      .returning("*")
    return (await queryBuilder.execute()).raw[0]
  }

  async remove(id: string): Promise<DeleteResponse> {

    await this.findOne(id);

    const queryBuilder = this.providerRepository
      .createQueryBuilder()
      .delete()
      .from(Provider)
      .where('id = :id', { id })
      .returning('id');
    const execute = await queryBuilder.execute();
    return {
      message: 'Provider deleted successfully',
      id: execute.raw[0].id,
    };
  }
}
