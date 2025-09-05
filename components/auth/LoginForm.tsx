'use client';

import { useState } from 'react';
import { Typography, IconButton, Alert, LinearProgress } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export default function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      onSubmit(formData.email, formData.password);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <LinearProgress className="rounded-full" />
      )}
      
      {error && (
        <Alert 
          severity="error" 
          className={cn(
            'rounded-lg border-l-4 border-red-500',
            'animate-slide-up'
          )}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            startIcon={<Email />}
            placeholder="Enter your email address"
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={loading}
            className={cn(
              'transition-all duration-200',
              formErrors.email && 'animate-bounce-gentle'
            )}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            startIcon={<Lock />}
            endIcon={
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
                className="hover:bg-gray-100 transition-colors"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
            placeholder="Enter your password"
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={loading}
            className={cn(
              'transition-all duration-200',
              formErrors.password && 'animate-bounce-gentle'
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className={cn(
                'w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded',
                'focus:ring-primary-500 focus:ring-2'
              )}
            />
            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>
          
          <a
            href="/login/forgot-password"
            className={cn(
              'text-sm text-primary-600 hover:text-primary-500',
              'font-medium transition-colors duration-200',
              'hover:underline'
            )}
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Typography variant="body2" className="text-gray-600">
          Don't have an account?{' '}
          <a
            href="/register"
            className={cn(
              'text-primary-600 hover:text-primary-500 font-medium',
              'transition-colors duration-200 hover:underline'
            )}
          >
            Sign up here
          </a>
        </Typography>
      </div>
    </div>
  );
}