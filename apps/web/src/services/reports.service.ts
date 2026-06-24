import api from './api';
import type { AdminDashboardStats, CourseReport } from '@mos/shared';

export const reportsService = {
  getDashboardStats: () =>
    api.get<AdminDashboardStats>('/reports/dashboard').then((r) => r.data),

  getCourseReports: () =>
    api.get<CourseReport[]>('/reports/courses').then((r) => r.data),
};
