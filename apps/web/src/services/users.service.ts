import api from './api';
import type { User } from '@mos/shared';
import type { UserRole } from '@mos/shared';

export const usersService = {
  getAll: (page = 1, limit = 20) =>
    api.get<{ data: User[]; total: number }>('/users', { params: { page, limit } }).then((r) => r.data),

  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),

  update: (id: string, payload: Partial<User>) =>
    api.patch<User>(`/users/${id}`, payload).then((r) => r.data),

  assignRole: (id: string, role: UserRole) =>
    api.patch<User>(`/users/${id}/role`, { role }).then((r) => r.data),

  delete: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};
