'use client';

import { useState } from 'react';
import axios from 'axios';
import AdminRegisterForm from './AdminRegisterForm';

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
      setMessage('Admin registered successfully!');
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 404) {
        setMessage('Registration endpoint not found. Please check if the backend server is running.');
      } else if (error.response?.status >= 500) {
        setMessage('Server error occurred. Please try again later.');
      } else {
        setMessage(error.response?.data?.message || 'An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Admin Registration</h1>
        <AdminRegisterForm onSubmit={handleAdminRegister} isLoading={isLoading} />
        {message && (
          <div className={`auth-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}