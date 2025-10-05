'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Building2, CheckCircle } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowRegisteredMessage(true);
      setTimeout(() => setShowRegisteredMessage(false), 5000);
    }
  }, [searchParams]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await login(email, password);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        // Cookie is now set by the backend via Set-Cookie header
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Extract error message from normalized error
      const errorMessage = err?.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Real Estate Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Success Message */}
        {showRegisteredMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p>Registration successful! Please sign in with your credentials.</p>
          </div>
        )}

        {/* Login Form */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          © 2025 Real Estate Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
