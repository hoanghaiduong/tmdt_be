import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProvidersService } from 'src/providers/providers.service';
import { CategoriesService } from 'src/categories/categories.service';
import { DeleteResponse } from 'src/common/type';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly providerService: ProvidersService,
    private readonly categoryService: CategoriesService
  ) { }

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findOne(dto.categoryId);
    const provider = await this.providerService.findOne(dto.providerId);
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .insert()
      .into(Product)
      .values({
        ...dto,
        provider,
        category
      })
      .returning("*");
    const execute = await queryBuilder.execute();
    return execute.raw[0]
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Product>> {
    const searchableFields: Array<keyof Product> = [
      "name",
      "description",
      "uses"
    ]
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.provider', 'provider')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.orderProducts', 'orderProducts')
      .leftJoinAndSelect('product.feedBacks', 'feedBacks')
      .take(pagination.take)
      .skip(pagination.skip)
      .orderBy('product.createdAt', pagination.order)
      .where(
        searchableFields.map(field =>
          `product.${field} ILIKE :search`
        ).join(' OR '), { search: `%${pagination.search || ''}%` }
      );

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const meta = new Meta({ pagination, itemCount });
    return new PaginationModel<Product>(entities, meta);
  }

  async findOne(id: string): Promise<Product> {
    const prod = await this.productRepository.findOne({
      where: { id },
    });
    if (!prod) throw new NotFoundException()
    return prod;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const category = await this.categoryService.findOne(dto.categoryId);
    const provider = await this.providerService.findOne(dto.providerId);
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .update()
      .set({
        ...dto,
        provider,
        category
      })
      .where('product.id = :id', { id })
      .returning("*");
    const execute = await queryBuilder.execute();
    return execute.raw[0]
  }

  async updateNoResult(id: string, updateProductDto: UpdateProductDto): Promise<void> {
    await this.findOne(id);
    await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string): Promise<DeleteResponse> {
    await this.findOne(id);
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .delete()
      .from(Product)
      .where('product.id = :id', { id })
      .returning('id');
    const excecute = await queryBuilder.execute();
    return {
      message: 'Product deleted successfully',
      id: excecute.raw[0].id
    }
  }
}
