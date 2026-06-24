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
import { AttemptStatus } from '@mos/shared';
import { User } from '../users/user.entity';
import { Quiz } from './quiz.entity';
import { AttemptAnswer } from './attempt-answer.entity';

@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (q) => q.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column()
  quizId: string;

  @ManyToOne(() => User, (u) => u.attempts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => AttemptAnswer, (a) => a.attempt, { cascade: true, eager: true })
  answers: AttemptAnswer[];

  @Column({ type: 'float', nullable: true })
  score: number;

  @Column({ nullable: true })
  isPassed: boolean;

  @Column({ type: 'enum', enum: AttemptStatus, default: AttemptStatus.IN_PROGRESS })
  status: AttemptStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ nullable: true })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
