'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      verifyToken(resetToken);
    } else {
      setError('Invalid reset link');
      setTokenValid(false);
    }
  }, [searchParams]);

  const verifyToken = async (resetToken: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-reset-token`, {
        token: resetToken,
      });
      setTokenValid(response.data.valid);
      if (!response.data.valid) {
        setError(response.data.message || 'Invalid or expired reset link');
      }
    } catch (err: any) {
      setTokenValid(false);
      setError('Invalid or expired reset link');
    }
  };

  const handleResetPassword = async (password: string, confirmPassword: string): Promise<{ success: boolean; message?: string }> => {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        token,
        password,
      });

      if (response.data.success) {
        setTimeout(() => {
          router.push('/login?message=Password reset successful');
        }, 2000);
        return { success: true };
      } else {
        const errorMessage = response.data.message || 'Failed to reset password';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <AuthContainer title="Reset Password" subtitle="Verifying reset link...">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </AuthContainer>
    );
  }

  if (tokenValid === false) {
    return (
      <AuthContainer title="Invalid Link" subtitle="This reset link is invalid or has expired">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            The password reset link you used is invalid or has expired.
          </p>
          <Link
            href="/login/forgot-password"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm 
        onSubmit={handleResetPassword}
        loading={loading}
        error={error}
      />
    </AuthContainer>
  );
}