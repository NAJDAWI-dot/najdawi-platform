import { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuizStore } from '../../stores/quizStore';

export function QuizResultsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { state } = useLocation();
  const { currentAttempt, loadAttempt, reset, isLoading } = useQuizStore();

  useEffect(() => {
    if (state?.attemptId) {
      loadAttempt(state.attemptId);
    }
  }, [state]);

  if (isLoading || !currentAttempt) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const passed = currentAttempt.isPassed;
  const score = currentAttempt.score ?? 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      {/* Result icon */}
      <div
        className={`mx-auto mb-8 h-32 w-32 rounded-full flex items-center justify-center text-6xl shadow-2xl ${
          passed
            ? 'bg-emerald-900/40 border-2 border-emerald-700 shadow-emerald-900/40'
            : 'bg-red-900/40 border-2 border-red-700 shadow-red-900/40'
        }`}
      >
        {passed ? '🎉' : '😔'}
      </div>

      <h1 className={`text-4xl font-black mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
        {passed ? 'You Passed!' : 'Not Quite'}
      </h1>
      <p className="text-slate-400 mb-8">
        {passed
          ? 'Great job! You have demonstrated your skills.'
          : 'Keep practicing — you can do it!'}
      </p>

      {/* Score card */}
      <div className="card mb-8">
        <div className="text-6xl font-black text-white mb-2">{score.toFixed(1)}%</div>
        <div className="text-slate-400 text-sm">Your Score</div>

        {/* Score gauge */}
        <div className="mt-6 h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              passed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-700 to-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span className="text-slate-400">Pass: {currentAttempt.quiz?.passingScore ?? 70}%</span>
          <span>100%</span>
        </div>

        {/* Breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-slate-800 p-4">
            <div className="text-2xl font-bold text-white">
              {currentAttempt.answers.filter((a) => a.isCorrect).length}
            </div>
            <div className="text-slate-400 text-xs mt-1">Correct</div>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <div className="text-2xl font-bold text-white">
              {currentAttempt.answers.filter((a) => !a.isCorrect).length}
            </div>
            <div className="text-slate-400 text-xs mt-1">Incorrect</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/student/dashboard"
          onClick={reset}
          id="back-to-dashboard-btn"
          className="btn-secondary"
        >
          ← Dashboard
        </Link>

        <Link
          to={`/quiz/${quizId}`}
          onClick={reset}
          id="retry-quiz-btn"
          className="btn-primary"
        >
          Retry Quiz 🔄
        </Link>
      </div>
    </div>
  );
}
