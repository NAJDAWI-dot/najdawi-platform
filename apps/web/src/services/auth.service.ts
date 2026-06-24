import api from './api';
import type { LoginResponse, User } from '@mos/shared';

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }) => api.post<LoginResponse>('/auth/register', payload).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<LoginResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  me: () => api.get<User>('/auth/me').then((r) => r.data),
};
