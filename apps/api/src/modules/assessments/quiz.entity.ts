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
import { Course } from '../courses/course.entity';
import { Question } from './question.entity';
import { Attempt } from './attempt.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (c) => c.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 70 })
  passingScore: number;

  @Column({ nullable: true })
  timeLimit: number;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => Question, (q) => q.quiz, { cascade: true, eager: true })
  questions: Question[];

  @OneToMany(() => Attempt, (a) => a.quiz)
  attempts: Attempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
