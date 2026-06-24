import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { Choice } from './choice.entity';
import { Attempt } from './attempt.entity';
import { AttemptAnswer } from './attempt-answer.entity';
import { CreateQuizDto, UpdateQuizDto, SubmitAttemptDto } from './assessment.dto';
import { AttemptStatus } from '@mos/shared';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Choice) private choiceRepo: Repository<Choice>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(AttemptAnswer) private answerRepo: Repository<AttemptAnswer>,
  ) {}

  async createQuiz(courseId: string, dto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepo.create({
      courseId,
      title: dto.title,
      description: dto.description,
      passingScore: dto.passingScore,
      timeLimit: dto.timeLimit,
    });

    const savedQuiz = await this.quizRepo.save(quiz);

    for (const qDto of dto.questions) {
      const question = this.questionRepo.create({
        quizId: savedQuiz.id,
        text: qDto.text,
        imageUrl: qDto.imageUrl,
        points: qDto.points,
        order: qDto.order,
      });
      const savedQ = await this.questionRepo.save(question);

      for (const cDto of qDto.choices) {
        const choice = this.choiceRepo.create({
          questionId: savedQ.id,
          text: cDto.text,
          isCorrect: cDto.isCorrect,
          order: cDto.order,
        });
        await this.choiceRepo.save(choice);
      }
    }

    return this.findQuizById(savedQuiz.id);
  }

  async findQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    return this.quizRepo.find({ where: { courseId, isPublished: true } });
  }

  async findQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.choices'],
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async updateQuiz(id: string, dto: UpdateQuizDto): Promise<Quiz> {
    await this.quizRepo.update(id, {
      title: dto.title,
      description: dto.description,
      passingScore: dto.passingScore,
      timeLimit: dto.timeLimit,
    });
    return this.findQuizById(id);
  }

  async togglePublish(id: string): Promise<Quiz> {
    const quiz = await this.findQuizById(id);
    quiz.isPublished = !quiz.isPublished;
    return this.quizRepo.save(quiz);
  }

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.findQuizById(id);
    await this.quizRepo.remove(quiz);
  }

  async startAttempt(quizId: string, userId: string): Promise<Attempt> {
    const quiz = await this.findQuizById(quizId);
    if (!quiz.isPublished) throw new BadRequestException('Quiz is not published');

    const attempt = this.attemptRepo.create({ quizId, userId, startedAt: new Date() });
    return this.attemptRepo.save(attempt);
  }

  async submitAttempt(attemptId: string, userId: string, dto: SubmitAttemptDto): Promise<Attempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, userId },
      relations: ['quiz', 'quiz.questions', 'quiz.questions.choices'],
    });

    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt already submitted');
    }

    // Auto-score: evaluate each answer
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of attempt.quiz.questions) {
      totalPoints += question.points;
      const userAnswer = dto.answers.find((a) => a.questionId === question.id);
      if (!userAnswer) continue;

      const choice = question.choices.find((c) => c.id === userAnswer.choiceId);
      const isCorrect = choice?.isCorrect ?? false;
      if (isCorrect) earnedPoints += question.points;

      const answer = this.answerRepo.create({
        attemptId,
        questionId: question.id,
        choiceId: userAnswer.choiceId,
        isCorrect,
      });
      await this.answerRepo.save(answer);
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    attempt.score = Math.round(score * 10) / 10;
    attempt.isPassed = attempt.score >= attempt.quiz.passingScore;
    attempt.status = AttemptStatus.GRADED;
    attempt.submittedAt = new Date();

    return this.attemptRepo.save(attempt);
  }

  async getAttemptsByUser(userId: string): Promise<Attempt[]> {
    return this.attemptRepo.find({
      where: { userId },
      relations: ['quiz'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAttempt(id: string): Promise<Attempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { id },
      relations: ['quiz', 'answers'],
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    return attempt;
  }
}
