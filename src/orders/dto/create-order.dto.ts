import { IsNotEmpty, IsUUID } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateOrderDto {
  user:User;
}
