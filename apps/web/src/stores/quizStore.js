import { create } from 'zustand';
import { quizService } from '../services/quiz.service';
export const useQuizStore = create((set, get) => ({
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
        }
        catch (err) {
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
        }
        catch (err) {
            set({ error: err.response?.data?.message || 'Failed to start attempt', isLoading: false });
            throw err;
        }
    },
    setAnswer: (questionId, choiceId) => {
        set((s) => ({ answers: { ...s.answers, [questionId]: choiceId } }));
    },
    submitAttempt: async () => {
        const { currentAttempt, answers } = get();
        if (!currentAttempt)
            throw new Error('No active attempt');
        set({ isLoading: true });
        const payload = Object.entries(answers).map(([questionId, choiceId]) => ({
            questionId,
            choiceId,
        }));
        try {
            const result = await quizService.submitAttempt(currentAttempt.id, payload);
            set({ currentAttempt: result, isLoading: false });
            return result;
        }
        catch (err) {
            set({ error: err.response?.data?.message || 'Submission failed', isLoading: false });
            throw err;
        }
    },
    loadAttempt: async (id) => {
        set({ isLoading: true });
        try {
            const attempt = await quizService.getAttempt(id);
            set({ currentAttempt: attempt, isLoading: false });
        }
        catch (err) {
            set({ error: err.response?.data?.message || 'Failed to load result', isLoading: false });
        }
    },
    setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),
    reset: () => set({ activeQuiz: null, currentAttempt: null, answers: {}, timeRemaining: null }),
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=quizStore.js.map