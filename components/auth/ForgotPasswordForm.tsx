'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Typography, Alert, LinearProgress } from '@mui/material';
import { Email, ArrowBack, Send } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<{ success: boolean; message?: string }>;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export default function ForgotPasswordForm({ onSubmit, loading = false, error, success }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }

    setFormError('');
    const result = await onSubmit(email);
    
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formError) {
      setFormError('');
    }
  };

  if (isSubmitted || success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <Typography variant="h5" className="font-semibold text-gray-800">
            Check Your Email
          </Typography>
          <Typography variant="body1" className="text-gray-600 leading-relaxed">
            We've sent a password reset link to{' '}
            <span className="font-medium text-gray-800">{email}</span>
          </Typography>
        </div>

        <Alert severity="info" className="text-left">
          <Typography variant="body2">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="text-blue-600 hover:text-blue-500 underline font-medium"
            >
              try again
            </button>
          </Typography>
        </Alert>

        <div className="pt-4">
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
            >
              <ArrowBack className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>
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

      <div className="text-center space-y-2">
        <Typography variant="body1" className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={handleChange}
            startIcon={<Email className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
            placeholder="Enter your email address"
            error={!!formError}
            helperText={formError}
            disabled={loading}
            className={cn(
              'transition-all duration-300',
              'focus-within:scale-[1.02] focus-within:shadow-lg',
              'hover:shadow-md',
              formError && 'animate-bounce-gentle'
            )}
            autoFocus
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !email}
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
              <span className="font-semibold">Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span className="font-semibold text-white drop-shadow-sm">Send Reset Link</span>
            </div>
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