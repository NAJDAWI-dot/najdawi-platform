import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../stores/courseStore';
import type { Course } from '@mos/shared';
import { CourseModal } from './CourseModal';
import { AdminNav } from '../../components/layout/AdminNav';

export function AdminCoursesPage() {
  const { courses, isLoading, togglePublish, deleteCourse } = useCourseStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
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

  const handleToggle = async (id: string) => {
    await togglePublish(id);
  };

  const handleDelete = async (id: string) => {
    await deleteCourse(id);
    setConfirmDelete(null);
  };

  const openNewCourse = () => {
    setEditingCourse({});
    setIsModalOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleModalSaved = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    loadCourses(); // Refresh list
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <AdminNav />
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Manage Courses</h1>
          <p className="page-subtitle">Create, edit, and publish courses</p>
        </div>
        <button
          id="create-course-btn"
          onClick={openNewCourse}
          className="btn-primary"
        >
          + New Course
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Module</th>
              <th>Level</th>
              <th>Exam Code</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" />
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-8">No courses yet</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="font-medium text-white max-w-[200px] truncate">{course.title}</td>
                  <td className="capitalize">{course.module}</td>
                  <td className="capitalize">{course.level}</td>
                  <td>{course.examCode}</td>
                  <td>{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                  <td>
                    <button
                      id={`toggle-publish-${course.id}`}
                      onClick={() => handleToggle(course.id)}
                      className={`badge cursor-pointer transition-colors ${
                        course.isPublished
                          ? 'badge-green hover:bg-red-900/40 hover:text-red-300 hover:border-red-800'
                          : 'badge-yellow hover:badge-green'
                      }`}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/admin/courses/${course.id}/content`}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          Manage Content
                        </Link>
                        <Link
                          to={`/admin/courses/${course.id}/submissions`}
                          className="btn-secondary py-1.5 px-3 text-xs border-blue-800 text-blue-400 hover:bg-blue-900/30"
                        >
                          Grade Submissions
                        </Link>
                      </div>
                      <button
                        id={`edit-course-${course.id}`}
                        onClick={() => openEditCourse(course)}
                        className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        id={`delete-course-${course.id}`}
                        onClick={() => setConfirmDelete(course.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CourseModal
          course={editingCourse}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleModalSaved}
        />
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete course?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
