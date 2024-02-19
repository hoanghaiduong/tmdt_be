import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct]), OrdersModule, ProductsModule],
  controllers: [OrderProductController],
  providers: [OrderProductService],
  exports: [OrderProductService]
})
export class OrderProductModule { }
