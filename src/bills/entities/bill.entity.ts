import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Order } from "src/orders/entities/order.entity";
import { RequestForm } from "src/request-form/entities/request-form.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bill extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    note: string;

    @Column()
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @OneToOne(() => Order, order => order.bill, { eager: true })
    @JoinColumn()
    order: Order;//orderId

    @OneToOne(() => RequestForm, requestForm => requestForm.bill, { eager: true })
    requestForm: RequestForm;
}
