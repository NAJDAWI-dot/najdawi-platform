import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnrollmentsService } from './enrollments.service';
import { UpdateProgressDto } from './enrollment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@mos/shared';

@Controller('enrollments')
@UseGuards(AuthGuard('jwt'))
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post(':courseId')
  enroll(
    @Param('courseId') courseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.enrollmentsService.enroll(user.id, courseId);
  }

  @Delete(':courseId')
  drop(
    @Param('courseId') courseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.enrollmentsService.drop(user.id, courseId);
  }

  @Patch(':courseId/progress')
  updateProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProgressDto,
  ) {
    return this.enrollmentsService.updateProgress(user.id, courseId, dto);
  }

  @Get('my')
  getMyEnrollments(@CurrentUser() user: { id: string }) {
    return this.enrollmentsService.findByUser(user.id);
  }

  @Get('course/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  findByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }
}
