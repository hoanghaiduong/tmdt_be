import { User } from "src/users/entities/user.entity";



export interface AuthenticationRequest extends Request {
    user: User;
}