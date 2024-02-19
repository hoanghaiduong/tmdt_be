import { Bill } from "src/bills/entities/bill.entity";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 }) // Nullable because it will be populated before insert
    totalPrice: number;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { onDelete: 'CASCADE', nullable: true })
    orderProducts: OrderProduct[];

    @ManyToOne(() => User, users => users.orders, { nullable: false })
    user: User;

    @OneToOne(() => Bill, bill => bill.order)
    bill: Bill
}
