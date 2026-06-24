import api from './api';
export const reportsService = {
    getDashboardStats: () => api.get('/reports/dashboard').then((r) => r.data),
    getCourseReports: () => api.get('/reports/courses').then((r) => r.data),
};
//# sourceMappingURL=reports.service.js.map