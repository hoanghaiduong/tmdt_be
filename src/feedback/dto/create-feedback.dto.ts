import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

export class CreateFeedbackDto {
    user?: User;
    product?: Product;

    @ApiProperty()
    description: string;
  
    @ApiProperty()
    productId: string;



}
