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
import { AdminPendingPage } from '../pages/admin/AdminPendingPage';

// Quiz pages
import { QuizPlayerPage } from '../pages/quiz/QuizPlayerPage';
import { QuizResultsPage } from '../pages/quiz/QuizResultsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Route>

      {/* App layout routes */}
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Protected — any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses/:id/learn" element={<CourseLearnPage />} />
          <Route path="/quiz/:quizId" element={<QuizPlayerPage />} />
          <Route path="/quiz/:quizId/results" element={<QuizResultsPage />} />
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.ADMIN, UserRole.INSTRUCTOR]} />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/certificate/:enrollmentId" element={<CertificatePage />} />
        </Route>

        {/* Instructor & Admin */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.INSTRUCTOR]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/courses/:id/content" element={<AdminCourseContentPage />} />
          <Route path="/admin/courses/:id/submissions" element={<AdminSubmissionsPage />} />
        </Route>

        {/* Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/pending" element={<AdminPendingPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
}
