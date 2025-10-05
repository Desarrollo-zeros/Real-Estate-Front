import { useUIStore } from '../store/useUIStore';

/**
 * Custom hook for toast notifications
 */
export const useToast = () => {
  const { showToast, toasts, removeToast } = useUIStore();

  return {
    toasts,
    success: (message: string, duration?: number) => showToast('success', message, duration),
    error: (message: string, duration?: number) => showToast('error', message, duration),
    warning: (message: string, duration?: number) => showToast('warning', message, duration),
    info: (message: string, duration?: number) => showToast('info', message, duration),
    remove: removeToast,
  };
};
