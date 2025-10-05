'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeProvider as ColorThemeProvider } from '@/contexts/ThemeContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { GlobalLoadingOverlay } from '@/components/loading/GlobalLoadingOverlay';
import { LoadingInitializer } from '@/components/loading/LoadingInitializer';

/**
 * Auth Initializer - Check authentication on app load
 */
function AuthInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LoadingProvider>
        <ColorThemeProvider>
          <AuthInitializer />
          <LoadingInitializer />
          {children}
          <GlobalLoadingOverlay />
          <ToastContainer />
          <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        </ColorThemeProvider>
      </LoadingProvider>
    </NextThemesProvider>
  );
}
