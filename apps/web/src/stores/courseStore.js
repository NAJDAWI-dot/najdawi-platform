import { create } from 'zustand';
import { coursesService } from '../services/courses.service';
export const useCourseStore = create((set, get) => ({
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
        }
        catch (err) {
            set({ error: err.response?.data?.message || 'Failed to load courses', isLoading: false });
        }
    },
    fetchCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const course = await coursesService.getById(id);
            set({ selectedCourse: course, isLoading: false });
        }
        catch (err) {
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
//# sourceMappingURL=courseStore.js.map