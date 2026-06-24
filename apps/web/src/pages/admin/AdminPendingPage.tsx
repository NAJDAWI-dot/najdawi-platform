import { useEffect, useState } from 'react';
import { AdminNav } from '../../components/layout/AdminNav';
import { enrollmentsService } from '../../services/enrollments.service';
import type { Enrollment } from '@mos/shared';

const WHATSAPP_NUMBER = '962795433394';

export function AdminPendingPage() {
  const [pending, setPending] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await enrollmentsService.getPending();
      setPending(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '-approve');
    try {
      await enrollmentsService.approve(id);
      setPending((p) => p.filter((e) => e.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '-reject');
    try {
      await enrollmentsService.reject(id);
      setPending((p) => p.filter((e) => e.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const openWhatsApp = (enrollment: Enrollment) => {
    const user = (enrollment as any).user;
    const course = (enrollment as any).course;
    const msg = encodeURIComponent(
      `مرحباً ${user?.firstName || ''}، تم تأكيد دفعتك وتفعيل اشتراكك في كورس "${course?.title || ''}" على منصة نجداوي. يمكنك الدخول الآن. 🎉`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <AdminNav />
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Pending Approvals</h1>
          <p className="page-subtitle">CliQ payment requests awaiting verification</p>
        </div>
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 px-3 py-1 text-sm font-semibold text-yellow-300">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              {pending.length} pending
            </span>
          )}
          <button onClick={load} className="btn-secondary text-sm">
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      ) : pending.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <div className="text-5xl">✅</div>
          <p className="text-slate-300 font-semibold">No pending payments</p>
          <p className="text-slate-500 text-sm">All enrollment requests have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((enrollment) => {
            const user = (enrollment as any).user;
            const course = (enrollment as any).course;
            const approveLoading = actionLoading === enrollment.id + '-approve';
            const rejectLoading = actionLoading === enrollment.id + '-reject';
            const whatsappMsg = encodeURIComponent(
              `السلام عليكم، هل أرسلت دفعة لكورس "${course?.title || ''}"؟`
            );

            return (
              <div
                key={enrollment.id}
                className="card flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* User info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">
                    {user?.firstName?.[0] ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{course?.title}</p>
                  <p className="text-xs text-slate-500">
                    ${course?.price} · Requested {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-green-700 bg-green-900/30 px-3 py-1.5 text-xs text-green-300 hover:bg-green-900/60 transition-colors"
                  >
                    📲 Ask
                  </a>
                  <button
                    id={`reject-${enrollment.id}`}
                    onClick={() => handleReject(enrollment.id)}
                    disabled={!!actionLoading}
                    className="rounded-lg border border-red-800 bg-red-900/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/60 transition-colors disabled:opacity-50"
                  >
                    {rejectLoading ? '...' : '✕ Reject'}
                  </button>
                  <button
                    id={`approve-${enrollment.id}`}
                    onClick={() => handleApprove(enrollment.id)}
                    disabled={!!actionLoading}
                    className="btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
                  >
                    {approveLoading ? '...' : '✓ Approve'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
