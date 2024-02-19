import { ApiProperty } from "@nestjs/swagger";
import { Bill } from "src/bills/entities/bill.entity";

export class CreateRequestFormDto {

    bill: Bill;

    @ApiProperty()
    note: string;

    @ApiProperty()
    reason: string;

    @ApiProperty()
    billId: string;
}
