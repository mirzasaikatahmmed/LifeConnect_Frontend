'use client';

import { useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import AuthContainer from '@/components/common/AuthContainer';
import AdminRegisterForm from './AdminRegisterForm';
import { cn } from '@/lib/utils';

interface AdminData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  bloodType: string;
  roleId: number;
}

export default function AdminRegisterContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  const handleAdminRegister = async (adminData: AdminData) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Registering admin with data:', adminData);
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/admin-register`);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin-register`, adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Registration successful:', response.data);
      setMessage('Admin registered successfully! Welcome to the LifeConnect administration team.');
      setMessageType('success');
      
      // Optionally redirect after success
      // setTimeout(() => {
      //   window.location.href = '/admin/dashboard';
      // }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = '';
      
      if (error.response?.status === 404) {
        errorMessage = 'Registration endpoint not found. Please check if the backend server is running.';
      } else if (error.response?.status === 409) {
        errorMessage = 'An admin with this email already exists. Please use a different email address.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else {
        errorMessage = error.response?.data?.message || 'An unexpected error occurred during registration.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Admin Registration"
      subtitle="Create an administrator account for LifeConnect platform"
      className="max-w-lg"
    >
      <div className="space-y-6">
        {message && (
          <Alert 
            severity={messageType}
            className={cn(
              'rounded-lg border-l-4',
              messageType === 'success' ? 'border-green-500' : 'border-red-500',
              'animate-slide-up'
            )}
          >
            <AlertTitle className="font-semibold">
              {messageType === 'success' ? 'Registration Successful!' : 'Registration Failed'}
            </AlertTitle>
            {message}
          </Alert>
        )}

        <AdminRegisterForm 
          onSubmit={handleAdminRegister} 
          isLoading={isLoading} 
        />
      </div>
    </AuthContainer>
  );
}