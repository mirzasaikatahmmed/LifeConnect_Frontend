'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Typography, Alert, LinearProgress, IconButton } from '@mui/material';
import { Lock, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ResetPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
  loading?: boolean;
  error?: string;
}

export default function ResetPasswordForm({ onSubmit, loading = false, error }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      const result = await onSubmit(formData.password, formData.confirmPassword);
      if (result.success) {
        setSuccess(true);
      }
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

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <Typography variant="h5" className="font-semibold text-gray-800">
            Password Reset Successful!
          </Typography>
          <Typography variant="body1" className="text-gray-600 leading-relaxed">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </Typography>
        </div>

        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

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
        <div className="space-y-5">
          <div className="relative group">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              startIcon={<Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
              endIcon={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  className={cn(
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50",
                    "transition-all duration-200 rounded-full"
                  )}
                >
                  {showPassword ? 
                    <VisibilityOff className="text-gray-400 hover:text-purple-500 transition-colors" /> : 
                    <Visibility className="text-gray-400 hover:text-purple-500 transition-colors" />
                  }
                </IconButton>
              }
              placeholder="Enter your new password"
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              className={cn(
                'transition-all duration-300',
                'focus-within:scale-[1.02] focus-within:shadow-lg',
                'hover:shadow-md',
                formErrors.password && 'animate-bounce-gentle'
              )}
            />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        passwordStrength >= level 
                          ? passwordStrength <= 2 
                            ? "bg-red-400" 
                            : passwordStrength <= 3 
                              ? "bg-yellow-400" 
                              : "bg-green-400"
                          : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
                <Typography variant="caption" className="text-gray-600">
                  {passwordStrength <= 2 && "Weak"}
                  {passwordStrength === 3 && "Fair"}
                  {passwordStrength === 4 && "Good"}
                  {passwordStrength === 5 && "Strong"}
                </Typography>
              </div>
            )}
          </div>

          <div className="relative group">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              startIcon={<Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
              endIcon={
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                  className={cn(
                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50",
                    "transition-all duration-200 rounded-full"
                  )}
                >
                  {showConfirmPassword ? 
                    <VisibilityOff className="text-gray-400 hover:text-purple-500 transition-colors" /> : 
                    <Visibility className="text-gray-400 hover:text-purple-500 transition-colors" />
                  }
                </IconButton>
              }
              placeholder="Confirm your new password"
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading}
              className={cn(
                'transition-all duration-300',
                'focus-within:scale-[1.02] focus-within:shadow-lg',
                'hover:shadow-md',
                formErrors.confirmPassword && 'animate-bounce-gentle'
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !formData.password || !formData.confirmPassword}
          className={cn(
            "w-full relative overflow-hidden",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "hover:from-blue-700 hover:to-purple-700",
            "transform hover:scale-105 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-semibold">Resetting Password...</span>
            </div>
          ) : (
            <span className="font-semibold text-white drop-shadow-sm">Reset Password</span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Typography variant="body2" className="text-gray-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className={cn(
              'text-blue-600 hover:text-blue-500 font-medium',
              'transition-colors duration-200 hover:underline'
            )}
          >
            Sign in here
          </Link>
        </Typography>
      </div>
    </div>
  );
}