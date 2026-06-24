import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { NudgeService } from './nudge.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), NotificationsModule, MailModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, NudgeService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
