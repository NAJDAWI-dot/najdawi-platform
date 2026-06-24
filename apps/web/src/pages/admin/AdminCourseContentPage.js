import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminNav } from '../../components/layout/AdminNav';
import api from '../../services/api';
import { ContentType } from '@mos/shared';
import { uploadsService } from '../../services/uploads.service';
export function AdminCourseContentPage() {
    const { id: courseId } = useParams();
    const [contentItems, setContentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: ContentType.LINK,
        url: '',
        order: 0,
        description: '',
    });
    const loadContent = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/courses/${courseId}/content`);
            setContentItems(res.data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadContent();
    }, [courseId]);
    const handleDelete = async (contentId) => {
        if (!confirm('Are you sure you want to delete this content item?'))
            return;
        try {
            await api.delete(`/courses/${courseId}/content/${contentId}`);
            setContentItems(contentItems.filter((c) => c.id !== contentId));
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setSaving(true);
        try {
            const url = await uploadsService.uploadDocument(file);
            setFormData({ ...formData, url, type: ContentType.PDF });
        }
        catch (err) {
            alert('File upload failed');
        }
        finally {
            setSaving(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post(`/courses/${courseId}/content`, formData);
            setIsModalOpen(false);
            loadContent();
        }
        catch (err) {
            alert('Failed to save content');
        }
        finally {
            setSaving(false);
        }
    };
    const openNewModal = () => {
        setFormData({
            title: '',
            type: ContentType.LINK,
            url: '',
            order: contentItems.length,
            description: '',
        });
        setIsModalOpen(true);
    };
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx(AdminNav, {}), _jsxs("div", { className: "page-header flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: _jsx(Link, { to: "/admin/courses", className: "text-sm text-brand-400 hover:text-brand-300", children: "\u2190 Back to Courses" }) }), _jsx("h1", { className: "page-title", children: "Manage Course Content" }), _jsx("p", { className: "page-subtitle", children: "Upload PDFs, add video links, or Teams meeting URLs" })] }), _jsx("button", { onClick: openNewModal, className: "btn-primary", children: "+ Add Content" })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Order" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "Title" }), _jsx("th", { children: "URL" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-8", children: "Loading..." }) })) : contentItems.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center text-slate-500 py-8", children: "No content yet. Add a Teams link!" }) })) : (contentItems.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.order }), _jsx("td", { children: _jsx("span", { className: "badge badge-blue capitalize", children: item.type }) }), _jsx("td", { className: "font-medium text-white", children: item.title }), _jsx("td", { className: "max-w-[200px] truncate text-slate-400", children: _jsx("a", { href: item.url, target: "_blank", rel: "noreferrer", className: "hover:text-brand-400", children: item.url }) }), _jsx("td", { children: _jsx("button", { onClick: () => handleDelete(item.id), className: "text-xs text-red-400 hover:text-red-300 transition-colors", children: "Delete" }) })] }, item.id)))) })] }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "card w-full max-w-md mx-4 relative", children: [_jsx("button", { onClick: () => setIsModalOpen(false), className: "absolute top-4 right-4 text-slate-400", children: "\u2715" }), _jsx("h2", { className: "text-xl font-bold text-white mb-6", children: "Add Content" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Title" }), _jsx("input", { required: true, type: "text", className: "input", placeholder: "e.g. Weekly Teams Meeting", value: formData.title, onChange: e => setFormData({ ...formData, title: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Content Type" }), _jsxs("select", { className: "input", value: formData.type, onChange: e => setFormData({ ...formData, type: e.target.value }), children: [_jsx("option", { value: ContentType.LINK, children: "External Link (Teams/Zoom)" }), _jsx("option", { value: ContentType.VIDEO, children: "Video URL (YouTube)" }), _jsx("option", { value: ContentType.PDF, children: "PDF Document" }), _jsx("option", { value: ContentType.LAB, children: "Lab Assignment (Word/PPT/Excel)" })] })] }), (formData.type === ContentType.PDF || formData.type === ContentType.LAB) ? (_jsxs("div", { children: [_jsxs("label", { className: "label", children: ["Upload ", formData.type === ContentType.PDF ? 'PDF' : 'Assignment File'] }), _jsx("input", { type: "file", accept: formData.type === ContentType.PDF ? '.pdf' : '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf', onChange: handleFileUpload, className: "input p-2" }), formData.url && _jsx("p", { className: "text-xs text-brand-400 mt-2", children: "File uploaded successfully!" })] })) : (_jsxs("div", { children: [_jsx("label", { className: "label", children: "URL" }), _jsx("input", { required: true, type: "url", className: "input", placeholder: "https://teams.microsoft.com/...", value: formData.url, onChange: e => setFormData({ ...formData, url: e.target.value }) })] })), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Order (Sequence)" }), _jsx("input", { type: "number", className: "input", value: formData.order, onChange: e => setFormData({ ...formData, order: Number(e.target.value) }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Description (Optional)" }), _jsx("textarea", { className: "input min-h-[80px]", placeholder: "e.g. Friday at 5:00 PM EST. Topics: Q&A, Exam Review", value: formData.description, onChange: e => setFormData({ ...formData, description: e.target.value }) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "btn-secondary", disabled: saving, children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: saving || (!formData.url && (formData.type === ContentType.PDF || formData.type === ContentType.LAB)), children: "Save Content" })] })] })] }) }))] }));
}
//# sourceMappingURL=AdminCourseContentPage.js.map