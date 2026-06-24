import api from './api';
export const coursesService = {
    getPublished: (filter = {}) => api
        .get('/courses', { params: filter })
        .then((r) => r.data),
    getAll: (filter = {}) => api
        .get('/courses/admin', { params: filter })
        .then((r) => r.data),
    getById: (id) => api.get(`/courses/${id}?_t=${Date.now()}`).then((r) => r.data),
    create: (payload) => api.post('/courses', payload).then((r) => r.data),
    update: (id, payload) => api.patch(`/courses/${id}`, payload).then((r) => r.data),
    togglePublish: (id) => api.patch(`/courses/${id}/publish`).then((r) => r.data),
    delete: (id) => api.delete(`/courses/${id}`).then((r) => r.data),
};
//# sourceMappingURL=courses.service.js.map