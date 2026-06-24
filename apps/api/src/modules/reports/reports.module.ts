import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Attempt } from '../assessments/attempt.entity';
import { Course } from '../courses/course.entity';
import { Submission } from '../submissions/submission.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Attempt, Course, Submission])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
