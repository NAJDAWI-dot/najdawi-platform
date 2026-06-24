import { create } from 'zustand';
import type { Quiz, Attempt } from '@mos/shared';
import { quizService, type AnswerPayload } from '../services/quiz.service';

interface QuizState {
  activeQuiz: Quiz | null;
  currentAttempt: Attempt | null;
  answers: Record<string, string>; // questionId -> choiceId
  timeRemaining: number | null;
  isLoading: boolean;
  error: string | null;

  loadQuiz: (quizId: string) => Promise<void>;
  startAttempt: (quizId: string) => Promise<void>;
  setAnswer: (questionId: string, choiceId: string) => void;
  submitAttempt: () => Promise<Attempt>;
  loadAttempt: (id: string) => Promise<void>;
  setTimeRemaining: (seconds: number) => void;
  reset: () => void;
  clearError: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  activeQuiz: null,
  currentAttempt: null,
  answers: {},
  timeRemaining: null,
  isLoading: false,
  error: null,

  loadQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizService.getQuiz(quizId);
      set({ activeQuiz: quiz, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load quiz', isLoading: false });
    }
  },

  startAttempt: async (quizId) => {
    set({ isLoading: true, error: null, answers: {} });
    try {
      const attempt = await quizService.startAttempt(quizId);
      const quiz = get().activeQuiz;
      set({
        currentAttempt: attempt,
        timeRemaining: quiz?.timeLimit ? quiz.timeLimit * 60 : null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to start attempt', isLoading: false });
      throw err;
    }
  },

  setAnswer: (questionId, choiceId) => {
    set((s) => ({ answers: { ...s.answers, [questionId]: choiceId } }));
  },

  submitAttempt: async () => {
    const { currentAttempt, answers } = get();
    if (!currentAttempt) throw new Error('No active attempt');

    set({ isLoading: true });
    const payload: AnswerPayload[] = Object.entries(answers).map(([questionId, choiceId]) => ({
      questionId,
      choiceId,
    }));

    try {
      const result = await quizService.submitAttempt(currentAttempt.id, payload);
      set({ currentAttempt: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Submission failed', isLoading: false });
      throw err;
    }
  },

  loadAttempt: async (id) => {
    set({ isLoading: true });
    try {
      const attempt = await quizService.getAttempt(id);
      set({ currentAttempt: attempt, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load result', isLoading: false });
    }
  },

  setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),

  reset: () =>
    set({ activeQuiz: null, currentAttempt: null, answers: {}, timeRemaining: null }),

  clearError: () => set({ error: null }),
}));
