import { DateTimeEntity } from "src/common/entities/DateTime.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Provider extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @OneToMany(() => Product, product => product.provider, { nullable: true, onDelete: 'CASCADE' })
    products: Product[];
}
