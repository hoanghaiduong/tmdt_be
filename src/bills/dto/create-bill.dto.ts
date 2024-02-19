import { ApiProperty } from "@nestjs/swagger";
import { Order } from "src/orders/entities/order.entity";
import { RequestForm } from "src/request-form/entities/request-form.entity";

export class CreateBillDto {

    order: Order;

    @ApiProperty()
    note: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    orderId: string;

}
