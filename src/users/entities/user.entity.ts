import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Order } from "src/orders/entities/order.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";

@Entity()
export class User extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ unique: true })
    username: string;

    // @Column({ nullable: false, default: Role.USER, enum: Role })
    // role: Role;


    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    address: string;


    @Column({ default: false })
    isLocked: boolean;
    @BeforeInsert()
    async hashPassword() {
        // Check if the password field has been modified before hashing
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    @OneToMany(() => Order, order => order.user, { nullable: true })
    orders: Order[];

    @OneToMany(()=>Feedback,feedBack=>feedBack.user,{onDelete:'CASCADE'})
    feedBacks: Feedback[];
}
