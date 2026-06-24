import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscussionThread } from './discussion-thread.entity';
import { DiscussionReply } from './discussion-reply.entity';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(DiscussionThread) private threadRepo: Repository<DiscussionThread>,
    @InjectRepository(DiscussionReply) private replyRepo: Repository<DiscussionReply>,
  ) {}

  async findByCourse(courseId: string): Promise<DiscussionThread[]> {
    return this.threadRepo.find({
      where: { courseId },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
    });
  }

  async createThread(courseId: string, authorId: string, title: string, body: string) {
    const thread = this.threadRepo.create({ courseId, authorId, title, body });
    return this.threadRepo.save(thread);
  }

  async createReply(threadId: string, authorId: string, body: string) {
    const reply = this.replyRepo.create({ threadId, authorId, body });
    return this.replyRepo.save(reply);
  }
}
