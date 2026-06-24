import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { DiscussionReply } from './discussion-reply.entity';

@Entity('discussion_threads')
export class DiscussionThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (c) => c.discussions)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @OneToMany(() => DiscussionReply, (r) => r.thread, { cascade: true })
  replies: DiscussionReply[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
