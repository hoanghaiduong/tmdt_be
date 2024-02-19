import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feedback extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @ManyToOne(() => User, users => users.feedBacks, { eager: true })
    user: User;

    @ManyToOne(() => Product, products => products.feedBacks, { eager: true })
    product: Product;


}
