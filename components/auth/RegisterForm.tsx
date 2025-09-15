'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Typography, IconButton, Alert, LinearProgress, MenuItem, Chip } from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, Phone, Bloodtype } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  onSubmit?: (data: RegisterData) => Promise<void>;
  loading?: boolean;
  error?: string;
  onSuccess?: (data: RegisterData) => void;
  onError?: (error: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  bloodType: string;
  roleId: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  bloodType?: string;
  terms?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function RegisterForm({ onSubmit, loading: externalLoading, error: externalError, onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bloodType: '',
    roleId: 3
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name must contain only letters and spaces';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }

    // Phone number validation
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber) || formData.phoneNumber.replace(/\D/g, '').length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number (min 10 digits)';
    }

    // Blood type validation
    if (!formData.bloodType.trim()) {
      newErrors.bloodType = 'Blood type is required';
    } else if (!bloodTypes.includes(formData.bloodType)) {
      newErrors.bloodType = 'Please select a valid blood type';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentLoading = externalLoading ?? loading;
    if (validateForm() && !currentLoading) {
      if (onSubmit) {
        // Use external onSubmit handler
        try {
          await onSubmit(formData);
        } catch (err: any) {
          // Error handling is done by parent component
        }
      } else {
        // Use internal logic
        setLoading(true);
        setError('');

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.data) {
            onSuccess?.(formData);
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed. Please try again.';
          setError(errorMessage);
          onError?.(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {(externalLoading ?? loading) && <LinearProgress className="rounded-full" />}

      {(externalError || error) && (
        <Alert severity="error" className="rounded-lg border-l-4 border-red-500 animate-slide-up">
          {externalError || error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            startIcon={<Person />}
            placeholder="Enter your full name (e.g., John Smith)"
            error={!!formErrors.name}
            helperText={formErrors.name || "This will be displayed as your name"}
            disabled={externalLoading ?? loading}
            className={cn(
              'transition-all duration-200',
              formErrors.name && 'animate-bounce-gentle'
            )}
          />
        </div>

        <div className="space-y-1">
          <Input
            label="Blood Type"
            select
            required
            value={formData.bloodType}
            onChange={(e) => handleInputChange('bloodType', e.target.value)}
            startIcon={<Bloodtype />}
            error={!!formErrors.bloodType}
            helperText={formErrors.bloodType || "Required for medical emergency protocols"}
            disabled={externalLoading ?? loading}
            className={cn(
              'transition-all duration-200',
              formErrors.bloodType && 'animate-bounce-gentle'
            )}
          >
            <MenuItem value="">
              <em className="text-gray-400">Select your blood type</em>
            </MenuItem>
            {bloodTypes.map((type) => (
              <MenuItem key={type} value={type} className="hover:bg-primary-50 py-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                  )}>
                    {type}
                  </div>
                  <span className="font-medium">{type}</span>
                  <span className="text-gray-500 text-sm">
                    ({type.includes('+') ? 'Positive' : 'Negative'})
                  </span>
                </div>
              </MenuItem>
            ))}
          </Input>
        </div>

        <div className="space-y-1">
          <Input
            label="Phone Number"
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            startIcon={<Phone />}
            placeholder="+8801700000000"
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber || "Include country code for international numbers"}
            disabled={externalLoading ?? loading}
            className={cn(
              'transition-all duration-200',
              formErrors.phoneNumber && 'animate-bounce-gentle'
            )}
          />
        </div>

        <div className="space-y-1">
          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            startIcon={<Email />}
            placeholder="example@domain.com"
            error={!!formErrors.email}
            helperText={formErrors.email || "This will be your login email address"}
            disabled={externalLoading ?? loading}
            className={cn(
              'transition-all duration-200',
              formErrors.email && 'animate-bounce-gentle'
            )}
          />
        </div>

        <div className="space-y-3">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
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
            placeholder="Create a strong password (min. 8 characters)"
            error={!!formErrors.password}
            helperText={formErrors.password || "Must contain uppercase, lowercase, number, and special character"}
            disabled={externalLoading ?? loading}
            className={cn(
              'transition-all duration-200',
              formErrors.password && 'animate-bounce-gentle'
            )}
          />

          {formData.password && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Typography variant="body2" className="text-gray-600 font-medium">
                  Password Strength
                </Typography>
                <Chip
                  label={passwordStrength.label}
                  size="small"
                  color={passwordStrength.color as any}
                  variant="outlined"
                  className="text-xs font-medium"
                />
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-all duration-300',
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
            </div>
          )}
        </div>

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
              <Link href="/terms" className="text-primary-600 hover:text-primary-500 font-medium hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500 font-medium hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {formErrors.terms && (
            <Typography variant="body2" className="text-red-600 text-sm ml-7">
              {formErrors.terms}
            </Typography>
          )}
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={(externalLoading ?? loading) || !acceptedTerms}
            className={cn(
              "w-full h-14 text-lg font-bold tracking-wide text-white",
              "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
              "hover:from-blue-700 hover:via-purple-700 hover:to-pink-700",
              "border-2 border-blue-500 hover:border-purple-600",
              "rounded-xl transition-all duration-300 ease-in-out",
              "transform hover:-translate-y-1 hover:scale-105",
              "relative overflow-hidden group",
              "focus:ring-4 focus:ring-blue-300 focus:outline-none"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

            {(externalLoading ?? loading) ? (
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">Creating User Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <span className="flex items-center space-x-2">
                  <span>Create Account</span>
                </span>
                <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-200">
                  <span className="text-xl">→</span>
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )}
          </Button>
        </div>
      </form>

      <div className={cn(
        'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500',
        'p-5 rounded-xl shadow-soft'
      )}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Typography variant="body2" className="text-white font-bold text-sm">
              👤
            </Typography>
          </div>
          <div className="flex-1">
            <Typography variant="body1" className="text-green-800 font-semibold mb-1">
              User Account Registration
            </Typography>
            <Typography variant="body2" className="text-green-700 leading-relaxed">
              This registration creates a user account with standard access privileges.
              All information must be accurate for your safety and security.
            </Typography>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Typography variant="body2" className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className={cn(
              'text-primary-600 hover:text-primary-500 font-medium',
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