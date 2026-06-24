import { create } from 'zustand';
import type { Enrollment } from '@mos/shared';
import { enrollmentsService } from '../services/enrollments.service';

interface EnrollmentState {
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;

  fetchMyEnrollments: () => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
  drop: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, progress: number, completedItemId?: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  clearError: () => void;
}

export const useEnrollmentStore = create<EnrollmentState>((set, get) => ({
  enrollments: [],
  isLoading: false,
  error: null,

  fetchMyEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const enrollments = await enrollmentsService.getMyEnrollments();
      set({ enrollments, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load enrollments', isLoading: false });
    }
  },

  enroll: async (courseId) => {
    const enrollment = await enrollmentsService.enroll(courseId);
    set((s) => ({ enrollments: [...s.enrollments, enrollment] }));
  },

  drop: async (courseId) => {
    await enrollmentsService.drop(courseId);
    set((s) => ({
      enrollments: s.enrollments.filter((e) => e.courseId !== courseId),
    }));
  },

  updateProgress: async (courseId, progress, completedItemId) => {
    const updated = await enrollmentsService.updateProgress(courseId, progress, completedItemId);
    set((s) => ({
      enrollments: s.enrollments.map((e) =>
        e.courseId === courseId ? updated : e,
      ),
    }));
  },

  isEnrolled: (courseId) => {
    const { enrollments } = get();
    return enrollments.some((e) => e.courseId === courseId && e.status === 'active');
  },

  clearError: () => set({ error: null }),
}));
