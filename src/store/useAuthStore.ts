import { create } from 'zustand';
import { authService } from '../services/api';
import type { User, UserRole, LoginRequest } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setAuth: (auth: { user?: User; token: string; isAuthenticated: boolean ; expiresAt: string }) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  checkAuth: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canCreate: () => boolean;
  canUpdate: () => boolean;
  canDelete: () => boolean;
}

/**
 * Authentication Store using Zustand
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login user
   */
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const user = authService.getCurrentUser();
      const token = response.token || null;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    document.cookie = 'realestate_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  },

  /**
   * Set authentication state directly
   */
  setAuth: (auth) => {
    set({
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      error: null,
    });
    // Set cookie with proper formatting
    const expiresDate = new Date(auth.expiresAt).toUTCString();
    document.cookie = `realestate_auth_token=${auth.token}; path=/; expires=${expiresDate}; SameSite=Lax`;
  },

  /**
   * Update user profile information
   */
  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedFields };
      set({ user: updatedUser });
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  /**
   * Clear authentication state
   */
  clearAuth: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    document.cookie = 'realestate_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  },

  /**
   * Check if user is authenticated (on app load)
   */
  checkAuth: () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    const token = authService.getToken() || null;

    set({
      user: isAuthenticated ? user : null,
      token: isAuthenticated ? token : null,
      isAuthenticated,
    });
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: UserRole) => {
    const { user } = get();
    return user?.roles.includes(role) ?? false;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role));
  },

  /**
   * Check if user can create resources
   */
  canCreate: () => {
    return get().hasAnyRole(['Admin', 'Editor']);
  },

  /**
   * Check if user can update resources
   */
  canUpdate: () => {
    return get().hasAnyRole(['Admin', 'Editor']);
  },

  /**
   * Check if user can delete resources
   */
  canDelete: () => {
    return get().hasRole('Admin');
  },
}));
