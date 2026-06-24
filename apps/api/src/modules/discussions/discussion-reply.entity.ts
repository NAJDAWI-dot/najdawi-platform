import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { DiscussionThread } from './discussion-thread.entity';

@Entity('discussion_replies')
export class DiscussionReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DiscussionThread, (t) => t.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'threadId' })
  thread: DiscussionThread;

  @Column()
  threadId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
