import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), ProductsModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService]
})
export class FeedbackModule { }
