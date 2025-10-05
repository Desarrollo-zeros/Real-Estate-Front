import { apiClient } from './apiClient';
import {
  API_ENDPOINTS,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  TOKEN_EXPIRY_KEY,
} from '../../utils/constants';
import type { AuthToken, LoginRequest, User } from '../../types';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login and get JWT token
   */
  async login(credentials: LoginRequest): Promise<AuthToken> {
    const response = await apiClient.post<AuthToken>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    // Store token and user info
    this.setToken(response.token);
    if (response.expiresAt && response.expiresAt !== 'null' && response.expiresAt !== 'undefined') {
      this.setTokenExpiry(response.expiresAt);
    }
    if (response.user) {
      this.setUser(response.user);
    }

    return response;
  },

  /**
   * Register a new user
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    roles: string[];
  }): Promise<{ userId: string; message: string }> {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.BY_ID(userId));
  },

  /**
   * Get user by email (Admin only)
   */
  async getUserByEmail(email: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.BY_EMAIL(email));
  },

  /**
   * Logout - clear stored data and cookie via backend
   */
  async logout(): Promise<void> {
    try {
      // Call backend to clear the HttpOnly cookie
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local cleanup even if backend call fails
      console.error('Logout backend call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiry = this.getTokenExpiry();

    if (!token || !expiry) return false;

    // Check if token is expired
    return new Date(expiry) > new Date();
  },

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Set token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  /**
   * Get token expiry
   */
  getTokenExpiry(): string | null {
    return localStorage.getItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Set token expiry
   */
  setTokenExpiry(expiry: string): void {
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry);
  },

  /**
   * Set user info
   */
  setUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes(role as never) ?? false;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role as never));
  },
};
