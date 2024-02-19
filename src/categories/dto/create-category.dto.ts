import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Name of the Category' })
    name: string;

    @ApiProperty({ example: 'Description of the Category', required: false })
    description?: string;
}
