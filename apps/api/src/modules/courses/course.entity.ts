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
import { SoftwareModule, CourseLevel } from '@mos/shared';
import { User } from '../users/user.entity';
import { ContentItem } from '../content/content-item.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Quiz } from '../assessments/quiz.entity';
import { DiscussionThread } from '../discussions/discussion-thread.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  shortDescription: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'enum', enum: SoftwareModule })
  module: SoftwareModule;

  @Column({ type: 'enum', enum: CourseLevel })
  level: CourseLevel;

  @Column()
  examCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, (u) => u.courses)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  instructorId: string;

  @OneToMany(() => ContentItem, (c) => c.course, { cascade: true })
  contentItems: ContentItem[];

  @OneToMany(() => Enrollment, (e) => e.course)
  enrollments: Enrollment[];

  @OneToMany(() => Quiz, (q) => q.course, { cascade: true })
  quizzes: Quiz[];

  @OneToMany(() => DiscussionThread, (d) => d.course)
  discussions: DiscussionThread[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
