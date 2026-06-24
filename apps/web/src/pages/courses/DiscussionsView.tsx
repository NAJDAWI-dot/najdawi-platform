import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Reply {
  id: string;
  body: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

interface Thread {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  user: { firstName: string; lastName: string };
  replies: Reply[];
}

export function DiscussionsView({ courseId }: { courseId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [replyBody, setReplyBody] = useState<{ [threadId: string]: string }>({});

  const fetchThreads = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/discussions`);
      setThreads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [courseId]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    try {
      await api.post(`/courses/${courseId}/discussions`, { title: newTitle, body: newBody });
      setNewTitle('');
      setNewBody('');
      setIsCreating(false);
      fetchThreads();
    } catch (err) {
      console.error('Failed to create thread');
    }
  };

  const handleCreateReply = async (e: React.FormEvent, threadId: string) => {
    e.preventDefault();
    const body = replyBody[threadId];
    if (!body?.trim()) return;
    try {
      await api.post(`/courses/${courseId}/discussions/${threadId}/replies`, { body });
      setReplyBody(prev => ({ ...prev, [threadId]: '' }));
      fetchThreads();
    } catch (err) {
      console.error('Failed to reply');
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Loading discussions...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      <div className="border-b border-slate-800 px-8 py-6 bg-slate-900 sticky top-0 z-10 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Course Q&A</h1>
          <p className="text-sm text-slate-400">Ask questions and help your peers.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary py-2 shadow-brand-500/20 shadow-lg"
        >
          {isCreating ? 'Cancel' : '+ New Question'}
        </button>
      </div>

      <div className="p-8 max-w-4xl mx-auto w-full">
        {isCreating && (
          <form onSubmit={handleCreateThread} className="bg-slate-900 p-6 rounded-2xl border border-brand-500/30 mb-8 shadow-xl">
            <h3 className="font-bold text-white mb-4">Start a new discussion</h3>
            <input
              type="text"
              placeholder="Question Title (e.g. Need help with Module 2)"
              className="input mb-4"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Describe your question in detail..."
              className="input min-h-[120px] mb-4"
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button type="submit" className="btn-primary py-2 px-6">Post Question</button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {threads.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
              <span className="text-4xl mb-4 block">👋</span>
              <p className="text-slate-400">No questions yet. Be the first to ask!</p>
            </div>
          ) : (
            threads.map(thread => (
              <div key={thread.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
                {/* Thread original post */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white leading-tight">{thread.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-6">{thread.body}</p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-brand-900/50 flex items-center justify-center text-brand-300 font-bold border border-brand-800/50">
                      {thread.user.firstName[0]}
                    </div>
                    <div>
                      <div className="text-slate-300 font-medium">{thread.user.firstName} {thread.user.lastName}</div>
                      <div className="text-slate-500 text-xs">{new Date(thread.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {thread.replies?.length > 0 && (
                  <div className="bg-slate-950/50 border-t border-slate-800/50 p-6 space-y-6">
                    {thread.replies.map(reply => (
                      <div key={reply.id} className="flex gap-4">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs mt-1">
                          {reply.user.firstName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-900 p-4 rounded-xl rounded-tl-none border border-slate-800 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-slate-300 text-sm">{reply.user.firstName} {reply.user.lastName}</span>
                              <span className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{reply.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="bg-slate-950 border-t border-slate-800 p-4 pl-16">
                  <form onSubmit={(e) => handleCreateReply(e, thread.id)} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="input py-2 text-sm flex-1 bg-slate-900"
                      value={replyBody[thread.id] || ''}
                      onChange={e => setReplyBody(prev => ({ ...prev, [thread.id]: e.target.value }))}
                      required
                    />
                    <button type="submit" className="btn-secondary py-2 text-sm text-brand-400 border-brand-900 hover:bg-brand-900/30">
                      Reply
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
