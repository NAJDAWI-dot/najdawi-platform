import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { useAuthStore } from '../../stores/authStore';
import { EnrollmentStatus } from '@mos/shared';

export function StudentDashboardPage() {
  const { user } = useAuthStore();
  const { enrollments, isLoading, fetchMyEnrollments } = useEnrollmentStore();

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const active = enrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE);
  const completed = enrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED);
  const avgProgress =
    active.length > 0 ? active.reduce((s, e) => s + e.progress, 0) / active.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="page-subtitle">Track your progress and continue learning</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="stat-card">
          <div className="text-slate-400 text-sm">Active Courses</div>
          <div className="text-4xl font-black text-white">{active.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-slate-400 text-sm">Completed</div>
          <div className="text-4xl font-black text-emerald-400">{completed.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-slate-400 text-sm">Avg Progress</div>
          <div className="text-4xl font-black text-brand-400">{Math.round(avgProgress)}%</div>
        </div>
      </div>

      {/* Course progress cards */}
      <h2 className="text-xl font-semibold text-white mb-6">My Courses</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-800 rounded mb-3 w-3/4" />
              <div className="h-3 bg-slate-800 rounded mb-6 w-1/2" />
              <div className="h-2 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🎓</div>
          <p className="text-lg">No enrollments yet</p>
          <Link to="/courses" className="btn-primary mt-4 inline-block">Browse courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment, idx) => (
            <div 
              key={enrollment.id} 
              className="card flex flex-col gap-4 animate-fade-in-up"
              style={{ animationDelay: `${200 + idx * 100}ms`, opacity: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white line-clamp-2">
                    {enrollment.course?.title || 'Course'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {enrollment.course?.examCode}
                  </p>
                </div>
                <span
                  className={
                    enrollment.status === EnrollmentStatus.COMPLETED
                      ? 'badge-green'
                      : enrollment.status === EnrollmentStatus.DROPPED
                      ? 'badge-red'
                      : 'badge-blue'
                  }
                >
                  {enrollment.status}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Progress</span>
                  <span>{Math.round(enrollment.progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Link
                  to={`/courses/${enrollment.courseId}/learn`}
                  id={`continue-${enrollment.courseId}`}
                  className="btn-secondary text-center text-sm flex-1"
                >
                  {enrollment.status === EnrollmentStatus.COMPLETED ? 'Review' : 'Continue'} →
                </Link>
                {enrollment.status === EnrollmentStatus.COMPLETED && (
                  <Link
                    to={`/certificate/${enrollment.id}`}
                    className="btn-primary bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20 shadow-lg text-center text-sm flex-1"
                  >
                    🏆 Certificate
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
