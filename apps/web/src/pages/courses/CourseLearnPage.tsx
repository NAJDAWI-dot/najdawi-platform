import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { useEnrollmentStore } from '../../stores/enrollmentStore';
import { ContentType } from '@mos/shared';
import type { Content, Quiz } from '@mos/shared';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../services/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { uploadsService } from '../../services/uploads.service';

// Initialize PDF.js worker
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function AssignmentView({ contentItem, onComplete }: { contentItem: Content; onComplete?: () => void }) {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSubmission = async () => {
    try {
      const res = await api.get(`/submissions/me/${contentItem.id}`);
      setSubmission(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSubmission();
  }, [contentItem.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadsService.uploadDocument(file);
      await api.post('/submissions', { contentItemId: contentItem.id, fileUrl: url });
      await fetchSubmission();
      alert('Assignment submitted successfully!');
      if (onComplete) onComplete();
    } catch (err) {
      alert('Failed to submit assignment');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-slate-400">Loading assignment data...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full flex flex-col shadow-2xl">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
          <div className="w-16 h-16 bg-brand-900/50 rounded-xl flex items-center justify-center border border-brand-800">
            <span className="text-3xl">📝</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{contentItem.title}</h2>
            <p className="text-brand-400 font-medium">Lab Assignment</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Instructions</h3>
          <p className="text-slate-300 leading-relaxed mb-6">{contentItem.description || 'Download the attached file, complete the required tasks, and upload your final document.'}</p>
          
          <a
            href={contentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
          >
            <span>⬇️</span> Download Assignment File
          </a>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Submission</h3>
          
          {submission ? (
            <div className={`p-6 rounded-xl border ${submission.status === 'graded' ? 'bg-green-900/20 border-green-800' : 'bg-blue-900/20 border-blue-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${submission.status === 'graded' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {submission.status}
                    </span>
                  </div>
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white underline">
                    View submitted file
                  </a>
                </div>
                
                {submission.status === 'graded' && (
                  <div className="text-right">
                    <div className="text-3xl font-black text-white">{submission.score}/100</div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Score</div>
                  </div>
                )}
              </div>
              
              {submission.feedback && (
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                  <p className="text-sm font-bold text-slate-400 mb-1">Instructor Feedback:</p>
                  <p className="text-slate-300 italic">"{submission.feedback}"</p>
                </div>
              )}

              <div className="mt-6">
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload New Revision'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-center bg-slate-800/50">
              <span className="text-4xl mb-4">📤</span>
              <p className="text-slate-300 font-medium mb-1">Ready to submit?</p>
              <p className="text-slate-500 text-sm mb-6">Upload your completed Word, Excel, or PowerPoint file here.</p>
              
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Select File to Upload'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { DiscussionsView } from './DiscussionsView';

export function CourseLearnPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedCourse, fetchCourse, isLoading } = useCourseStore();
  const { enrollments } = useEnrollmentStore();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [showDiscussions, setShowDiscussions] = useState(false);

  useEffect(() => {
    if (id) fetchCourse(id);
  }, [id]);

  useEffect(() => {
    if (selectedCourse?.contentItems?.length) {
      setSelectedContent(selectedCourse.contentItems[0]);
    }
  }, [selectedCourse]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const course = selectedCourse;
  if (!course) return null;

  const currentEnrollment = enrollments.find(e => e.courseId === course.id);
  const sortedContent = [...(course.contentItems || [])].sort((a, b) => a.order - b.order);
  const quizzes: Quiz[] = course.quizzes || [];
  const totalItems = sortedContent.length + quizzes.length;

  const markCompleted = async (itemId: string) => {
    const completedItems = new Set(currentEnrollment?.completedItemIds || []);
    if (completedItems.has(itemId)) return;
    
    completedItems.add(itemId);
    const newProgress = totalItems > 0 ? (completedItems.size / totalItems) * 100 : 100;
    
    try {
      await useEnrollmentStore.getState().updateProgress(course.id, newProgress, itemId);
    } catch (e) {
      console.error('Failed to update progress');
    }
  };

  const isCompleted = (itemId: string) => {
    return currentEnrollment?.completedItemIds?.includes(itemId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-y-auto z-10 animate-fade-in">
        <div className="p-4 border-b border-slate-800">
          <Link to={`/courses/${id}`} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
            ← Back to course
          </Link>
          <h2 className="mt-2 font-semibold text-white text-sm leading-tight">{course.title}</h2>
        </div>

        <div className="p-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Content</p>
          <div className="space-y-1">
            {sortedContent.map((item, idx) => (
              <button
                key={item.id}
                id={`content-item-${idx}`}
                onClick={() => {
                  setSelectedContent(item);
                  setNumPages(undefined);
                  setShowDiscussions(false);
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedContent?.id === item.id && !showDiscussions
                    ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">
                  {item.type === ContentType.VIDEO ? '▶️' :
                   item.type === ContentType.PDF ? '📄' :
                   item.type === ContentType.LINK ? '🔗' : '🧪'}
                </span>
                <span className="line-clamp-2">{item.title}</span>
              </button>
            ))}
          </div>

          {quizzes.length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2">Quizzes</p>
              <div className="space-y-1">
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    id={`quiz-link-${quiz.id}`}
                    to={`/quiz/${quiz.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <span>📝</span>
                    <span>{quiz.title}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 px-2 space-y-3">
            <button
              onClick={() => setShowDiscussions(true)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                showDiscussions
                  ? 'bg-brand-900/60 text-brand-300 border border-brand-800'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-transparent'
              }`}
            >
              💬 Course Q&A
            </button>
            <button 
              onClick={async () => {
                try {
                  const { useEnrollmentStore } = await import('../../stores/enrollmentStore');
                  await useEnrollmentStore.getState().updateProgress(course.id, 100);
                  alert('Course marked as complete! Great job!');
                } catch (e) {
                  alert('Failed to update progress');
                }
              }}
              className="w-full btn-primary py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            >
              ✅ Mark Course Complete
            </button>
          </div>
        </div>
      </aside>

      {/* Main viewer */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        {showDiscussions ? (
          <DiscussionsView courseId={course.id} />
        ) : selectedContent ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-4">
              <h1 className="text-lg font-semibold text-white">{selectedContent.title}</h1>
              <p className="text-xs text-slate-500 capitalize mt-0.5">{selectedContent.type}</p>
            </div>

            {/* Content viewer */}
            <div className="flex-1 p-8 pointer-events-auto relative animate-scale-in">
              {selectedContent.type === ContentType.PDF ? (
                <div 
                  className="relative w-full h-full rounded-xl border border-slate-800 overflow-y-auto bg-slate-900 flex flex-col items-center p-8"
                  onContextMenu={e => e.preventDefault()}
                >
                  <Document
                    file={selectedContent.url}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<div className="text-slate-400">Loading document securely...</div>}
                    error={<div className="text-red-400">Failed to load document securely.</div>}
                    className="flex flex-col items-center gap-6"
                  >
                    {Array.from(new Array(numPages || 0), (_, index) => (
                      <div key={`page_${index + 1}`} className="shadow-2xl rounded overflow-hidden">
                        <Page 
                          pageNumber={index + 1} 
                          renderTextLayer={false} 
                          renderAnnotationLayer={false}
                          width={800}
                        />
                      </div>
                    ))}
                  </Document>
                </div>
              ) : selectedContent.type === ContentType.VIDEO ? (
                <div className="aspect-video w-full max-w-4xl mx-auto">
                  <iframe
                    id="video-viewer"
                    src={
                      selectedContent.url.includes('youtube.com/watch?v=')
                        ? selectedContent.url.replace('watch?v=', 'embed/').split('&')[0]
                        : selectedContent.url.includes('youtu.be/')
                        ? selectedContent.url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]
                        : selectedContent.url
                    }
                    className="w-full h-full rounded-xl border border-slate-800 shadow-2xl"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={selectedContent.title}
                  />
                </div>
              ) : selectedContent.type === ContentType.LAB ? (
                <AssignmentView contentItem={selectedContent} onComplete={() => markCompleted(selectedContent.id)} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10">
                      <span className="text-5xl">
                        {selectedContent.url.includes('teams.microsoft.com') ? '👥' : 
                         selectedContent.url.includes('zoom.us') ? '📹' : '🔗'}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-white mb-2 relative z-10">
                      {selectedContent.title}
                    </h2>
                    
                    {selectedContent.description ? (
                      <p className="text-slate-400 mb-8 max-w-md leading-relaxed relative z-10">
                        {selectedContent.description}
                      </p>
                    ) : (
                      <p className="text-slate-500 mb-8 max-w-md relative z-10">
                        Click the button below to open this external resource in a new secure tab.
                      </p>
                    )}
                    
                    <a
                      id="external-link"
                      href={selectedContent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-3 relative z-10"
                    >
                      <span>
                        {selectedContent.url.includes('teams.microsoft.com') ? 'Join Microsoft Teams Meeting' : 
                         selectedContent.url.includes('zoom.us') ? 'Join Zoom Meeting' : 'Open Resource'}
                      </span>
                      <span className="text-lg">↗</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom completion bar */}
            <div className="border-t border-slate-800 p-6 flex justify-between items-center bg-slate-950 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-20 shrink-0">
              {isCompleted(selectedContent.id) ? (
                <div className="text-emerald-400 flex items-center gap-2 font-medium">
                  <span className="text-xl">✅</span> Completed
                </div>
              ) : (
                <button
                  onClick={() => markCompleted(selectedContent.id)}
                  className="btn-primary py-2.5 px-8 ml-auto font-bold shadow-lg shadow-brand-500/20"
                >
                  Mark as Read & Continue →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a lesson to begin
          </div>
        )}
      </div>
    </div>
  );
}
