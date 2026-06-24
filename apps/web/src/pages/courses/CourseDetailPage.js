import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { useAuthStore } from '../../stores/authStore';
import { ContentType } from '@mos/shared';
const contentTypeIcon = {
    [ContentType.VIDEO]: '▶️',
    [ContentType.PDF]: '📄',
    [ContentType.LINK]: '🔗',
    [ContentType.LAB]: '🧪',
};
export function CourseDetailPage() {
    const { id } = useParams();
    const { selectedCourse, isLoading, fetchCourse } = useCourseStore();
    const { isEnrolled, fetchMyEnrollments } = useEnrollmentStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [enrolling, setEnrolling] = useState(false);
    useEffect(() => {
        if (id) {
            fetchCourse(id);
            if (user)
                fetchMyEnrollments();
        }
    }, [id, user]);
    const enrolled = id ? isEnrolled(id) : false;
    const handleEnroll = async () => {
        if (!user) {
            navigate('/auth/login');
            return;
        }
        if (!id)
            return;
        setEnrolling(true);
        try {
            const { paymentsService } = await import('../../services/payments.service');
            const { url } = await paymentsService.createCheckout(id);
            window.location.href = url;
        }
        catch (err) {
            console.error('Checkout error:', err);
            setEnrolling(false);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "mx-auto max-w-5xl px-4 py-12", children: _jsxs("div", { className: "animate-pulse space-y-6", children: [_jsx("div", { className: "h-8 bg-slate-800 rounded w-1/2" }), _jsx("div", { className: "h-4 bg-slate-800 rounded w-full" }), _jsx("div", { className: "h-4 bg-slate-800 rounded w-3/4" })] }) }));
    }
    if (!selectedCourse) {
        return (_jsxs("div", { className: "text-center py-24 text-slate-400", children: [_jsx("p", { children: "Course not found" }), _jsx(Link, { to: "/courses", className: "btn-primary mt-4 inline-block", children: "Browse courses" })] }));
    }
    const c = selectedCourse;
    return (_jsx("div", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs("nav", { className: "text-sm text-slate-500", children: [_jsx(Link, { to: "/courses", className: "hover:text-slate-300", children: "Courses" }), _jsx("span", { className: "mx-2", children: "/" }), _jsx("span", { className: "text-slate-300", children: c.title })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("span", { className: "badge-blue", children: c.module }), _jsx("span", { className: "badge bg-slate-800 border border-slate-700 text-slate-400", children: c.level }), _jsx("span", { className: "badge bg-slate-800 border border-slate-700 text-slate-400", children: c.examCode })] }), _jsx("h1", { className: "text-3xl font-bold text-white mb-4", children: c.title }), _jsx("p", { className: "text-slate-300 leading-relaxed", children: c.description })] }), c.instructor && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold", children: c.instructor.firstName[0] }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-slate-200", children: [c.instructor.firstName, " ", c.instructor.lastName] }), _jsx("div", { className: "text-xs text-slate-500", children: "Instructor" })] })] })), c.contentItems && c.contentItems.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-white mb-4", children: "Course Content" }), _jsx("div", { className: "space-y-2", children: [...c.contentItems]
                                        .sort((a, b) => a.order - b.order)
                                        .map((item) => (_jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3", children: [_jsx("span", { className: "text-lg", children: contentTypeIcon[item.type] || '📁' }), _jsx("span", { className: "flex-1 text-sm text-slate-300", children: item.title }), item.duration && (_jsxs("span", { className: "text-xs text-slate-500", children: [item.duration, "m"] })), _jsx("span", { className: "badge bg-slate-800 border border-slate-700 text-slate-500 text-xs", children: item.type })] }, item.id))) })] }))] }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "card sticky top-24 space-y-6", children: [_jsx("div", { className: "h-48 rounded-xl bg-gradient-to-br from-brand-900/60 to-slate-800 flex items-center justify-center", children: _jsx("span", { className: "text-6xl opacity-60", children: c.module === 'excel' ? '📊' : c.module === 'word' ? '📝' : '💼' }) }), _jsx("div", { className: "text-3xl font-black text-white", children: c.price === 0 ? 'Free' : `$${c.price}` }), enrolled ? (_jsx(Link, { to: `/courses/${c.id}/learn`, id: "continue-learning-btn", className: "btn-primary w-full text-center py-3 block", children: "Continue Learning \u2192" })) : (_jsx("button", { id: "enroll-btn", onClick: handleEnroll, disabled: enrolling, className: "btn-primary w-full py-3", children: enrolling ? 'Enrolling...' : 'Enroll Now' })), _jsxs("div", { className: "space-y-3 text-sm text-slate-400", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Level" }), _jsx("span", { className: "text-slate-200 capitalize", children: c.level })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Exam Code" }), _jsx("span", { className: "text-slate-200", children: c.examCode })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Lessons" }), _jsx("span", { className: "text-slate-200", children: c.contentItems?.length ?? 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Quizzes" }), _jsx("span", { className: "text-slate-200", children: c.quizzes?.length ?? 0 })] })] })] }) })] }) }));
}
//# sourceMappingURL=CourseDetailPage.js.map