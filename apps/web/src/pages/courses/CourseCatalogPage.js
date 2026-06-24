import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { SoftwareModule, CourseLevel } from '@mos/shared';
const MODULE_OPTIONS = Object.values(SoftwareModule);
const LEVEL_OPTIONS = Object.values(CourseLevel);
const levelColors = {
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
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses({ search, page: 1 });
    };
    const handleFilterChange = (key, value) => {
        const newFilter = { [key]: value || undefined, page: 1 };
        setFilter(newFilter);
        fetchCourses(newFilter);
    };
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Course Catalog" }), _jsx("p", { className: "page-subtitle", children: "Prepare for your Microsoft Office Specialist certification" })] }), _jsxs("div", { className: "mb-8 flex flex-col sm:flex-row gap-4", children: [_jsxs("form", { id: "search-form", onSubmit: handleSearch, className: "flex gap-2 flex-1", children: [_jsx("input", { id: "search-input", type: "text", className: "input flex-1", placeholder: "Search courses...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsx("button", { type: "submit", className: "btn-primary px-5", children: "Search" })] }), _jsxs("select", { id: "filter-module", className: "input w-auto min-w-[160px]", value: filter.module || '', onChange: (e) => handleFilterChange('module', e.target.value), children: [_jsx("option", { value: "", children: "All Modules" }), MODULE_OPTIONS.map((m) => (_jsx("option", { value: m, children: m.charAt(0).toUpperCase() + m.slice(1) }, m)))] }), _jsxs("select", { id: "filter-level", className: "input w-auto min-w-[140px]", value: filter.level || '', onChange: (e) => handleFilterChange('level', e.target.value), children: [_jsx("option", { value: "", children: "All Levels" }), LEVEL_OPTIONS.map((l) => (_jsx("option", { value: l, children: l.charAt(0).toUpperCase() + l.slice(1) }, l)))] })] }), isLoading ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: Array.from({ length: 8 }).map((_, i) => (_jsxs("div", { className: "card animate-pulse", children: [_jsx("div", { className: "h-40 rounded-lg bg-slate-800 mb-4" }), _jsx("div", { className: "h-4 bg-slate-800 rounded mb-2 w-3/4" }), _jsx("div", { className: "h-3 bg-slate-800 rounded w-1/2" })] }, i))) })) : courses.length === 0 ? (_jsxs("div", { className: "text-center py-24 text-slate-400", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCDA" }), _jsx("p", { className: "text-lg", children: "No courses found" }), _jsx("p", { className: "text-sm mt-1", children: "Try adjusting your filters" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: courses.map((course, index) => (_jsxs(Link, { to: `/courses/${course.id}`, className: "card group hover:border-brand-500/50 transition-colors flex flex-col animate-fade-in-up", style: { animationDelay: `${index * 100}ms`, opacity: 0 }, children: [_jsx("div", { className: "h-40 rounded-xl bg-gradient-to-br from-brand-900/60 to-slate-800 mb-4 overflow-hidden flex items-center justify-center", children: course.thumbnailUrl ? (_jsx("img", { src: course.thumbnailUrl, alt: course.title, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-4xl opacity-50", children: course.module === 'word' ? '📝' : course.module === 'excel' ? '📊' :
                                            course.module === 'powerpoint' ? '📊' : course.module === 'access' ? '🗄️' : '💼' })) }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: levelColors[course.level] || 'badge-blue', children: course.level }), _jsx("span", { className: "badge bg-slate-800 border border-slate-700 text-slate-400", children: course.examCode })] }), _jsx("h2", { className: "font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-2", children: course.title }), _jsx("p", { className: "text-xs text-slate-500 line-clamp-2 flex-1", children: course.shortDescription }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("span", { className: "text-lg font-bold text-white", children: course.price === 0 ? 'Free' : `$${course.price}` }), _jsxs("span", { className: "text-xs text-slate-500", children: [course.enrollmentCount ?? 0, " students"] })] })] })] }, course.id))) }), meta && meta.totalPages > 1 && (_jsx("div", { className: "mt-10 flex justify-center gap-2", children: Array.from({ length: meta.totalPages }).map((_, i) => (_jsx("button", { id: `page-btn-${i + 1}`, onClick: () => fetchCourses({ page: i + 1 }), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${meta.page === i + 1
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`, children: i + 1 }, i))) }))] }))] }));
}
//# sourceMappingURL=CourseCatalogPage.js.map