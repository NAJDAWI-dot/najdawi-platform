import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { ContentType } from '@mos/shared';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../services/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { uploadsService } from '../../services/uploads.service';
// Initialize PDF.js worker
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
function AssignmentView({ contentItem, onComplete }) {
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const fetchSubmission = async () => {
        try {
            const res = await api.get(`/submissions/me/${contentItem.id}`);
            setSubmission(res.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchSubmission();
    }, [contentItem.id]);
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        try {
            const url = await uploadsService.uploadDocument(file);
            await api.post('/submissions', { contentItemId: contentItem.id, fileUrl: url });
            await fetchSubmission();
            alert('Assignment submitted successfully!');
            if (onComplete)
                onComplete();
        }
        catch (err) {
            alert('Failed to submit assignment');
        }
        finally {
            setUploading(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "text-slate-400", children: "Loading assignment data..." });
    return (_jsx("div", { className: "flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full flex flex-col shadow-2xl", children: [_jsxs("div", { className: "flex items-center gap-4 mb-8 pb-8 border-b border-slate-800", children: [_jsx("div", { className: "w-16 h-16 bg-brand-900/50 rounded-xl flex items-center justify-center border border-brand-800", children: _jsx("span", { className: "text-3xl", children: "\uD83D\uDCDD" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-black text-white", children: contentItem.title }), _jsx("p", { className: "text-brand-400 font-medium", children: "Lab Assignment" })] })] }), _jsxs("div", { className: "mb-10", children: [_jsx("h3", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-3", children: "Instructions" }), _jsx("p", { className: "text-slate-300 leading-relaxed mb-6", children: contentItem.description || 'Download the attached file, complete the required tasks, and upload your final document.' }), _jsxs("a", { href: contentItem.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700", children: [_jsx("span", { children: "\u2B07\uFE0F" }), " Download Assignment File"] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-3", children: "Your Submission" }), submission ? (_jsxs("div", { className: `p-6 rounded-xl border ${submission.status === 'graded' ? 'bg-green-900/20 border-green-800' : 'bg-blue-900/20 border-blue-800'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("span", { className: "font-semibold text-white", children: "Status:" }), _jsx("span", { className: `px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${submission.status === 'graded' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`, children: submission.status })] }), _jsx("a", { href: submission.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-slate-400 hover:text-white underline", children: "View submitted file" })] }), submission.status === 'graded' && (_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-black text-white", children: [submission.score, "/100"] }), _jsx("div", { className: "text-xs text-slate-500 uppercase font-bold tracking-wider", children: "Score" })] }))] }), submission.feedback && (_jsxs("div", { className: "mt-4 pt-4 border-t border-slate-800/50", children: [_jsx("p", { className: "text-sm font-bold text-slate-400 mb-1", children: "Instructor Feedback:" }), _jsxs("p", { className: "text-slate-300 italic", children: ["\"", submission.feedback, "\""] })] })), _jsxs("div", { className: "mt-6", children: [_jsx("input", { type: "file", className: "hidden", ref: fileInputRef, onChange: handleFileUpload }), _jsx("button", { onClick: () => fileInputRef.current?.click(), disabled: uploading, className: "text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50", children: uploading ? 'Uploading...' : 'Upload New Revision' })] })] })) : (_jsxs("div", { className: "p-8 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-center bg-slate-800/50", children: [_jsx("span", { className: "text-4xl mb-4", children: "\uD83D\uDCE4" }), _jsx("p", { className: "text-slate-300 font-medium mb-1", children: "Ready to submit?" }), _jsx("p", { className: "text-slate-500 text-sm mb-6", children: "Upload your completed Word, Excel, or PowerPoint file here." }), _jsx("input", { type: "file", className: "hidden", ref: fileInputRef, onChange: handleFileUpload }), _jsx("button", { onClick: () => fileInputRef.current?.click(), disabled: uploading, className: "px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50", children: uploading ? 'Uploading...' : 'Select File to Upload' })] }))] })] }) }));
}
import { DiscussionsView } from './DiscussionsView';
export function CourseLearnPage() {
    const { id } = useParams();
    const { selectedCourse, fetchCourse, isLoading } = useCourseStore();
    const { enrollments } = useEnrollmentStore();
    const [selectedContent, setSelectedContent] = useState(null);
    const [numPages, setNumPages] = useState();
    const [showDiscussions, setShowDiscussions] = useState(false);
    useEffect(() => {
        if (id)
            fetchCourse(id);
    }, [id]);
    useEffect(() => {
        if (selectedCourse?.contentItems?.length) {
            setSelectedContent(selectedCourse.contentItems[0]);
        }
    }, [selectedCourse]);
    if (isLoading) {
        return (_jsx("div", { className: "flex h-[calc(100vh-4rem)] items-center justify-center", children: _jsx("div", { className: "animate-spin h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent" }) }));
    }
    const course = selectedCourse;
    if (!course)
        return null;
    const currentEnrollment = enrollments.find(e => e.courseId === course.id);
    const sortedContent = [...(course.contentItems || [])].sort((a, b) => a.order - b.order);
    const quizzes = course.quizzes || [];
    const totalItems = sortedContent.length + quizzes.length;
    const markCompleted = async (itemId) => {
        const completedItems = new Set(currentEnrollment?.completedItemIds || []);
        if (completedItems.has(itemId))
            return;
        completedItems.add(itemId);
        const newProgress = totalItems > 0 ? (completedItems.size / totalItems) * 100 : 100;
        try {
            await useEnrollmentStore.getState().updateProgress(course.id, newProgress, itemId);
        }
        catch (e) {
            console.error('Failed to update progress');
        }
    };
    const isCompleted = (itemId) => {
        return currentEnrollment?.completedItemIds?.includes(itemId);
    };
    return (_jsxs("div", { className: "flex h-[calc(100vh-4rem)]", children: [_jsxs("aside", { className: "w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-y-auto z-10 animate-fade-in", children: [_jsxs("div", { className: "p-4 border-b border-slate-800", children: [_jsx(Link, { to: `/courses/${id}`, className: "text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1", children: "\u2190 Back to course" }), _jsx("h2", { className: "mt-2 font-semibold text-white text-sm leading-tight", children: course.title })] }), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2", children: "Content" }), _jsx("div", { className: "space-y-1", children: sortedContent.map((item, idx) => (_jsxs("button", { id: `content-item-${idx}`, onClick: () => {
                                        setSelectedContent(item);
                                        setNumPages(undefined);
                                        setShowDiscussions(false);
                                    }, className: `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${selectedContent?.id === item.id && !showDiscussions
                                        ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`, children: [_jsx("span", { className: "text-base", children: item.type === ContentType.VIDEO ? '▶️' :
                                                item.type === ContentType.PDF ? '📄' :
                                                    item.type === ContentType.LINK ? '🔗' : '🧪' }), _jsx("span", { className: "line-clamp-2", children: item.title })] }, item.id))) }), quizzes.length > 0 && (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2", children: "Quizzes" }), _jsx("div", { className: "space-y-1", children: quizzes.map((quiz) => (_jsxs(Link, { id: `quiz-link-${quiz.id}`, to: `/quiz/${quiz.id}`, className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors", children: [_jsx("span", { children: "\uD83D\uDCDD" }), _jsx("span", { children: quiz.title })] }, quiz.id))) })] })), _jsxs("div", { className: "mt-8 px-2 space-y-3", children: [_jsx("button", { onClick: () => setShowDiscussions(true), className: `w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${showDiscussions
                                            ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-transparent'}`, children: "\uD83D\uDCAC Course Q&A" }), _jsx("button", { onClick: async () => {
                                            try {
                                                const { useEnrollmentStore } = await import('../../stores/enrollmentStore');
                                                await useEnrollmentStore.getState().updateProgress(course.id, 100);
                                                alert('Course marked as complete! Great job!');
                                            }
                                            catch (e) {
                                                alert('Failed to update progress');
                                            }
                                        }, className: "w-full btn-primary py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20", children: "\u2705 Mark Course Complete" })] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto bg-slate-950", children: showDiscussions ? (_jsx(DiscussionsView, { courseId: course.id })) : selectedContent ? (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "border-b border-slate-800 px-8 py-4", children: [_jsx("h1", { className: "text-lg font-semibold text-white", children: selectedContent.title }), _jsx("p", { className: "text-xs text-slate-500 capitalize mt-0.5", children: selectedContent.type })] }), _jsx("div", { className: "flex-1 p-8 pointer-events-auto relative animate-scale-in", children: selectedContent.type === ContentType.PDF ? (_jsx("div", { className: "relative w-full h-full rounded-xl border border-slate-800 overflow-y-auto bg-slate-900 flex flex-col items-center p-8", onContextMenu: e => e.preventDefault(), children: _jsx(Document, { file: selectedContent.url, onLoadSuccess: ({ numPages }) => setNumPages(numPages), loading: _jsx("div", { className: "text-slate-400", children: "Loading document securely..." }), error: _jsx("div", { className: "text-red-400", children: "Failed to load document securely." }), className: "flex flex-col items-center gap-6", children: Array.from(new Array(numPages || 0), (_, index) => (_jsx("div", { className: "shadow-2xl rounded overflow-hidden", children: _jsx(Page, { pageNumber: index + 1, renderTextLayer: false, renderAnnotationLayer: false, width: 800 }) }, `page_${index + 1}`))) }) })) : selectedContent.type === ContentType.VIDEO ? (_jsx("div", { className: "aspect-video w-full max-w-4xl mx-auto", children: _jsx("iframe", { id: "video-viewer", src: selectedContent.url.includes('youtube.com/watch?v=')
                                        ? selectedContent.url.replace('watch?v=', 'embed/').split('&')[0]
                                        : selectedContent.url.includes('youtu.be/')
                                            ? selectedContent.url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]
                                            : selectedContent.url, className: "w-full h-full rounded-xl border border-slate-800 shadow-2xl", allowFullScreen: true, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", title: selectedContent.title }) })) : selectedContent.type === ContentType.LAB ? (_jsx(AssignmentView, { contentItem: selectedContent, onComplete: () => markCompleted(selectedContent.id) })) : (_jsx("div", { className: "flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full", children: _jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-32 -left-32 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10", children: _jsx("span", { className: "text-5xl", children: selectedContent.url.includes('teams.microsoft.com') ? '👥' :
                                                    selectedContent.url.includes('zoom.us') ? '📹' : '🔗' }) }), _jsx("h2", { className: "text-2xl font-black text-white mb-2 relative z-10", children: selectedContent.title }), selectedContent.description ? (_jsx("p", { className: "text-slate-400 mb-8 max-w-md leading-relaxed relative z-10", children: selectedContent.description })) : (_jsx("p", { className: "text-slate-500 mb-8 max-w-md relative z-10", children: "Click the button below to open this external resource in a new secure tab." })), _jsxs("a", { id: "external-link", href: selectedContent.url, target: "_blank", rel: "noopener noreferrer", className: "px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-3 relative z-10", children: [_jsx("span", { children: selectedContent.url.includes('teams.microsoft.com') ? 'Join Microsoft Teams Meeting' :
                                                        selectedContent.url.includes('zoom.us') ? 'Join Zoom Meeting' : 'Open Resource' }), _jsx("span", { className: "text-lg", children: "\u2197" })] })] }) })) }), _jsx("div", { className: "border-t border-slate-800 p-6 flex justify-between items-center bg-slate-950 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-20 shrink-0", children: isCompleted(selectedContent.id) ? (_jsxs("div", { className: "text-emerald-400 flex items-center gap-2 font-medium", children: [_jsx("span", { className: "text-xl", children: "\u2705" }), " Completed"] })) : (_jsx("button", { onClick: () => markCompleted(selectedContent.id), className: "btn-primary py-2.5 px-8 ml-auto font-bold shadow-lg shadow-brand-500/20", children: "Mark as Read & Continue \u2192" })) })] })) : (_jsx("div", { className: "flex items-center justify-center h-full text-slate-500", children: "Select a lesson to begin" })) })] }));
}
//# sourceMappingURL=CourseLearnPage.js.map