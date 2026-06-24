import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';
export function QuizPlayerPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { activeQuiz, currentAttempt, answers, loadQuiz, startAttempt, setAnswer, submitAttempt, timeRemaining, setTimeRemaining, isLoading } = useQuizStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);
    useEffect(() => {
        if (quizId) {
            loadQuiz(quizId).then(() => {
                startAttempt(quizId);
            });
        }
        return () => { if (timerRef.current)
            clearInterval(timerRef.current); };
    }, [quizId]);
    useEffect(() => {
        if (timeRemaining !== null && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => { if (timerRef.current)
                clearInterval(timerRef.current); };
        }
        else if (timeRemaining === 0) {
            handleSubmit();
        }
    }, [timeRemaining]);
    const handleSubmit = async () => {
        if (submitting)
            return;
        setSubmitting(true);
        if (timerRef.current)
            clearInterval(timerRef.current);
        try {
            const result = await submitAttempt();
            try {
                const { useEnrollmentStore } = await import('../../stores/enrollmentStore');
                const { useCourseStore } = await import('../../stores/courseStore');
                let course = useCourseStore.getState().selectedCourse;
                if (!course || course.id !== activeQuiz?.courseId) {
                    if (activeQuiz?.courseId) {
                        await useCourseStore.getState().fetchCourse(activeQuiz.courseId);
                        course = useCourseStore.getState().selectedCourse;
                    }
                }
                if (course && quizId) {
                    const currentEnrollment = useEnrollmentStore.getState().enrollments.find(e => e.courseId === course.id);
                    const completedItems = new Set(currentEnrollment?.completedItemIds || []);
                    if (!completedItems.has(quizId)) {
                        completedItems.add(quizId);
                        const totalItems = (course.contentItems?.length || 0) + (course.quizzes?.length || 0);
                        const newProgress = totalItems > 0 ? (completedItems.size / totalItems) * 100 : 100;
                        await useEnrollmentStore.getState().updateProgress(course.id, newProgress, quizId);
                    }
                }
            }
            catch (e) {
                console.error('Failed to mark quiz as completed', e);
            }
            navigate(`/quiz/${quizId}/results`, { state: { attemptId: result.id } });
        }
        catch {
            setSubmitting(false);
        }
    };
    if (isLoading || !activeQuiz || !currentAttempt) {
        return (_jsx("div", { className: "flex h-[calc(100vh-4rem)] items-center justify-center", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "animate-spin h-10 w-10 rounded-full border-2 border-brand-500 border-t-transparent mx-auto" }), _jsx("p", { className: "text-slate-400", children: "Loading quiz..." })] }) }));
    }
    const questions = activeQuiz.questions.sort((a, b) => a.order - b.order);
    const current = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const selectedChoice = current ? answers[current.id] : null;
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: "mx-auto max-w-3xl px-4 sm:px-6 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-white", children: activeQuiz.title }), _jsxs("p", { className: "text-sm text-slate-400", children: ["Question ", currentIndex + 1, " of ", questions.length] })] }), timeRemaining !== null && (_jsxs("div", { className: `flex items-center gap-2 px-4 py-2 rounded-full border font-mono font-bold ${timeRemaining <= 60
                            ? 'border-red-800 bg-red-900/40 text-red-300'
                            : 'border-slate-700 bg-slate-800 text-white'}`, children: ["\u23F1 ", formatTime(timeRemaining)] }))] }), _jsx("div", { className: "h-1.5 rounded-full bg-slate-800 mb-8 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-brand-500 transition-all duration-300", style: { width: `${progress}%` } }) }), current && (_jsxs("div", { className: "card space-y-6", children: [_jsxs("div", { children: [_jsxs("span", { className: "badge-blue mb-3 inline-block", children: [current.points, " pt", current.points !== 1 ? 's' : ''] }), _jsx("p", { className: "text-lg font-medium text-white leading-relaxed", children: current.text }), current.imageUrl && (_jsx("img", { src: current.imageUrl, alt: "Question", className: "mt-4 rounded-xl max-h-64 object-contain" }))] }), _jsx("div", { className: "space-y-3", children: current.choices.sort((a, b) => a.order - b.order).map((choice) => (_jsx("button", { id: `choice-${choice.id}`, onClick: () => setAnswer(current.id, choice.id), className: `w-full text-left rounded-xl border px-5 py-4 text-sm font-medium transition-all duration-200 ${selectedChoice === choice.id
                                ? 'border-brand-500 bg-brand-900/50 text-brand-200 shadow-brand-900/30 shadow-lg'
                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'}`, children: choice.text }, choice.id))) })] })), _jsxs("div", { className: "flex items-center justify-between mt-8", children: [_jsx("button", { id: "prev-question-btn", onClick: () => setCurrentIndex((i) => Math.max(0, i - 1)), disabled: currentIndex === 0, className: "btn-secondary", children: "\u2190 Previous" }), _jsx("div", { className: "flex items-center gap-2", children: questions.map((_, i) => (_jsx("button", { id: `question-dot-${i}`, onClick: () => setCurrentIndex(i), className: `h-2.5 w-2.5 rounded-full transition-all duration-200 ${i === currentIndex
                                ? 'bg-brand-500 scale-125'
                                : answers[questions[i]?.id]
                                    ? 'bg-brand-700'
                                    : 'bg-slate-700'}` }, i))) }), currentIndex < questions.length - 1 ? (_jsx("button", { id: "next-question-btn", onClick: () => setCurrentIndex((i) => i + 1), className: "btn-primary", children: "Next \u2192" })) : (_jsx("button", { id: "submit-quiz-btn", onClick: handleSubmit, disabled: submitting, className: "btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40", children: submitting ? 'Submitting...' : 'Submit Quiz ✓' }))] }), _jsxs("div", { className: "mt-6 text-center text-sm text-slate-500", children: [Object.keys(answers).length, " of ", questions.length, " questions answered"] })] }));
}
//# sourceMappingURL=QuizPlayerPage.js.map