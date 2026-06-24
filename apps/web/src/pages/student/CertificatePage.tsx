import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { EnrollmentStatus } from '@mos/shared';

export function CertificatePage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { enrollments, fetchMyEnrollments } = useEnrollmentStore();
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const enrollment = enrollments.find(e => e.id === enrollmentId);

  if (!enrollment) {
    return <div className="flex h-screen items-center justify-center text-slate-400">Loading certificate...</div>;
  }

  if (enrollment.status !== EnrollmentStatus.COMPLETED) {
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Course Not Completed</h1>
        <p className="text-slate-400">You must reach 100% completion to view this certificate.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  const printCertificate = () => {
    window.print();
  };

  const completedDate = new Date(enrollment.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-950 print:bg-white print:min-h-0 print:block flex flex-col items-center py-12 print:py-0 px-4 print:px-0">
      <div className="mb-8 flex gap-4 print:hidden">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          ← Back to Dashboard
        </button>
        <button onClick={printCertificate} className="btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 shadow-lg">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          nav, footer { display: none !important; }
        }
      `}</style>

      {/* The Certificate itself */}
      <div 
        ref={certRef}
        className="relative w-full max-w-5xl aspect-[1.414/1] bg-white text-slate-900 shadow-2xl print:shadow-none print:w-screen print:h-[100vh] print:max-w-none rounded-lg print:rounded-none overflow-hidden flex flex-col justify-center items-center text-center p-16"
        style={{
          backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '12px solid #0f172a'
        }}
      >
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-32 h-32 border-b-4 border-r-4 border-brand-500 rounded-br-3xl opacity-20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-b-4 border-l-4 border-brand-500 rounded-bl-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-t-4 border-r-4 border-brand-500 rounded-tr-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-t-4 border-l-4 border-brand-500 rounded-tl-3xl opacity-20" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
          <div className="h-6 w-6 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xs">N</div>
          <span className="font-bold tracking-widest uppercase text-slate-800 text-sm">Najdawi Platform</span>
        </div>

        <h3 className="text-brand-600 font-bold tracking-[0.2em] uppercase text-xl mb-4">Certificate of Completion</h3>
        <h1 className="text-5xl font-black font-serif text-slate-900 mb-8 tracking-tight">This certifies that</h1>
        
        <div className="w-3/4 border-b-2 border-slate-300 pb-2 mb-8">
          <h2 className="text-6xl font-black text-brand-700 italic font-serif">
            {user?.firstName} {user?.lastName}
          </h2>
        </div>

        <p className="text-xl text-slate-600 mb-4 max-w-2xl">
          has successfully completed all requirements, modules, and assessments for the course:
        </p>

        <h2 className="text-4xl font-bold text-slate-800 mb-12">
          {enrollment.course?.title}
        </h2>

        <div className="w-full max-w-3xl flex justify-between items-end mt-12 px-12">
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-400 pb-1 w-48 text-center">
              {completedDate}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Date Completed</div>
          </div>

          {/* Gold seal */}
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-xl flex items-center justify-center border-4 border-white transform rotate-3">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-yellow-200 flex flex-col items-center justify-center text-white text-center p-2">
                <span className="text-3xl mb-1">🌟</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Official<br/>Record</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-400 pb-1 w-48 text-center" style={{ fontFamily: 'cursive' }}>
              Najdawi System
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Authorized Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}
