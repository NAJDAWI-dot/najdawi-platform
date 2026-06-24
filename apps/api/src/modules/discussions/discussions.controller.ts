import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscussionsService } from './discussions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('courses/:courseId/discussions')
@UseGuards(AuthGuard('jwt'))
export class DiscussionsController {
  constructor(private discussionsService: DiscussionsService) {}

  @Get()
  findByCourse(@Param('courseId') courseId: string) {
    return this.discussionsService.findByCourse(courseId);
  }

  @Post()
  createThread(
    @Param('courseId') courseId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { title: string; body: string },
  ) {
    return this.discussionsService.createThread(courseId, user.id, body.title, body.body);
  }

  @Post(':threadId/replies')
  createReply(
    @Param('threadId') threadId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { body: string },
  ) {
    return this.discussionsService.createReply(threadId, user.id, body.body);
  }
}
