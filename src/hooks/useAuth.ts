import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canCreate,
    canUpdate,
    canDelete,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canCreate: canCreate(),
    canUpdate: canUpdate(),
    canDelete: canDelete(),
  };
};

/**
 * Hook to check if user has required role
 */
export const useRequireRole = (requiredRole: UserRole): boolean => {
  const { hasRole } = useAuthStore();
  return hasRole(requiredRole);
};

/**
 * Hook to check if user has any of the required roles
 */
export const useRequireAnyRole = (requiredRoles: UserRole[]): boolean => {
  const { hasAnyRole } = useAuthStore();
  return hasAnyRole(requiredRoles);
};
