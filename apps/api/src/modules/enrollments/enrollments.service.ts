import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { UpdateProgressDto } from './enrollment.dto';
import { EnrollmentStatus } from '@mos/shared';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private repo: Repository<Enrollment>,
    private notificationsService: NotificationsService,
  ) {}

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const existing = await this.repo.findOne({ where: { userId, courseId } });
    if (existing) {
      if (existing.status === EnrollmentStatus.DROPPED) {
        existing.status = EnrollmentStatus.ACTIVE;
        return this.repo.save(existing);
      }
      throw new ConflictException('Already enrolled in this course');
    }

    const enrollment = this.repo.create({ userId, courseId });
    const saved = await this.repo.save(enrollment);

    // Fetch relations for email
    const fullEnrollment = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['user', 'course'],
    });

    if (fullEnrollment && fullEnrollment.user && fullEnrollment.course) {
      // Send enrollment confirmation (fire-and-forget)
      this.notificationsService.sendEnrollmentConfirmation(fullEnrollment.user, fullEnrollment.course).catch((e) => {
        console.error('Failed to send email:', e);
      });
    }

    return saved;
  }

  async drop(userId: string, courseId: string): Promise<Enrollment> {
    const enrollment = await this.repo.findOne({ where: { userId, courseId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    enrollment.status = EnrollmentStatus.DROPPED;
    return this.repo.save(enrollment);
  }

  async updateProgress(
    userId: string,
    courseId: string,
    dto: UpdateProgressDto,
  ): Promise<Enrollment> {
    const enrollment = await this.repo.findOne({ where: { userId, courseId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    enrollment.progress = dto.progress;

    if (dto.completedItemId) {
      const items = enrollment.completedItemIds || [];
      if (!items.includes(dto.completedItemId)) {
        items.push(dto.completedItemId);
      }
      enrollment.completedItemIds = items;
    }

    if (dto.progress >= 100) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
    }
    return this.repo.save(enrollment);
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    return this.repo.find({
      where: { userId },
      relations: ['course', 'course.instructor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.repo.find({
      where: { courseId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const e = await this.repo.findOne({ where: { userId, courseId, status: EnrollmentStatus.ACTIVE } });
    return !!e;
  }
}
