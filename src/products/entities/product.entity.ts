import { Category } from "src/categories/entities/category.entity";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { OrderProduct } from "src/order-product/entities/order-product.entity";
import { Order } from "src/orders/entities/order.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    uses: string;

    @Column({ nullable: false, type: 'integer' })
    quantity: number

    @Column({ nullable: false, type: 'float' })
    price: number;

    @ManyToOne(() => Provider, providers => providers.products, { nullable: false })
    provider: Provider;

    @ManyToOne(() => Category, categories => categories.products, { nullable: false })
    category: Category;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.product, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    orderProducts: OrderProduct[];


    @OneToMany(() => Feedback, feedBack => feedBack.product, { onDelete: 'CASCADE' })
    feedBacks: Feedback[];
}
