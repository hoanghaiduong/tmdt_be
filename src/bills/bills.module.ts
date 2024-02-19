import { Module, forwardRef } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { RequestFormModule } from 'src/request-form/request-form.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => RequestFormModule), OrdersModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService]
})
export class BillsModule { }
