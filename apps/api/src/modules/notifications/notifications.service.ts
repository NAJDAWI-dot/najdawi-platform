import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: cfg.get<string>('MAIL_HOST'),
      port: cfg.get<number>('MAIL_PORT'),
      auth: {
        user: cfg.get<string>('MAIL_USER'),
        pass: cfg.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEnrollmentConfirmation(user: any, course: any): Promise<void> {
    this.logger.log(`Sending enrollment confirmation: user=${user.email} course=${course.title}`);
    try {
      await this.transporter.sendMail({
        from: `"MOS Platform" <${this.cfg.get('MAIL_USER')}>`,
        to: user.email,
        subject: 'Enrollment Confirmed!',
        html: `
          <div style="font-family: sans-serif; max-w-2xl mx-auto; p-6; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h1 style="color: #0ea5e9;">Welcome to ${course.title}! 🚀</h1>
            <p>Hi ${user.firstName},</p>
            <p>You have successfully enrolled in <strong>${course.title}</strong>.</p>
            <p>We are thrilled to have you on board! You can start learning immediately by clicking the button below:</p>
            <a href="${this.cfg.get('FRONTEND_URL')}/courses/${course.id}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">Go to Course</a>
            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">Happy learning,<br>The MOS Platform Team</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send enrollment confirmation email', err);
    }
  }

  async sendProgressReminder(email: string, courseName: string, progress: number): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"MOS Platform" <${this.cfg.get('MAIL_USER')}>`,
        to: email,
        subject: `Continue your journey in ${courseName}`,
        html: `
          <h1>Don't stop now!</h1>
          <p>You're <strong>${progress}%</strong> through <strong>${courseName}</strong>.</p>
          <p>Keep going to earn your MOS certification!</p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send progress reminder email', err);
    }
  }
}
