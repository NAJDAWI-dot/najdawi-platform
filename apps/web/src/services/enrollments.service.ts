import api from './api';
import type { Enrollment } from '@mos/shared';

export const enrollmentsService = {
  enroll: (courseId: string) =>
    api.post<Enrollment>(`/enrollments/${courseId}`).then((r) => r.data),

  enrollPending: (courseId: string) =>
    api.post<Enrollment>(`/enrollments/${courseId}/pending`).then((r) => r.data),

  drop: (courseId: string) =>
    api.delete(`/enrollments/${courseId}`).then((r) => r.data),

  updateProgress: (courseId: string, progress: number, completedItemId?: string) =>
    api.patch<Enrollment>(`/enrollments/${courseId}/progress`, { progress, completedItemId }).then((r) => r.data),

  getMyEnrollments: () =>
    api.get<Enrollment[]>('/enrollments/my').then((r) => r.data),

  getByCourse: (courseId: string) =>
    api.get<Enrollment[]>(`/enrollments/course/${courseId}`).then((r) => r.data),

  getPending: () =>
    api.get<Enrollment[]>('/enrollments/pending').then((r) => r.data),

  approve: (enrollmentId: string) =>
    api.patch<Enrollment>(`/enrollments/${enrollmentId}/approve`).then((r) => r.data),

  reject: (enrollmentId: string) =>
    api.patch<Enrollment>(`/enrollments/${enrollmentId}/reject`).then((r) => r.data),
};
