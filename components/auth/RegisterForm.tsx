'use client';

import { useState } from 'react';
import { Typography, IconButton, Alert, LinearProgress, Chip } from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, Phone } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  loading?: boolean;
  error?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function RegisterForm({ onSubmit, loading = false, error }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengths = [
      { score: 0, label: 'Very Weak', color: 'error' },
      { score: 1, label: 'Weak', color: 'error' },
      { score: 2, label: 'Fair', color: 'warning' },
      { score: 3, label: 'Good', color: 'info' },
      { score: 4, label: 'Strong', color: 'success' },
      { score: 5, label: 'Very Strong', color: 'success' },
    ];

    return strengths[score];
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak. Please use a stronger password';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptedTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {loading && <LinearProgress className="rounded-full" />}
      
      {error && (
        <Alert severity="error" className="rounded-lg border-l-4 border-red-500 animate-slide-up">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            startIcon={<Person />}
            placeholder="Enter your first name"
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            disabled={loading}
          />
          
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            startIcon={<Person />}
            placeholder="Enter your last name"
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            disabled={loading}
          />
        </div>

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
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          startIcon={<Phone />}
          placeholder="Enter your phone number"
          error={!!formErrors.phone}
          helperText={formErrors.phone}
          disabled={loading}
        />

        <div className="space-y-2">
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
            placeholder="Create a strong password"
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={loading}
          />
          
          {formData.password && (
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2 w-6 rounded-full transition-colors duration-300',
                      i < passwordStrength.score
                        ? passwordStrength.color === 'error' ? 'bg-red-400'
                        : passwordStrength.color === 'warning' ? 'bg-yellow-400'
                        : passwordStrength.color === 'info' ? 'bg-blue-400'
                        : 'bg-green-400'
                        : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
              <Chip
                label={passwordStrength.label}
                size="small"
                color={passwordStrength.color as any}
                variant="outlined"
                className="text-xs"
              />
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          startIcon={<Lock />}
          endIcon={
            <IconButton
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              edge="end"
              size="small"
              className="hover:bg-gray-100 transition-colors"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          }
          placeholder="Confirm your password"
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
          disabled={loading}
        />

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={cn(
                'w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded mt-0.5',
                'focus:ring-primary-500 focus:ring-2',
                formErrors.terms && 'border-red-500'
              )}
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-500 font-medium hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500 font-medium hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {formErrors.terms && (
            <Typography variant="body2" className="text-red-600 text-sm ml-7">
              {formErrors.terms}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !acceptedTerms}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Typography variant="body2" className="text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className={cn(
              'text-primary-600 hover:text-primary-500 font-medium',
              'transition-colors duration-200 hover:underline'
            )}
          >
            Sign in here
          </a>
        </Typography>
      </div>
    </div>
  );
}