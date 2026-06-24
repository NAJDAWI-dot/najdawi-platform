import { create } from 'zustand';
import type { Course, PaginationMeta } from '@mos/shared';
import { coursesService, type CourseFilter } from '../services/courses.service';

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  meta: PaginationMeta | null;
  filter: CourseFilter;
  isLoading: boolean;
  error: string | null;

  fetchCourses: (filter?: CourseFilter) => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  setFilter: (filter: Partial<CourseFilter>) => void;
  createCourse: (payload: Partial<Course>) => Promise<Course>;
  updateCourse: (id: string, payload: Partial<Course>) => Promise<void>;
  togglePublish: (id: string) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  selectedCourse: null,
  meta: null,
  filter: { page: 1, limit: 12 },
  isLoading: false,
  error: null,

  fetchCourses: async (filter) => {
    const f = { ...get().filter, ...filter };
    set({ isLoading: true, error: null, filter: f });
    try {
      const result = await coursesService.getPublished(f);
      set({ courses: result.data, meta: result.meta, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load courses', isLoading: false });
    }
  },

  fetchCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const course = await coursesService.getById(id);
      set({ selectedCourse: course, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load course', isLoading: false });
    }
  },

  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),

  createCourse: async (payload) => {
    const course = await coursesService.create(payload);
    set((s) => ({ courses: [course, ...s.courses] }));
    return course;
  },

  updateCourse: async (id, payload) => {
    const updated = await coursesService.update(id, payload);
    set((s) => ({
      courses: s.courses.map((c) => (c.id === id ? updated : c)),
      selectedCourse: s.selectedCourse?.id === id ? updated : s.selectedCourse,
    }));
  },

  togglePublish: async (id) => {
    const updated = await coursesService.togglePublish(id);
    set((s) => ({
      courses: s.courses.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCourse: async (id) => {
    await coursesService.delete(id);
    set((s) => ({ courses: s.courses.filter((c) => c.id !== id) }));
  },

  clearError: () => set({ error: null }),
}));
