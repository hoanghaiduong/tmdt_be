import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService
  ) { }
  // async create(dto: CreateOrderProductDto): Promise<OrderProduct> {
  //   // Tìm đơn hàng và sản phẩm tương ứng
  //   const order = await this.orderService.findOneRelation(dto.orderId, ["orderProducts", "orderProducts.product"]);
  //   const product = await this.productService.findOne(dto.productId);

  //   // Kiểm tra số lượng tồn của sản phẩm
  //   if (product.quantity < dto.amount) {
  //     throw new BadRequestException('Số lượng sản phẩm bạn mua vượt quá số tồn!');
  //   }

  //   // Tìm xem có OrderProduct nào cho sản phẩm này trong đơn hàng không
  //   let orderProduct = order.orderProducts.find(op => op.product.id === dto.productId);

  //   // Nếu không có OrderProduct cho sản phẩm này trong đơn hàng, tạo mới
  //   if (!orderProduct) {
  //     orderProduct = this.orderProductRepository.create({
  //       ...dto,
  //       order,
  //       product,
  //     });

  //   } else {
  //     // Nếu có, cập nhật số lượng
  //     orderProduct.amount = dto.amount;
  //   }
  //   // Tính toán lại tổng giá trị cho đơn hàng
  //   await this.orderService.calculateTotalPrice(order);

  //   // Cập nhật số lượng tồn của sản phẩm
  //   product.quantity -= dto.amount;
  //   await this.productService.updateNoResult(product.id, { quantity: product.quantity });


  //   // Trả về OrderProduct đã được tạo hoặc cập nhật
  //   orderProduct = await this.orderProductRepository.save(orderProduct);
  //   return orderProduct;
  // }
  async create(dto: CreateOrderProductDto): Promise<OrderProduct> {
    const order = await this.orderService.findOneRelation(dto.orderId, ["orderProducts", "orderProducts.product"]);
    const product = await this.productService.findOne(dto.productId);
    let orderProduct = order.orderProducts.find(op => op.product.id === dto.productId);
    if (orderProduct) {
      throw new BadRequestException(`Sản phẩm đã tồn tại trong đơn hàng của bạn!`)
    }
    const creating = this.orderProductRepository.create({
      ...dto,
      order,
      product,
    });
    await this.orderService.calculateTotalPrice(order);
    product.quantity -= dto.amount;
    await this.productService.updateNoResult(product.id, { quantity: product.quantity });
    return await this.orderProductRepository.save(creating);

  }
  async findOne(id: string): Promise<OrderProduct> {
    const orderProd = await this.orderProductRepository.findOne({
      where: { id },
      loadEagerRelations: false
    });
    if (!orderProd) throw new NotFoundException()
    return orderProd;
  }
  async findOneWithRelations(id: string): Promise<OrderProduct> {
    const orderProd = await this.orderProductRepository.findOne({
      where: { id },

    });
    if (!orderProd) throw new NotFoundException()
    return orderProd;
  }
  async update(id: string, dto: UpdateOrderProductDto): Promise<OrderProduct | any> {
    const orderProd = await this.findOneWithRelations(id)
    const order = await this.orderService.findOneRelation(dto.orderId, ["orderProducts", "orderProducts.product"]);
    const product = await this.productService.findOne(dto.productId);
    const merged = this.orderProductRepository.merge(orderProd, {
      ...dto,
      order,
      product
    })
    await this.orderService.calculateTotalPrice(order);
    product.quantity -= dto.amount;
    await this.productService.updateNoResult(product.id, { quantity: product.quantity });
    await this.orderProductRepository.save(merged);
    return await this.findOneWithRelations(id);

  }

  async remove(id: string): Promise<void> {
    const orderProd = await this.findOne(id);
    await this.orderProductRepository.remove(orderProd);
  }
  async findAll(pagination: Pagination): Promise<PaginationModel<OrderProduct>> {

    const [entities, itemCount] = await this.orderProductRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: {
        createdAt: pagination.order
      },
    });
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<OrderProduct>(entities, meta)

  }

}
