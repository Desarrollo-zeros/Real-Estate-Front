'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { authService } from '@/services/api/authService';
import { Building2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
    name: string,
    roles: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register({
        username,
        email,
        password,
        name,
        roles,
      });

      // Redirect to login after successful registration
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Register to start managing real estate properties
          </p>
        </div>

        {/* Register Form */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
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
