import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminNav } from '../../components/layout/AdminNav';
import api from '../../services/api';
import { ContentType, type Content } from '@mos/shared';
import { uploadsService } from '../../services/uploads.service';

export function AdminCourseContentPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [contentItems, setContentItems] = useState<Content[]>([]);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [courseId]);

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;
    try {
      await api.delete(`/courses/${courseId}/content/${contentId}`);
      setContentItems(contentItems.filter((c) => c.id !== contentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadsService.uploadDocument(file);
      setFormData({ ...formData, url, type: ContentType.PDF });
    } catch (err) {
      alert('File upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/courses/${courseId}/content`, formData);
      setIsModalOpen(false);
      loadContent();
    } catch (err) {
      alert('Failed to save content');
    } finally {
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
          <h1 className="page-title">Manage Course Content</h1>
          <p className="page-subtitle">Upload PDFs, add video links, or Teams meeting URLs</p>
        </div>
        <button onClick={openNewModal} className="btn-primary">
          + Add Content
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Type</th>
              <th>Title</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : contentItems.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-8">No content yet. Add a Teams link!</td></tr>
            ) : (
              contentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.order}</td>
                  <td>
                    <span className="badge badge-blue capitalize">{item.type}</span>
                  </td>
                  <td className="font-medium text-white">{item.title}</td>
                  <td className="max-w-[200px] truncate text-slate-400">
                    <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-brand-400">
                      {item.url}
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md mx-4 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400">✕</button>
            <h2 className="text-xl font-bold text-white mb-6">Add Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input required type="text" className="input" placeholder="e.g. Weekly Teams Meeting"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div>
                <label className="label">Content Type</label>
                <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ContentType})}>
                  <option value={ContentType.LINK}>External Link (Teams/Zoom)</option>
                  <option value={ContentType.VIDEO}>Video URL (YouTube)</option>
                  <option value={ContentType.PDF}>PDF Document</option>
                  <option value={ContentType.LAB}>Lab Assignment (Word/PPT/Excel)</option>
                </select>
              </div>

              {(formData.type === ContentType.PDF || formData.type === ContentType.LAB) ? (
                <div>
                  <label className="label">Upload {formData.type === ContentType.PDF ? 'PDF' : 'Assignment File'}</label>
                  <input type="file" accept={formData.type === ContentType.PDF ? '.pdf' : '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf'} onChange={handleFileUpload} className="input p-2" />
                  {formData.url && <p className="text-xs text-brand-400 mt-2">File uploaded successfully!</p>}
                </div>
              ) : (
                <div>
                  <label className="label">URL</label>
                  <input required type="url" className="input" placeholder="https://teams.microsoft.com/..."
                    value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
                </div>
              )}

              <div>
                <label className="label">Order (Sequence)</label>
                <input type="number" className="input" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
              </div>

              <div>
                <label className="label">Description (Optional)</label>
                <textarea 
                  className="input min-h-[80px]" 
                  placeholder="e.g. Friday at 5:00 PM EST. Topics: Q&A, Exam Review"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving || (!formData.url && (formData.type === ContentType.PDF || formData.type === ContentType.LAB))}>Save Content</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
