import api from './api';
export const quizService = {
    getQuizzesByCourse: (courseId) => api.get(`/assessments/courses/${courseId}/quizzes`).then((r) => r.data),
    getQuiz: (id) => api.get(`/assessments/quizzes/${id}`).then((r) => r.data),
    startAttempt: (quizId) => api.post(`/assessments/quizzes/${quizId}/attempts`).then((r) => r.data),
    submitAttempt: (attemptId, answers) => api
        .post(`/assessments/attempts/${attemptId}/submit`, { answers })
        .then((r) => r.data),
    getAttempt: (id) => api.get(`/assessments/attempts/${id}`).then((r) => r.data),
    getMyAttempts: () => api.get('/assessments/attempts/my').then((r) => r.data),
    createQuiz: (courseId, payload) => api.post(`/assessments/courses/${courseId}/quizzes`, payload).then((r) => r.data),
    updateQuiz: (id, payload) => api.patch(`/assessments/quizzes/${id}`, payload).then((r) => r.data),
    deleteQuiz: (id) => api.delete(`/assessments/quizzes/${id}`).then((r) => r.data),
};
//# sourceMappingURL=quiz.service.js.map