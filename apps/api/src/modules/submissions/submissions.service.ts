import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './submission.entity';
import { CreateSubmissionDto, GradeSubmissionDto } from './submission.dto';
import { ContentItem } from '../content/content-item.entity';
import { UserRole } from '@mos/shared';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private repo: Repository<Submission>,
    @InjectRepository(ContentItem)
    private contentRepo: Repository<ContentItem>,
  ) {}

  async submitWork(userId: string, dto: CreateSubmissionDto): Promise<Submission> {
    const content = await this.contentRepo.findOne({ where: { id: dto.contentItemId } });
    if (!content) throw new NotFoundException('Content not found');

    // Check if submission already exists
    let submission = await this.repo.findOne({
      where: { userId, contentItemId: dto.contentItemId },
    });

    if (submission) {
      // Overwrite previous submission if still pending or even if graded (resubmit)
      submission.fileUrl = dto.fileUrl;
      submission.status = SubmissionStatus.PENDING;
      submission.score = null;
      submission.feedback = null;
    } else {
      submission = this.repo.create({
        userId,
        contentItemId: dto.contentItemId,
        fileUrl: dto.fileUrl,
        status: SubmissionStatus.PENDING,
      });
    }

    return this.repo.save(submission);
  }

  async getMySubmission(userId: string, contentItemId: string): Promise<Submission | null> {
    return this.repo.findOne({ where: { userId, contentItemId } });
  }

  // Admin/Instructor: Get all submissions for a course
  async getCourseSubmissions(courseId: string, instructorId: string, role: string): Promise<Submission[]> {
    const qb = this.repo.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.contentItem', 'contentItem')
      .leftJoin('contentItem.course', 'course')
      .where('contentItem.courseId = :courseId', { courseId });

    if (role !== UserRole.ADMIN) {
      qb.andWhere('course.instructorId = :instructorId', { instructorId });
    }

    return qb.orderBy('submission.createdAt', 'DESC').getMany();
  }

  // Admin/Instructor: Grade submission
  async gradeSubmission(id: string, dto: GradeSubmissionDto, instructorId: string, role: string): Promise<Submission> {
    const submission = await this.repo.findOne({
      where: { id },
      relations: ['contentItem', 'contentItem.course'],
    });

    if (!submission) throw new NotFoundException('Submission not found');
    
    // Ensure instructor owns course
    if (role !== UserRole.ADMIN && submission.contentItem.course.instructorId !== instructorId) {
      throw new ForbiddenException('Not authorized to grade this submission');
    }

    submission.score = dto.score;
    submission.feedback = dto.feedback || null;
    submission.status = SubmissionStatus.GRADED;

    return this.repo.save(submission);
  }
}
