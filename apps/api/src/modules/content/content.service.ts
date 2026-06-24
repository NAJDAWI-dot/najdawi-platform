import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItem } from './content-item.entity';
import { CreateContentItemDto, UpdateContentItemDto } from './content-item.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentItem)
    private repo: Repository<ContentItem>,
  ) {}

  async create(courseId: string, dto: CreateContentItemDto): Promise<ContentItem> {
    const item = this.repo.create({ ...dto, courseId });
    return this.repo.save(item);
  }

  async findByCourse(courseId: string): Promise<ContentItem[]> {
    return this.repo.find({
      where: { courseId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ContentItem> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Content item not found');
    return item;
  }

  async update(id: string, dto: UpdateContentItemDto): Promise<ContentItem> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.repo.remove(item);
  }
}
