import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminNav } from '../../components/layout/AdminNav';
import api from '../../services/api';
export function AdminSubmissionsPage() {
    const { id: courseId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [gradingModalOpen, setGradingModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [saving, setSaving] = useState(false);
    const loadSubmissions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/submissions/course/${courseId}`);
            setSubmissions(res.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadSubmissions();
    }, [courseId]);
    const openGradingModal = (sub) => {
        setSelectedSubmission(sub);
        setScore(sub.score || '');
        setFeedback(sub.feedback || '');
        setGradingModalOpen(true);
    };
    const handleGrade = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/submissions/${selectedSubmission.id}/grade`, {
                score: Number(score),
                feedback,
            });
            setGradingModalOpen(false);
            loadSubmissions();
        }
        catch (err) {
            alert('Failed to save grade');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx(AdminNav, {}), _jsx("div", { className: "page-header flex items-center justify-between", children: _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: _jsx(Link, { to: "/admin/courses", className: "text-sm text-brand-400 hover:text-brand-300", children: "\u2190 Back to Courses" }) }), _jsx("h1", { className: "page-title", children: "Grade Submissions" }), _jsx("p", { className: "page-subtitle", children: "Review student labs and assign grades" })] }) }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Student" }), _jsx("th", { children: "Assignment" }), _jsx("th", { children: "Date Submitted" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Score" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-8", children: "Loading..." }) })) : submissions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center text-slate-500 py-8", children: "No submissions yet." }) })) : (submissions.map((sub) => (_jsxs("tr", { children: [_jsxs("td", { className: "font-medium text-white", children: [sub.user.name, " ", _jsx("br", {}), _jsx("span", { className: "text-xs text-slate-500 font-normal", children: sub.user.email })] }), _jsx("td", { children: sub.contentItem.title }), _jsx("td", { className: "text-slate-400", children: new Date(sub.createdAt).toLocaleDateString() }), _jsx("td", { children: _jsx("span", { className: `px-2 py-1 text-xs font-bold uppercase rounded-full ${sub.status === 'graded' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`, children: sub.status }) }), _jsx("td", { className: "text-white font-bold", children: sub.score !== null ? `${sub.score}/100` : '-' }), _jsx("td", { children: _jsxs("div", { className: "flex gap-3", children: [_jsx("a", { href: sub.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "text-brand-400 hover:text-brand-300", children: "Download" }), _jsx("button", { onClick: () => openGradingModal(sub), className: "text-white hover:text-brand-400", children: "Grade" })] }) })] }, sub.id)))) })] }) }), gradingModalOpen && selectedSubmission && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "card w-full max-w-md mx-4 relative", children: [_jsx("button", { onClick: () => setGradingModalOpen(false), className: "absolute top-4 right-4 text-slate-400", children: "\u2715" }), _jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Grade Assignment" }), _jsxs("p", { className: "text-sm text-slate-400 mb-6", children: [selectedSubmission.user.name, " - ", selectedSubmission.contentItem.title] }), _jsxs("form", { onSubmit: handleGrade, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Score (0-100)" }), _jsx("input", { required: true, type: "number", min: "0", max: "100", className: "input", value: score, onChange: e => setScore(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Feedback (Optional)" }), _jsx("textarea", { className: "input min-h-[100px]", placeholder: "Great job on the pivot tables...", value: feedback, onChange: e => setFeedback(e.target.value) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: () => setGradingModalOpen(false), className: "btn-secondary", disabled: saving, children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: saving, children: "Submit Grade" })] })] })] }) }))] }));
}
//# sourceMappingURL=AdminSubmissionsPage.js.map