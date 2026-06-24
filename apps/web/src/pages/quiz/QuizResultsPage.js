import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';
export function QuizResultsPage() {
    const { quizId } = useParams();
    const { state } = useLocation();
    const { currentAttempt, loadAttempt, reset, isLoading } = useQuizStore();
    useEffect(() => {
        if (state?.attemptId) {
            loadAttempt(state.attemptId);
        }
    }, [state]);
    if (isLoading || !currentAttempt) {
        return (_jsx("div", { className: "flex h-[calc(100vh-4rem)] items-center justify-center", children: _jsx("div", { className: "animate-spin h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent" }) }));
    }
    const passed = currentAttempt.isPassed;
    const score = currentAttempt.score ?? 0;
    return (_jsxs("div", { className: "mx-auto max-w-lg px-4 py-16 text-center", children: [_jsx("div", { className: `mx-auto mb-8 h-32 w-32 rounded-full flex items-center justify-center text-6xl shadow-2xl ${passed
                    ? 'bg-emerald-900/40 border-2 border-emerald-700 shadow-emerald-900/40'
                    : 'bg-red-900/40 border-2 border-red-700 shadow-red-900/40'}`, children: passed ? '🎉' : '😔' }), _jsx("h1", { className: `text-4xl font-black mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`, children: passed ? 'You Passed!' : 'Not Quite' }), _jsx("p", { className: "text-slate-400 mb-8", children: passed
                    ? 'Great job! You have demonstrated your skills.'
                    : 'Keep practicing — you can do it!' }), _jsxs("div", { className: "card mb-8", children: [_jsxs("div", { className: "text-6xl font-black text-white mb-2", children: [score.toFixed(1), "%"] }), _jsx("div", { className: "text-slate-400 text-sm", children: "Your Score" }), _jsx("div", { className: "mt-6 h-3 rounded-full bg-slate-800 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-1000 ${passed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-700 to-red-500'}`, style: { width: `${score}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-slate-500 mt-1", children: [_jsx("span", { children: "0%" }), _jsxs("span", { className: "text-slate-400", children: ["Pass: ", currentAttempt.quiz?.passingScore ?? 70, "%"] }), _jsx("span", { children: "100%" })] }), _jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "rounded-xl bg-slate-800 p-4", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: currentAttempt.answers.filter((a) => a.isCorrect).length }), _jsx("div", { className: "text-slate-400 text-xs mt-1", children: "Correct" })] }), _jsxs("div", { className: "rounded-xl bg-slate-800 p-4", children: [_jsx("div", { className: "text-2xl font-bold text-white", children: currentAttempt.answers.filter((a) => !a.isCorrect).length }), _jsx("div", { className: "text-slate-400 text-xs mt-1", children: "Incorrect" })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [_jsx(Link, { to: "/student/dashboard", onClick: reset, id: "back-to-dashboard-btn", className: "btn-secondary", children: "\u2190 Dashboard" }), _jsx(Link, { to: `/quiz/${quizId}`, onClick: reset, id: "retry-quiz-btn", className: "btn-primary", children: "Retry Quiz \uD83D\uDD04" })] })] }));
}
//# sourceMappingURL=QuizResultsPage.js.map