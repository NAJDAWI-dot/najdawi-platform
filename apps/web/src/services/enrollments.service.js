import api from './api';
export const enrollmentsService = {
    enroll: (courseId) => api.post(`/enrollments/${courseId}`).then((r) => r.data),
    drop: (courseId) => api.delete(`/enrollments/${courseId}`).then((r) => r.data),
    updateProgress: (courseId, progress, completedItemId) => api.patch(`/enrollments/${courseId}/progress`, { progress, completedItemId }).then((r) => r.data),
    getMyEnrollments: () => api.get('/enrollments/my').then((r) => r.data),
    getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`).then((r) => r.data),
};
//# sourceMappingURL=enrollments.service.js.map