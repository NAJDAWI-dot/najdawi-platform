import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Attempt } from '../assessments/attempt.entity';
import { Course } from '../courses/course.entity';
import { Submission } from '../submissions/submission.entity';
import { EnrollmentStatus } from '@mos/shared';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
  ) {}

  async getCourseReports() {
    const courses = await this.courseRepo.find({ relations: ['enrollments'] });

    const reports = await Promise.all(
      courses.map(async (course) => {
        const enrollments = course.enrollments || [];
        const completed = enrollments.filter(
          (e) => e.status === EnrollmentStatus.COMPLETED,
        ).length;
        const completionRate =
          enrollments.length > 0 ? (completed / enrollments.length) * 100 : 0;

        const attempts = await this.attemptRepo
          .createQueryBuilder('attempt')
          .innerJoin('attempt.quiz', 'quiz')
          .where('quiz.courseId = :courseId', { courseId: course.id })
          .andWhere('attempt.score IS NOT NULL')
          .getMany();

        const submissions = await this.submissionRepo
          .createQueryBuilder('submission')
          .innerJoin('submission.contentItem', 'contentItem')
          .where('contentItem.courseId = :courseId', { courseId: course.id })
          .andWhere('submission.score IS NOT NULL')
          .getMany();

        const totalScoredItems = attempts.length + submissions.length;
        const totalScore = 
          attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) + 
          submissions.reduce((sum, s) => sum + (s.score ?? 0), 0);

        const avgScore =
          totalScoredItems > 0
            ? totalScore / totalScoredItems
            : 0;

        return {
          courseId: course.id,
          courseTitle: course.title,
          enrollmentCount: enrollments.length,
          completionRate: Math.round(completionRate * 10) / 10,
          avgScore: Math.round(avgScore * 10) / 10,
        };
      }),
    );

    return reports;
  }

  async getAdminDashboardStats() {
    const totalEnrollments = await this.enrollmentRepo.count();
    const completed = await this.enrollmentRepo.count({
      where: { status: EnrollmentStatus.COMPLETED },
    });
    const completionRate =
      totalEnrollments > 0 ? (completed / totalEnrollments) * 100 : 0;

    const revenueResult = await this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .innerJoin('enrollment.course', 'course')
      .select('SUM(course.price)', 'total')
      .getRawOne();

    return {
      totalEnrollments,
      totalRevenue: parseFloat(revenueResult?.total || '0'),
      completionRate: Math.round(completionRate * 10) / 10,
    };
  }
}
