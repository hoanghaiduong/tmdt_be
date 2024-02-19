import { BadRequestException } from "@nestjs/common";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderProduct extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 1 })
    amount: number;

    @ManyToOne(() => Product, products => products.orderProducts, { nullable: false, onDelete: 'CASCADE', eager: true })
    product: Product;

    @ManyToOne(() => Order, orders => orders.orderProducts, { nullable: false, onDelete: 'CASCADE', eager: true })
    order: Order;


}
