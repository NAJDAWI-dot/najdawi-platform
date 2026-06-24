import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import { CourseModal } from './CourseModal';
import { AdminNav } from '../../components/layout/AdminNav';
export function AdminCoursesPage() {
    const { courses, isLoading, togglePublish, deleteCourse } = useCourseStore();
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const loadCourses = () => {
        import('../../services/courses.service').then(({ coursesService }) => {
            coursesService.getAll().then((res) => {
                useCourseStore.setState({ courses: res.data, meta: res.meta });
            });
        });
    };
    useEffect(() => {
        loadCourses();
    }, []);
    const handleToggle = async (id) => {
        await togglePublish(id);
    };
    const handleDelete = async (id) => {
        await deleteCourse(id);
        setConfirmDelete(null);
    };
    const openNewCourse = () => {
        setEditingCourse({});
        setIsModalOpen(true);
    };
    const openEditCourse = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };
    const handleModalSaved = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        loadCourses(); // Refresh list
    };
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx(AdminNav, {}), _jsxs("div", { className: "page-header flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "Manage Courses" }), _jsx("p", { className: "page-subtitle", children: "Create, edit, and publish courses" })] }), _jsx("button", { id: "create-course-btn", onClick: openNewCourse, className: "btn-primary", children: "+ New Course" })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Title" }), _jsx("th", { children: "Module" }), _jsx("th", { children: "Level" }), _jsx("th", { children: "Exam Code" }), _jsx("th", { children: "Price" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center py-8", children: _jsx("div", { className: "animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" }) }) })) : courses.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center text-slate-500 py-8", children: "No courses yet" }) })) : (courses.map((course) => (_jsxs("tr", { children: [_jsx("td", { className: "font-medium text-white max-w-[200px] truncate", children: course.title }), _jsx("td", { className: "capitalize", children: course.module }), _jsx("td", { className: "capitalize", children: course.level }), _jsx("td", { children: course.examCode }), _jsx("td", { children: course.price === 0 ? 'Free' : `$${course.price}` }), _jsx("td", { children: _jsx("button", { id: `toggle-publish-${course.id}`, onClick: () => handleToggle(course.id), className: `badge cursor-pointer transition-colors ${course.isPublished
                                                ? 'badge-green hover:bg-red-900/40 hover:text-red-300 hover:border-red-800'
                                                : 'badge-yellow hover:badge-green'}`, children: course.isPublished ? 'Published' : 'Draft' }) }), _jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Link, { to: `/admin/courses/${course.id}/content`, className: "btn-secondary py-1.5 px-3 text-xs", children: "Manage Content" }), _jsx(Link, { to: `/admin/courses/${course.id}/submissions`, className: "btn-secondary py-1.5 px-3 text-xs border-blue-800 text-blue-400 hover:bg-blue-900/30", children: "Grade Submissions" })] }), _jsx("button", { id: `edit-course-${course.id}`, onClick: () => openEditCourse(course), className: "text-xs text-brand-400 hover:text-brand-300 transition-colors", children: "Edit" }), _jsx("button", { id: `delete-course-${course.id}`, onClick: () => setConfirmDelete(course.id), className: "text-xs text-red-400 hover:text-red-300 transition-colors", children: "Delete" })] }) })] }, course.id)))) })] }) }), isModalOpen && (_jsx(CourseModal, { course: editingCourse, onClose: () => setIsModalOpen(false), onSaved: handleModalSaved })), confirmDelete && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: _jsxs("div", { className: "card max-w-sm w-full mx-4", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Delete course?" }), _jsx("p", { className: "text-slate-400 text-sm mb-6", children: "This action cannot be undone." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setConfirmDelete(null), className: "btn-secondary flex-1", children: "Cancel" }), _jsx("button", { id: "confirm-delete-btn", onClick: () => handleDelete(confirmDelete), className: "flex-1 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors", children: "Delete" })] })] }) }))] }));
}
//# sourceMappingURL=AdminCoursesPage.js.map