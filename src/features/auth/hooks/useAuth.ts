'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/api/authService';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if(response.user){
      localStorage.setItem('user', JSON.stringify(response.user));
      setAuth({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        expiresAt: response.expiresAt,
      });
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    clearAuth();
    router.push('/login');
  };

  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role as any);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles.includes(role as any));
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
}
