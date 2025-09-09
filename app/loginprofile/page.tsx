"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Heart, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  // Axios configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await api.post<LoginResponse>('/manager/managerUserlogin', {
        email: data.email,
        password: data.password,
      });

      // Store JWT token and user info in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on user role
      redirectToDashboard(response.data.user.role);
      
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Login failed';
        setLoginError(message);
      } else {
        setLoginError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        window.location.href = '/manager';
        break;
      case 'admin':
        window.location.href = '/admin-dashboard';
        break;
      case 'donor':
        window.location.href = '/donor-dashboard';
        break;
      default:
        window.location.href = '/dashboard';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-red-500 mr-2 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-800">LifeConnect</h1>
          </div>
          <p className="text-gray-600 text-sm">Connecting donors, saving lives</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center text-sm">Please sign in to your account</p>
          </div>

          <div onSubmit={handleFormSubmit}>
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please provide a valid email address'
                    }
                  })}
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Login Error */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center text-sm text-red-800">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleFormSubmit}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
              >
                Forgot your password?
              </a>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <a
                href="/register"
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
              >
                Sign up here
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 LifeConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;