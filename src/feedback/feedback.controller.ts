import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('feedback')
@ApiTags("API Quản lý phản hồi")
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  create(@AuthUser() user: User, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create({
      ...dto,
      user
    });
  }

  @Get('gets')
  findAll(@Query() pagination: Pagination) {
    return this.feedbackService.findAll(pagination);
  }

  @Get()
  findOne(@Query('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
