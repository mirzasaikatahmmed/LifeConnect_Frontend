'use client';

import { useState } from 'react';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError('');
    setSuccess(false);

    // Since backend doesn't have forgot password endpoints yet, 
    // we'll simulate the process for now
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, always show success message
      // TODO: Replace with actual backend call when forgot-password endpoint is implemented
      setSuccess(true);
      return { success: true };
      
      /* Future implementation:
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        email,
      });

      if (response.data.success) {
        setSuccess(true);
        return { success: true };
      } else {
        const errorMessage = response.data.message || 'Failed to send reset email';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
      */
    } catch (err: any) {
      const errorMessage = 'Password reset functionality is not yet implemented on the server. Please contact your administrator.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Reset Password"
      subtitle="We'll send you a link to reset your password"
    >
      <ForgotPasswordForm 
        onSubmit={handleForgotPassword}
        loading={loading}
        error={error}
        success={success}
      />
    </AuthContainer>
  );
}