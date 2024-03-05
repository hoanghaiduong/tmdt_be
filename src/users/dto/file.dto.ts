import { ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UploadFileDTO {
    user: User
    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
    })
    avatar: Express.Multer.File;

}