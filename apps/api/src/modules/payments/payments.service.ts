import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private cfg: ConfigService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
  ) {
    const key = this.cfg.get<string>('STRIPE_SECRET_KEY');
    if (!key) {
      this.logger.warn('STRIPE_SECRET_KEY is not set. Payments will not work.');
    }
    this.stripe = new Stripe(key || 'sk_test_mock', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(courseId: string, userId: string): Promise<{ url: string }> {
    const course = await this.coursesService.findOne(courseId);

    if (course.price === 0) {
      this.logger.log(`Course ${courseId} is free. Auto-enrolling user ${userId}`);
      await this.enrollmentsService.enroll(userId, courseId);
      return { url: `${this.cfg.get('FRONTEND_URL')}/courses/${courseId}?payment=success` };
    }

    this.logger.log(`Creating Stripe checkout session: course=${courseId} user=${userId}`);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.shortDescription || 'Course Enrollment',
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.cfg.get('FRONTEND_URL')}/courses/${courseId}?payment=success`,
      cancel_url: `${this.cfg.get('FRONTEND_URL')}/courses/${courseId}?payment=cancelled`,
      client_reference_id: userId,
      metadata: {
        courseId,
        userId,
      },
    });

    return { url: session.url! };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.cfg.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.error('Webhook secret not configured');
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { courseId, userId } = session.metadata || {};

      if (courseId && userId) {
        this.logger.log(`Payment successful! Enrolling user ${userId} in course ${courseId}`);
        await this.enrollmentsService.enroll(userId, courseId);
      }
    }
  }
}
