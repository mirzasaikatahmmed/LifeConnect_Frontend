'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import RegisterForm from '@/components/auth/RegisterForm';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (response.data.success) {
        // Redirect to login or verification page
        router.push('/login?message=Registration successful! Please sign in.');
      } else {
        setError(response.data.message || 'Registration failed');
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

  return (
    <AuthContainer
      title="Create Your Account"
      subtitle="Join LifeConnect and start building meaningful connections"
    >
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </AuthContainer>
  );
}