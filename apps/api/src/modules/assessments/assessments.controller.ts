import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssessmentsService } from './assessments.service';
import { CreateQuizDto, UpdateQuizDto, SubmitAttemptDto } from './assessment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@mos/shared';

@Controller('assessments')
@UseGuards(AuthGuard('jwt'))
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  // ── Quiz endpoints ──
  @Post('courses/:courseId/quizzes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  createQuiz(@Param('courseId') courseId: string, @Body() dto: CreateQuizDto) {
    return this.assessmentsService.createQuiz(courseId, dto);
  }

  @Get('courses/:courseId/quizzes')
  findQuizzesByCourse(@Param('courseId') courseId: string) {
    return this.assessmentsService.findQuizzesByCourse(courseId);
  }

  @Get('quizzes/:id')
  findQuiz(@Param('id') id: string) {
    return this.assessmentsService.findQuizById(id);
  }

  @Patch('quizzes/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  updateQuiz(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.assessmentsService.updateQuiz(id, dto);
  }

  @Patch('quizzes/:id/publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePublish(@Param('id') id: string) {
    return this.assessmentsService.togglePublish(id);
  }

  @Delete('quizzes/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteQuiz(@Param('id') id: string) {
    return this.assessmentsService.deleteQuiz(id);
  }

  // ── Attempt endpoints ──
  @Post('quizzes/:quizId/attempts')
  startAttempt(
    @Param('quizId') quizId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.assessmentsService.startAttempt(quizId, user.id);
  }

  @Post('attempts/:attemptId/submit')
  submitAttempt(
    @Param('attemptId') attemptId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitAttemptDto,
  ) {
    return this.assessmentsService.submitAttempt(attemptId, user.id, dto);
  }

  @Get('attempts/my')
  getMyAttempts(@CurrentUser() user: { id: string }) {
    return this.assessmentsService.getAttemptsByUser(user.id);
  }

  @Get('attempts/:id')
  getAttempt(@Param('id') id: string) {
    return this.assessmentsService.getAttempt(id);
  }
}
