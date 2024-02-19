import { Module, forwardRef } from '@nestjs/common';
import { RequestFormService } from './request-form.service';
import { RequestFormController } from './request-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestForm } from './entities/request-form.entity';
import { BillsModule } from 'src/bills/bills.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestForm]),
  forwardRef(() => BillsModule)
  ],
  controllers: [RequestFormController],
  providers: [RequestFormService],
  exports: [RequestFormService]
})
export class RequestFormModule { }
