import api from './api';
export const usersService = {
    getAll: (page = 1, limit = 20) => api.get('/users', { params: { page, limit } }).then((r) => r.data),
    getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
    update: (id, payload) => api.patch(`/users/${id}`, payload).then((r) => r.data),
    assignRole: (id, role) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
    delete: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
//# sourceMappingURL=users.service.js.map