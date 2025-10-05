import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToastMessage } from '../types';
import { generateId } from '../utils/helpers';
import { TOAST_DURATION, THEME_STORAGE_KEY } from '../utils/constants';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  isLoading: boolean;
  loadingMessage: string | null;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showToast: (
    type: ToastMessage['type'],
    message: string,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

/**
 * UI Store using Zustand with persistence
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: true,
      toasts: [],
      isLoading: false,
      loadingMessage: null,

      /**
       * Toggle theme between light and dark
       */
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      /**
       * Toggle sidebar open/closed
       */
      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        }));
      },

      /**
       * Set sidebar open state
       */
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      /**
       * Show toast notification
       */
      showToast: (type: ToastMessage['type'], message: string, duration?: number) => {
        const id = generateId();
        const toast: ToastMessage = {
          id,
          type,
          message,
          duration: duration || TOAST_DURATION[type.toUpperCase() as keyof typeof TOAST_DURATION],
        };

        set((state) => ({
          toasts: [...state.toasts, toast],
        }));

        // Auto remove toast after duration
        if (toast.duration) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration);
        }
      },

      /**
       * Remove toast by ID
       */
      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      /**
       * Set global loading state
       */
      setLoading: (isLoading: boolean, message?: string) => {
        set({
          isLoading,
          loadingMessage: message || null,
        });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);
