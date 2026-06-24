import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, GradeSubmissionDto } from './submission.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'))
export class SubmissionsController {
  constructor(private service: SubmissionsService) {}

  @Post()
  submitWork(@CurrentUser() user: any, @Body() dto: CreateSubmissionDto) {
    return this.service.submitWork(user.id, dto);
  }

  @Get('me/:contentItemId')
  getMySubmission(@CurrentUser() user: any, @Param('contentItemId') contentItemId: string) {
    return this.service.getMySubmission(user.id, contentItemId);
  }

  @Get('course/:courseId')
  getCourseSubmissions(@CurrentUser() user: any, @Param('courseId') courseId: string) {
    return this.service.getCourseSubmissions(courseId, user.id, user.role);
  }

  @Patch(':id/grade')
  gradeSubmission(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: GradeSubmissionDto) {
    return this.service.gradeSubmission(id, dto, user.id, user.role);
  }
}
