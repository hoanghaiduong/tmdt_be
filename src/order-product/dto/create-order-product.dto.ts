import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Min } from "class-validator";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";

export class CreateOrderProductDto {
  

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    orderId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    amount: number;


}
