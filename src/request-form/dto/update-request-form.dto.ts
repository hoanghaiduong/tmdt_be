import { PartialType } from '@nestjs/swagger';
import { CreateRequestFormDto } from './create-request-form.dto';

export class UpdateRequestFormDto extends PartialType(CreateRequestFormDto) {}
