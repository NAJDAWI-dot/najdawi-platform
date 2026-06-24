import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { EnrollmentStatus } from '@mos/shared';
export function CertificatePage() {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { enrollments, fetchMyEnrollments } = useEnrollmentStore();
    const certRef = useRef(null);
    useEffect(() => {
        fetchMyEnrollments();
    }, []);
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
        return _jsx("div", { className: "flex h-screen items-center justify-center text-slate-400", children: "Loading certificate..." });
    }
    if (enrollment.status !== EnrollmentStatus.COMPLETED) {
        return (_jsxs("div", { className: "flex flex-col h-screen items-center justify-center space-y-4", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Course Not Completed" }), _jsx("p", { className: "text-slate-400", children: "You must reach 100% completion to view this certificate." }), _jsx("button", { onClick: () => navigate(-1), className: "btn-secondary", children: "Go Back" })] }));
    }
    const printCertificate = () => {
        window.print();
    };
    const completedDate = new Date(enrollment.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 print:bg-white print:min-h-0 print:block flex flex-col items-center py-12 print:py-0 px-4 print:px-0", children: [_jsxs("div", { className: "mb-8 flex gap-4 print:hidden", children: [_jsx("button", { onClick: () => navigate(-1), className: "btn-secondary", children: "\u2190 Back to Dashboard" }), _jsx("button", { onClick: printCertificate, className: "btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 shadow-lg", children: "\uD83D\uDDA8\uFE0F Print / Save as PDF" })] }), _jsx("style", { children: `
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          nav, footer { display: none !important; }
        }
      ` }), _jsxs("div", { ref: certRef, className: "relative w-full max-w-5xl aspect-[1.414/1] bg-white text-slate-900 shadow-2xl print:shadow-none print:w-screen print:h-[100vh] print:max-w-none rounded-lg print:rounded-none overflow-hidden flex flex-col justify-center items-center text-center p-16", style: {
                    backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '12px solid #0f172a'
                }, children: [_jsx("div", { className: "absolute top-0 left-0 w-32 h-32 border-b-4 border-r-4 border-brand-500 rounded-br-3xl opacity-20" }), _jsx("div", { className: "absolute top-0 right-0 w-32 h-32 border-b-4 border-l-4 border-brand-500 rounded-bl-3xl opacity-20" }), _jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 border-t-4 border-r-4 border-brand-500 rounded-tr-3xl opacity-20" }), _jsx("div", { className: "absolute bottom-0 right-0 w-32 h-32 border-t-4 border-l-4 border-brand-500 rounded-tl-3xl opacity-20" }), _jsxs("div", { className: "absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50", children: [_jsx("div", { className: "h-6 w-6 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xs", children: "N" }), _jsx("span", { className: "font-bold tracking-widest uppercase text-slate-800 text-sm", children: "Najdawi Platform" })] }), _jsx("h3", { className: "text-brand-600 font-bold tracking-[0.2em] uppercase text-xl mb-4", children: "Certificate of Completion" }), _jsx("h1", { className: "text-5xl font-black font-serif text-slate-900 mb-8 tracking-tight", children: "This certifies that" }), _jsx("div", { className: "w-3/4 border-b-2 border-slate-300 pb-2 mb-8", children: _jsxs("h2", { className: "text-6xl font-black text-brand-700 italic font-serif", children: [user?.firstName, " ", user?.lastName] }) }), _jsx("p", { className: "text-xl text-slate-600 mb-4 max-w-2xl", children: "has successfully completed all requirements, modules, and assessments for the course:" }), _jsx("h2", { className: "text-4xl font-bold text-slate-800 mb-12", children: enrollment.course?.title }), _jsxs("div", { className: "w-full max-w-3xl flex justify-between items-end mt-12 px-12", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "text-lg font-bold text-slate-800 mb-2 border-b border-slate-400 pb-1 w-48 text-center", children: completedDate }), _jsx("div", { className: "text-sm text-slate-500 uppercase tracking-wider font-semibold", children: "Date Completed" })] }), _jsx("div", { className: "relative flex items-center justify-center", children: _jsx("div", { className: "w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-xl flex items-center justify-center border-4 border-white transform rotate-3", children: _jsxs("div", { className: "w-28 h-28 rounded-full border-2 border-dashed border-yellow-200 flex flex-col items-center justify-center text-white text-center p-2", children: [_jsx("span", { className: "text-3xl mb-1", children: "\uD83C\uDF1F" }), _jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest leading-tight", children: ["Official", _jsx("br", {}), "Record"] })] }) }) }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "text-lg font-bold text-slate-800 mb-2 border-b border-slate-400 pb-1 w-48 text-center", style: { fontFamily: 'cursive' }, children: "Najdawi System" }), _jsx("div", { className: "text-sm text-slate-500 uppercase tracking-wider font-semibold", children: "Authorized Signature" })] })] })] })] }));
}
//# sourceMappingURL=CertificatePage.js.map