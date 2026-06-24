import api from './api';
import type { Course, PaginationMeta } from '@mos/shared';
import type { SoftwareModule, CourseLevel } from '@mos/shared';

export interface CourseFilter {
  module?: SoftwareModule;
  level?: CourseLevel;
  examCode?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const coursesService = {
  getPublished: (filter: CourseFilter = {}) =>
    api
      .get<{ data: Course[]; meta: PaginationMeta }>('/courses', { params: filter })
      .then((r) => r.data),

  getAll: (filter: CourseFilter = {}) =>
    api
      .get<{ data: Course[]; meta: PaginationMeta }>('/courses/admin', { params: filter })
      .then((r) => r.data),

  getById: (id: string) => api.get<Course>(`/courses/${id}?_t=${Date.now()}`).then((r) => r.data),

  create: (payload: Partial<Course>) =>
    api.post<Course>('/courses', payload).then((r) => r.data),

  update: (id: string, payload: Partial<Course>) =>
    api.patch<Course>(`/courses/${id}`, payload).then((r) => r.data),

  togglePublish: (id: string) =>
    api.patch<Course>(`/courses/${id}/publish`).then((r) => r.data),

  delete: (id: string) => api.delete(`/courses/${id}`).then((r) => r.data),
};
