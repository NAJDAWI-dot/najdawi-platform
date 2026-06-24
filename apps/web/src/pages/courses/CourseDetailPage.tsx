import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { useAuthStore } from '../../stores/authStore';
import { ContentType } from '@mos/shared';

const CLIQ_ALIAS = 'NAJDAWI00';
const WHATSAPP_NUMBER = '962795433394';

const contentTypeIcon: Record<string, string> = {
  [ContentType.VIDEO]: '▶️',
  [ContentType.PDF]: '📄',
  [ContentType.LINK]: '🔗',
  [ContentType.LAB]: '🧪',
};

function CliqModal({
  course,
  onClose,
  onConfirm,
  loading,
}: {
  course: { title: string; price: number };
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyAlias = () => {
    navigator.clipboard.writeText(CLIQ_ALIAS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMsg = encodeURIComponent(
    `مرحباً، لقد أرسلت الدفع لكورس "${course.title}" بمبلغ $${course.price} عبر CliQ إلى ${CLIQ_ALIAS}. أرجو مراجعة الحوالة وتفعيل الاشتراك.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="card max-w-md w-full mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-900/40 border border-green-700 flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CliQ Payment</h2>
              <p className="text-xs text-slate-400">Jordan Instant Transfer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">✕</button>
        </div>

        {/* Amount */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Amount to transfer</p>
          <p className="text-4xl font-black text-white">${course.price}</p>
          <p className="text-xs text-slate-500 mt-1">{course.title}</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-300">How to pay:</p>

          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <span className="h-6 w-6 flex-shrink-0 rounded-full bg-brand-700 text-xs font-bold text-white flex items-center justify-center">1</span>
            <div className="flex-1">
              <p className="text-sm text-slate-300">Open your bank app and send via <strong className="text-white">CliQ</strong> to:</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 text-brand-300 font-mono font-bold text-lg tracking-widest">
                  {CLIQ_ALIAS}
                </code>
                <button
                  onClick={copyAlias}
                  className="px-3 py-2 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <span className="h-6 w-6 flex-shrink-0 rounded-full bg-brand-700 text-xs font-bold text-white flex items-center justify-center">2</span>
            <div>
              <p className="text-sm text-slate-300">Take a screenshot of the transfer confirmation</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <span className="h-6 w-6 flex-shrink-0 rounded-full bg-brand-700 text-xs font-bold text-white flex items-center justify-center">3</span>
            <div className="flex-1">
              <p className="text-sm text-slate-300 mb-2">Send the screenshot to our WhatsApp:</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-green-700/40 border border-green-700 px-3 py-2 text-green-300 hover:bg-green-700/60 transition-colors text-sm font-medium"
              >
                <span>📲</span>
                Open WhatsApp
              </a>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <span className="h-6 w-6 flex-shrink-0 rounded-full bg-brand-700 text-xs font-bold text-white flex items-center justify-center">4</span>
            <div>
              <p className="text-sm text-slate-300">Click below — your enrollment will be activated within <strong className="text-white">24 hours</strong> after we verify your payment.</p>
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <button
          id="confirm-cliq-payment-btn"
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "✅ I've sent the payment"
          )}
        </button>

        <p className="text-xs text-center text-slate-500">
          Your course will unlock once we confirm your CliQ transfer.
        </p>
      </div>
    </div>
  );
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedCourse, isLoading, fetchCourse } = useCourseStore();
  const { isEnrolled, isPending, enrollPending, fetchMyEnrollments } = useEnrollmentStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showCliqModal, setShowCliqModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
      if (user) fetchMyEnrollments();
    }
  }, [id, user]);

  const enrolled = id ? isEnrolled(id) : false;
  const pending = id ? isPending(id) : false;

  const handleEnrollClick = () => {
    if (!user) {
      alert(`Diagnostic: You are NOT logged in!\nAccessToken exists: ${!!localStorage.getItem('accessToken')}\nMosAuth exists: ${!!localStorage.getItem('mos-auth')}`);
      return;
    }
    if (!id) return;
    if (selectedCourse?.price === 0) {
      // Free course — enroll directly
      import('../../services/enrollments.service').then(({ enrollmentsService }) => {
        enrollmentsService.enroll(id).then(() => {
          fetchMyEnrollments();
        });
      });
      return;
    }
    setShowCliqModal(true);
  };

  const handleCliqConfirm = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      await enrollPending(id);
      setSubmitting(false);
      setShowCliqModal(false);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Pending enrollment error:', err);
      setSubmitting(false);
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
      {showCliqModal && (
        <CliqModal
          course={c}
          onClose={() => setShowCliqModal(false)}
          onConfirm={handleCliqConfirm}
          loading={submitting}
        />
      )}

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
            ) : pending ? (
              <div className="rounded-xl border border-yellow-700 bg-yellow-900/20 px-4 py-3 text-center space-y-1">
                <p className="text-yellow-300 font-semibold text-sm">⏳ Payment Under Review</p>
                <p className="text-yellow-400/70 text-xs">We'll activate your access within 24h after confirming your CliQ transfer.</p>
              </div>
            ) : submitted ? (
              <div className="rounded-xl border border-green-700 bg-green-900/20 px-4 py-3 text-center space-y-1">
                <p className="text-green-300 font-semibold text-sm">✅ Submitted!</p>
                <p className="text-green-400/70 text-xs">Don't forget to send the screenshot to WhatsApp. We'll activate your access soon.</p>
              </div>
            ) : (
              <button
                id="enroll-btn"
                onClick={handleEnrollClick}
                className="btn-primary w-full py-3"
              >
                {c.price === 0 ? 'Enroll Free' : 'Pay via CliQ'}
              </button>
            )}

            {!enrolled && !pending && !submitted && c.price > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                <span>💳</span>
                <span>Jordan CliQ instant transfer</span>
              </div>
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
