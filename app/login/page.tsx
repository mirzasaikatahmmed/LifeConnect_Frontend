'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthContainer from '@/components/common/AuthContainer';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError('');

    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      // Redirect to dashboard or admin panel
      router.push('/admin/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
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