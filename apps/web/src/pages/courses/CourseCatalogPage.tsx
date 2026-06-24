import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { SoftwareModule, CourseLevel } from '@mos/shared';

const MODULE_OPTIONS = Object.values(SoftwareModule);
const LEVEL_OPTIONS = Object.values(CourseLevel);

const levelColors: Record<string, string> = {
  beginner: 'badge-green',
  intermediate: 'badge-blue',
  advanced: 'badge-yellow',
  expert: 'badge-red',
};

export function CourseCatalogPage() {
  const { courses, meta, filter, isLoading, fetchCourses, setFilter } = useCourseStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses({ search, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilter = { [key]: value || undefined, page: 1 };
    setFilter(newFilter);
    fetchCourses(newFilter);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="page-header">
        <h1 className="page-title">Course Catalog</h1>
        <p className="page-subtitle">Prepare for your Microsoft Office Specialist certification</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <form id="search-form" onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            id="search-input"
            type="text"
            className="input flex-1"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary px-5">Search</button>
        </form>

        <select
          id="filter-module"
          className="input w-auto min-w-[160px]"
          value={filter.module || ''}
          onChange={(e) => handleFilterChange('module', e.target.value)}
        >
          <option value="">All Modules</option>
          {MODULE_OPTIONS.map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>

        <select
          id="filter-level"
          className="input w-auto min-w-[140px]"
          value={filter.level || ''}
          onChange={(e) => handleFilterChange('level', e.target.value)}
        >
          <option value="">All Levels</option>
          {LEVEL_OPTIONS.map((l) => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-40 rounded-lg bg-slate-800 mb-4" />
              <div className="h-4 bg-slate-800 rounded mb-2 w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-lg">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="card group hover:border-brand-500/50 transition-colors flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
              >
                {/* Thumbnail */}
                <div className="h-40 rounded-xl bg-gradient-to-br from-brand-900/60 to-slate-800 mb-4 overflow-hidden flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl opacity-50">
                      {course.module === 'word' ? '📝' : course.module === 'excel' ? '📊' :
                       course.module === 'powerpoint' ? '📊' : course.module === 'access' ? '🗄️' : '💼'}
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={levelColors[course.level] || 'badge-blue'}>
                      {course.level}
                    </span>
                    <span className="badge bg-slate-800 border border-slate-700 text-slate-400">
                      {course.examCode}
                    </span>
                  </div>

                  <h2 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h2>

                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">
                    {course.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <span className="text-xs text-slate-500">
                      {course.enrollmentCount ?? 0} students
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  id={`page-btn-${i + 1}`}
                  onClick={() => fetchCourses({ page: i + 1 })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    meta.page === i + 1
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
