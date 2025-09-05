'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Store token or user data as needed
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard'); // or wherever you want to redirect
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to your LifeConnect account to continue"
    >
      <LoginForm 
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </AuthContainer>
  );
}