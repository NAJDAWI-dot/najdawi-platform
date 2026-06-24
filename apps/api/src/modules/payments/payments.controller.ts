import { Controller, Post, Param, Req, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('checkout/:courseId')
  @UseGuards(AuthGuard('jwt'))
  createCheckout(
    @Param('courseId') courseId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.createCheckoutSession(courseId, user.id);
  }

  @Post('webhook')
  handleWebhook(@Req() req: Request, @Headers('stripe-signature') sig: string) {
    // rawBody is injected by NestFactory rawBody: true
    return this.paymentsService.handleWebhook((req as any).rawBody || req.body, sig);
  }
}
