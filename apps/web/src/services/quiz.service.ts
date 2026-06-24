import api from './api';
import type { Quiz, Attempt } from '@mos/shared';

export interface AnswerPayload {
  questionId: string;
  choiceId: string;
}

export const quizService = {
  getQuizzesByCourse: (courseId: string) =>
    api.get<Quiz[]>(`/assessments/courses/${courseId}/quizzes`).then((r) => r.data),

  getQuiz: (id: string) =>
    api.get<Quiz>(`/assessments/quizzes/${id}`).then((r) => r.data),

  startAttempt: (quizId: string) =>
    api.post<Attempt>(`/assessments/quizzes/${quizId}/attempts`).then((r) => r.data),

  submitAttempt: (attemptId: string, answers: AnswerPayload[]) =>
    api
      .post<Attempt>(`/assessments/attempts/${attemptId}/submit`, { answers })
      .then((r) => r.data),

  getAttempt: (id: string) =>
    api.get<Attempt>(`/assessments/attempts/${id}`).then((r) => r.data),

  getMyAttempts: () =>
    api.get<Attempt[]>('/assessments/attempts/my').then((r) => r.data),

  createQuiz: (courseId: string, payload: Partial<Quiz>) =>
    api.post<Quiz>(`/assessments/courses/${courseId}/quizzes`, payload).then((r) => r.data),

  updateQuiz: (id: string, payload: Partial<Quiz>) =>
    api.patch<Quiz>(`/assessments/quizzes/${id}`, payload).then((r) => r.data),

  deleteQuiz: (id: string) => api.delete(`/assessments/quizzes/${id}`).then((r) => r.data),
};
