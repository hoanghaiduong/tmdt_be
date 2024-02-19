import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { DeleteResponse } from 'src/common/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {

  }
  async create(dto: CreateCategoryDto): Promise<Category> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .insert()
      .into(Category)
      .values({ ...dto })
      .returning("*");
    const excute = await queryBuilder.execute();
    return excute.raw[0]
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Category>> {
    const searchableFields: Array<keyof Category> = [
      "name",
      "description"
    ];
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .skip(pagination.skip)
      .take(pagination.take)
      .orderBy("category.createdAt", pagination.order)
      .leftJoinAndSelect('category.products', 'products')
      .where(
        searchableFields.map(field => `category.${field} ILIKE :search`)
          .join(' OR ')
        , { search: `%${pagination.search || ''}%` }
      )
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const meta = new Meta({ pagination, itemCount });
    return new PaginationModel<Category>(entities, meta);
  }

  async findOne(id: string): Promise<Category> {
    const cate = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id= :id', { id })
      .getOne();
    if (!cate) throw new NotFoundException()
    return cate
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .update()
      .set({
        ...dto
      })
      .where('category.id = :id', { id })
      .returning('*');
    const execute = await queryBuilder.execute();
    return execute.raw[0];
  }

  async remove(id: string): Promise<DeleteResponse> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .delete()
      .from(Category)
      .where('category.id = :id', { id })
      .returning('*');
    const execute = await queryBuilder.execute();
    return {
      message: 'Category deleted successfully',
      id: execute.raw[0].id,
    };
  }
}
