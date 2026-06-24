import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminNav } from '../../components/layout/AdminNav';
import api from '../../services/api';

export function AdminSubmissionsPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [score, setScore] = useState<number | string>('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/submissions/course/${courseId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [courseId]);

  const openGradingModal = (sub: any) => {
    setSelectedSubmission(sub);
    setScore(sub.score || '');
    setFeedback(sub.feedback || '');
    setGradingModalOpen(true);
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/submissions/${selectedSubmission.id}/grade`, {
        score: Number(score),
        feedback,
      });
      setGradingModalOpen(false);
      loadSubmissions();
    } catch (err) {
      alert('Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <AdminNav />
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/admin/courses" className="text-sm text-brand-400 hover:text-brand-300">
              &larr; Back to Courses
            </Link>
          </div>
          <h1 className="page-title">Grade Submissions</h1>
          <p className="page-subtitle">Review student labs and assign grades</p>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-500 py-8">No submissions yet.</td></tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id}>
                  <td className="font-medium text-white">{sub.user.name} <br/><span className="text-xs text-slate-500 font-normal">{sub.user.email}</span></td>
                  <td>{sub.contentItem.title}</td>
                  <td className="text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${sub.status === 'graded' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="text-white font-bold">{sub.score !== null ? `${sub.score}/100` : '-'}</td>
                  <td>
                    <div className="flex gap-3">
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">
                        Download
                      </a>
                      <button onClick={() => openGradingModal(sub)} className="text-white hover:text-brand-400">
                        Grade
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {gradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md mx-4 relative">
            <button onClick={() => setGradingModalOpen(false)} className="absolute top-4 right-4 text-slate-400">✕</button>
            <h2 className="text-xl font-bold text-white mb-2">Grade Assignment</h2>
            <p className="text-sm text-slate-400 mb-6">{selectedSubmission.user.name} - {selectedSubmission.contentItem.title}</p>
            
            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="label">Score (0-100)</label>
                <input required type="number" min="0" max="100" className="input" 
                  value={score} onChange={e => setScore(e.target.value)} />
              </div>
              
              <div>
                <label className="label">Feedback (Optional)</label>
                <textarea 
                  className="input min-h-[100px]" 
                  placeholder="Great job on the pivot tables..."
                  value={feedback} 
                  onChange={e => setFeedback(e.target.value)} 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setGradingModalOpen(false)} className="btn-secondary" disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>Submit Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
