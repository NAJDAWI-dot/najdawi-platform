import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { useAuthStore } from '../../stores/authStore';
import { ContentType } from '@mos/shared';

const contentTypeIcon: Record<string, string> = {
  [ContentType.VIDEO]: '▶️',
  [ContentType.PDF]: '📄',
  [ContentType.LINK]: '🔗',
  [ContentType.LAB]: '🧪',
};

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedCourse, isLoading, fetchCourse } = useCourseStore();
  const { isEnrolled, fetchMyEnrollments } = useEnrollmentStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
      if (user) fetchMyEnrollments();
    }
  }, [id, user]);

  const enrolled = id ? isEnrolled(id) : false;

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!id) return;
    setEnrolling(true);
    try {
      const { paymentsService } = await import('../../services/payments.service');
      const { url } = await paymentsService.createCheckout(id);
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-800 rounded w-1/2" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-24 text-slate-400">
        <p>Course not found</p>
        <Link to="/courses" className="btn-primary mt-4 inline-block">Browse courses</Link>
      </div>
    );
  }

  const c = selectedCourse;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500">
            <Link to="/courses" className="hover:text-slate-300">Courses</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300">{c.title}</span>
          </nav>

          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-blue">{c.module}</span>
              <span className="badge bg-slate-800 border border-slate-700 text-slate-400">{c.level}</span>
              <span className="badge bg-slate-800 border border-slate-700 text-slate-400">{c.examCode}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{c.title}</h1>
            <p className="text-slate-300 leading-relaxed">{c.description}</p>
          </div>

          {/* Instructor */}
          {c.instructor && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">
                {c.instructor.firstName[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {c.instructor.firstName} {c.instructor.lastName}
                </div>
                <div className="text-xs text-slate-500">Instructor</div>
              </div>
            </div>
          )}

          {/* Content list */}
          {c.contentItems && c.contentItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Course Content</h2>
              <div className="space-y-2">
                {[...c.contentItems]
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
                    >
                      <span className="text-lg">{contentTypeIcon[item.type] || '📁'}</span>
                      <span className="flex-1 text-sm text-slate-300">{item.title}</span>
                      {item.duration && (
                        <span className="text-xs text-slate-500">{item.duration}m</span>
                      )}
                      <span className="badge bg-slate-800 border border-slate-700 text-slate-500 text-xs">
                        {item.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar CTA */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-6">
            <div className="h-48 rounded-xl bg-gradient-to-br from-brand-900/60 to-slate-800 flex items-center justify-center">
              <span className="text-6xl opacity-60">
                {c.module === 'excel' ? '📊' : c.module === 'word' ? '📝' : '💼'}
              </span>
            </div>

            <div className="text-3xl font-black text-white">
              {c.price === 0 ? 'Free' : `$${c.price}`}
            </div>

            {enrolled ? (
              <Link
                to={`/courses/${c.id}/learn`}
                id="continue-learning-btn"
                className="btn-primary w-full text-center py-3 block"
              >
                Continue Learning →
              </Link>
            ) : (
              <button
                id="enroll-btn"
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary w-full py-3"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}

            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Level</span>
                <span className="text-slate-200 capitalize">{c.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Exam Code</span>
                <span className="text-slate-200">{c.examCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Lessons</span>
                <span className="text-slate-200">{c.contentItems?.length ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Quizzes</span>
                <span className="text-slate-200">{c.quizzes?.length ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
