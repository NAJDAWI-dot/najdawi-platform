import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@mos/shared';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, refreshToken, user } = await authService.login(email, password);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (err: any) {
          const msg = err.response?.data?.message;
          set({
            error: Array.isArray(msg) ? msg.join(', ') : msg || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, refreshToken, user } = await authService.register(payload);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (err: any) {
          const msg = err.response?.data?.message;
          set({
            error: Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mos-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
