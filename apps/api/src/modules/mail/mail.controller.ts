import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    try {
      await this.mailService.sendWelcomeEmail('najdawihashem01@gmail.com', 'Test User');
      return { success: true, message: 'Email sent successfully from Render' };
    } catch (e: any) {
      return { success: false, message: e.message, stack: e.stack };
    }
  }
}
