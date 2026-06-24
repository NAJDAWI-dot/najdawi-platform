import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../../services/api';
export function DiscussionsView({ courseId }) {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [replyBody, setReplyBody] = useState({});
    const fetchThreads = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/discussions`);
            setThreads(res.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchThreads();
    }, [courseId]);
    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newBody.trim())
            return;
        try {
            await api.post(`/courses/${courseId}/discussions`, { title: newTitle, body: newBody });
            setNewTitle('');
            setNewBody('');
            setIsCreating(false);
            fetchThreads();
        }
        catch (err) {
            console.error('Failed to create thread');
        }
    };
    const handleCreateReply = async (e, threadId) => {
        e.preventDefault();
        const body = replyBody[threadId];
        if (!body?.trim())
            return;
        try {
            await api.post(`/courses/${courseId}/discussions/${threadId}/replies`, { body });
            setReplyBody(prev => ({ ...prev, [threadId]: '' }));
            fetchThreads();
        }
        catch (err) {
            console.error('Failed to reply');
        }
    };
    if (loading) {
        return _jsx("div", { className: "p-8 text-slate-400", children: "Loading discussions..." });
    }
    return (_jsxs("div", { className: "flex flex-col h-full bg-slate-950 overflow-y-auto", children: [_jsxs("div", { className: "border-b border-slate-800 px-8 py-6 bg-slate-900 sticky top-0 z-10 flex justify-between items-center shadow-lg", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-1", children: "Course Q&A" }), _jsx("p", { className: "text-sm text-slate-400", children: "Ask questions and help your peers." })] }), _jsx("button", { onClick: () => setIsCreating(!isCreating), className: "btn-primary py-2 shadow-brand-500/20 shadow-lg", children: isCreating ? 'Cancel' : '+ New Question' })] }), _jsxs("div", { className: "p-8 max-w-4xl mx-auto w-full", children: [isCreating && (_jsxs("form", { onSubmit: handleCreateThread, className: "bg-slate-900 p-6 rounded-2xl border border-brand-500/30 mb-8 shadow-xl", children: [_jsx("h3", { className: "font-bold text-white mb-4", children: "Start a new discussion" }), _jsx("input", { type: "text", placeholder: "Question Title (e.g. Need help with Module 2)", className: "input mb-4", value: newTitle, onChange: e => setNewTitle(e.target.value), required: true }), _jsx("textarea", { placeholder: "Describe your question in detail...", className: "input min-h-[120px] mb-4", value: newBody, onChange: e => setNewBody(e.target.value), required: true }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "btn-primary py-2 px-6", children: "Post Question" }) })] })), _jsx("div", { className: "space-y-6", children: threads.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed", children: [_jsx("span", { className: "text-4xl mb-4 block", children: "\uD83D\uDC4B" }), _jsx("p", { className: "text-slate-400", children: "No questions yet. Be the first to ask!" })] })) : (threads.map(thread => (_jsxs("div", { className: "bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md", children: [_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsx("h3", { className: "text-lg font-bold text-white leading-tight", children: thread.title }) }), _jsx("p", { className: "text-slate-300 leading-relaxed mb-6", children: thread.body }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-brand-900/50 flex items-center justify-center text-brand-300 font-bold border border-brand-800/50", children: thread.user.firstName[0] }), _jsxs("div", { children: [_jsxs("div", { className: "text-slate-300 font-medium", children: [thread.user.firstName, " ", thread.user.lastName] }), _jsx("div", { className: "text-slate-500 text-xs", children: new Date(thread.createdAt).toLocaleString() })] })] })] }), thread.replies?.length > 0 && (_jsx("div", { className: "bg-slate-950/50 border-t border-slate-800/50 p-6 space-y-6", children: thread.replies.map(reply => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "h-8 w-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs mt-1", children: reply.user.firstName[0] }), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "bg-slate-900 p-4 rounded-xl rounded-tl-none border border-slate-800 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("span", { className: "font-semibold text-slate-300 text-sm", children: [reply.user.firstName, " ", reply.user.lastName] }), _jsx("span", { className: "text-xs text-slate-500", children: new Date(reply.createdAt).toLocaleString() })] }), _jsx("p", { className: "text-slate-300 text-sm leading-relaxed", children: reply.body })] }) })] }, reply.id))) })), _jsx("div", { className: "bg-slate-950 border-t border-slate-800 p-4 pl-16", children: _jsxs("form", { onSubmit: (e) => handleCreateReply(e, thread.id), className: "flex gap-3", children: [_jsx("input", { type: "text", placeholder: "Write a reply...", className: "input py-2 text-sm flex-1 bg-slate-900", value: replyBody[thread.id] || '', onChange: e => setReplyBody(prev => ({ ...prev, [thread.id]: e.target.value })), required: true }), _jsx("button", { type: "submit", className: "btn-secondary py-2 text-sm text-brand-400 border-brand-900 hover:bg-brand-900/30", children: "Reply" })] }) })] }, thread.id)))) })] })] }));
}
//# sourceMappingURL=DiscussionsView.js.map