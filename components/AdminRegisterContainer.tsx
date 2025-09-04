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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin-register`, adminData);
      setMessage('Admin registered successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred during registration');
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