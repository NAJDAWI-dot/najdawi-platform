import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto, CourseFilterDto } from './course.dto';
import { UserRole } from '@mos/shared';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private repo: Repository<Course>,
  ) {}

  async create(dto: CreateCourseDto, instructorId: string): Promise<Course> {
    const course = this.repo.create({ ...dto, instructorId });
    return this.repo.save(course);
  }

  async findAll(filter: CourseFilterDto) {
    const { module, level, examCode, search, page = 1, limit = 12 } = filter;

    const where: FindOptionsWhere<Course> = {};
    if (module) where.module = module;
    if (level) where.level = level;
    if (examCode) where.examCode = examCode;
    if (search) where.title = ILike(`%${search}%`);

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: ['instructor'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findPublished(filter: CourseFilterDto) {
    const { module, level, examCode, search, page = 1, limit = 12 } = filter;
    const where: FindOptionsWhere<Course> = { isPublished: true };
    if (module) where.module = module;
    if (level) where.level = level;
    if (examCode) where.examCode = examCode;

    const qb = this.repo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .where('course.isPublished = true');

    if (module) qb.andWhere('course.module = :module', { module });
    if (level) qb.andWhere('course.level = :level', { level });
    if (examCode) qb.andWhere('course.examCode = :examCode', { examCode });
    if (search)
      qb.andWhere('course.title ILIKE :search OR course.description ILIKE :search', {
        search: `%${search}%`,
      });

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.repo.findOne({
      where: { id },
      relations: ['instructor', 'contentItems', 'quizzes'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, role: UserRole): Promise<Course> {
    const course = await this.findOne(id);
    if (role !== UserRole.ADMIN && course.instructorId !== userId) {
      throw new ForbiddenException('Not allowed to edit this course');
    }
    Object.assign(course, dto);
    return this.repo.save(course);
  }

  async togglePublish(id: string): Promise<Course> {
    const course = await this.findOne(id);
    course.isPublished = !course.isPublished;
    return this.repo.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.repo.remove(course);
  }
}
