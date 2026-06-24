import { useState, useEffect } from 'react';
import type { Course } from '@mos/shared';
import { SoftwareModule, CourseLevel } from '@mos/shared';

import { coursesService } from '../../services/courses.service';

interface CourseModalProps {
  course: Partial<Course> | null;
  onClose: () => void;
  onSaved: () => void;
}

export function CourseModal({ course, onClose, onSaved }: CourseModalProps) {
  const isEditing = !!course?.id;
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    shortDescription: '',
    module: SoftwareModule.WORD,
    level: CourseLevel.BEGINNER,
    examCode: '',
    price: 0,
    ...course,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      module: SoftwareModule.WORD,
      level: CourseLevel.BEGINNER,
      examCode: '',
      price: 0,
      ...course,
    });
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Strip read-only properties that the backend ValidationPipe rejects
    const payload = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      module: formData.module,
      level: formData.level,
      examCode: formData.examCode,
      price: formData.price,
      thumbnailUrl: formData.thumbnailUrl,
    };

    try {
      if (isEditing) {
        await coursesService.update(course.id!, payload);
      } else {
        await coursesService.create(payload as any);
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course');
      setSaving(false);
    }
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-2xl mx-4 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white mb-6">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h2>

        {error && (
          <div className="mb-6 rounded-lg bg-red-900/40 p-4 text-sm text-red-300 border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Course Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Master Microsoft Excel 2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Short Description</label>
              <input
                required
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="input"
                maxLength={150}
                placeholder="Brief summary for catalog (max 150 chars)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Full Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[120px]"
                placeholder="Detailed course description..."
              />
            </div>

            <div>
              <label className="label">Software Module</label>
              <select
                name="module"
                value={formData.module}
                onChange={handleChange}
                className="input"
              >
                {Object.values(SoftwareModule).map((m) => (
                  <option key={m} value={m} className="capitalize">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Difficulty Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input"
              >
                {Object.values(CourseLevel).map((l) => (
                  <option key={l} value={l} className="capitalize">
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Exam Code</label>
              <input
                required
                type="text"
                name="examCode"
                value={formData.examCode}
                onChange={handleChange}
                className="input"
                placeholder="e.g. MO-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Thumbnail Image</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.thumbnailUrl ? (
                  <div className="relative h-20 w-32 rounded overflow-hidden">
                    <img src={formData.thumbnailUrl} alt="Thumbnail" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-xs hover:bg-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-lg hover:border-brand-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-slate-400 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand-400 hover:text-brand-300">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setSaving(true);
                              try {
                                const { uploadsService } = await import('../../services/uploads.service');
                                const url = await uploadsService.uploadImage(file);
                                setFormData({ ...formData, thumbnailUrl: url });
                              } catch (err: any) {
                                setError(err.response?.data?.message || 'Upload failed');
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="label">Price (USD)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input"
                placeholder="0.00 for free"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
