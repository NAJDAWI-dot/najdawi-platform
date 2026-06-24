import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '@mos/shared';
// Layouts
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
// Auth pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
// Course pages
import { CourseCatalogPage } from '../pages/courses/CourseCatalogPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { CourseLearnPage } from '../pages/courses/CourseLearnPage';
// Student pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { CertificatePage } from '../pages/student/CertificatePage';
// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCourseContentPage } from '../pages/admin/AdminCourseContentPage';
import { AdminSubmissionsPage } from '../pages/admin/AdminSubmissionsPage';
// Quiz pages
import { QuizPlayerPage } from '../pages/quiz/QuizPlayerPage';
import { QuizResultsPage } from '../pages/quiz/QuizResultsPage';
export function AppRouter() {
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: "/auth/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/auth/register", element: _jsx(RegisterPage, {}) })] }), _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/courses", replace: true }) }), _jsx(Route, { path: "/courses", element: _jsx(CourseCatalogPage, {}) }), _jsx(Route, { path: "/courses/:id", element: _jsx(CourseDetailPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/courses/:id/learn", element: _jsx(CourseLearnPage, {}) }), _jsx(Route, { path: "/quiz/:quizId", element: _jsx(QuizPlayerPage, {}) }), _jsx(Route, { path: "/quiz/:quizId/results", element: _jsx(QuizResultsPage, {}) })] }), _jsxs(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [UserRole.STUDENT, UserRole.ADMIN, UserRole.INSTRUCTOR] }), children: [_jsx(Route, { path: "/student/dashboard", element: _jsx(StudentDashboardPage, {}) }), _jsx(Route, { path: "/certificate/:enrollmentId", element: _jsx(CertificatePage, {}) })] }), _jsxs(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [UserRole.ADMIN, UserRole.INSTRUCTOR] }), children: [_jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboardPage, {}) }), _jsx(Route, { path: "/admin/courses", element: _jsx(AdminCoursesPage, {}) }), _jsx(Route, { path: "/admin/courses/:id/content", element: _jsx(AdminCourseContentPage, {}) }), _jsx(Route, { path: "/admin/courses/:id/submissions", element: _jsx(AdminSubmissionsPage, {}) })] }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [UserRole.ADMIN] }), children: _jsx(Route, { path: "/admin/users", element: _jsx(AdminUsersPage, {}) }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/courses", replace: true }) })] }));
}
//# sourceMappingURL=AppRouter.js.map