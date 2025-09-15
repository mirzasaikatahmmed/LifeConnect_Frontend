'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultDashboardPath } from '@/lib/authUtils';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  bloodType: string;
  roleId: number;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role) {
      console.log('User already authenticated, redirecting to dashboard');
      const dashboardPath = getDefaultDashboardPath(user.role);
      router.replace(dashboardPath);
    }
  }, [isAuthenticated, user, authLoading, router]);

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, data);

      if (response.data) {
        // Redirect to login or verification page
        router.push('/login?message=Registration successful! Please sign in.');
      } else {
        setError('Registration failed');
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('An account with this email already exists. Please try signing in instead.');
      } else {
        setError(
          err.response?.data?.message || 
          'Network error. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication or redirecting
  if (authLoading || (isAuthenticated && user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Loading...' : 'Redirecting to dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContainer
      title="Join LifeConnect"
      subtitle="Register as a blood donor and help save lives in your community"
    >
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </AuthContainer>
  );
}