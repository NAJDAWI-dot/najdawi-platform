import api from './api';
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data),
    register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }).then((r) => r.data),
    logout: () => api.post('/auth/logout').then((r) => r.data),
    me: () => api.get('/auth/me').then((r) => r.data),
};
//# sourceMappingURL=auth.service.js.map