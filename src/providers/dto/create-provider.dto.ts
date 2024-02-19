import { ApiProperty } from "@nestjs/swagger";

export class CreateProviderDto {
    @ApiProperty({ description: 'Name of the provider' })
    name: string;

    @ApiProperty({ description: 'Description of the provider', required: false })
    description?: string;
}
