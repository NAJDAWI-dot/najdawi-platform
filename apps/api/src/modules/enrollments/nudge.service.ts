import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentStatus } from '@mos/shared';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NudgeService {
  private readonly logger = new Logger(NudgeService.name);

  constructor(
    @InjectRepository(Enrollment)
    private repo: Repository<Enrollment>,
    private mailService: MailService,
  ) {}

  // Run every day at 9 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleCron() {
    this.logger.log('Running daily student nudge check...');

    // Find active enrollments that haven't been updated in 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const inactiveEnrollments = await this.repo.find({
      where: {
        status: EnrollmentStatus.ACTIVE,
        updatedAt: LessThan(threeDaysAgo),
      },
      relations: ['user', 'course'],
    });

    if (inactiveEnrollments.length === 0) {
      this.logger.log('No inactive students to nudge today.');
      return;
    }

    for (const enrollment of inactiveEnrollments) {
      const { user, course } = enrollment;
      
      // Use our new premium MailService to send real HTML emails
      await this.mailService.sendNudgeEmail(
        user.email,
        user.firstName,
        course.title,
        enrollment.progress
      );

      enrollment.updatedAt = new Date(); // Reset the clock so we nudge them again in 3 days if they don't do anything
      await this.repo.save(enrollment);
    }

    this.logger.log(`Nudged ${inactiveEnrollments.length} students today.`);
  }
}
