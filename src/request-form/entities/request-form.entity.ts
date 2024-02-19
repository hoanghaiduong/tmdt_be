import { Bill } from "src/bills/entities/bill.entity";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RequestForm extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    note: string;

    @Column()
    reason: string;

    @OneToOne(() => Bill, bills => bills.requestForm)
    @JoinColumn()
    bill: Bill;//billId
}
