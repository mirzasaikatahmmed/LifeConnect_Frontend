'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Phone, Heart, AlertCircle, Check } from 'lucide-react';
import Button from '@/components/Home/Button';
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
      { score: 0, label: 'Very Weak', color: 'red' },
      { score: 1, label: 'Weak', color: 'red' },
      { score: 2, label: 'Fair', color: 'yellow' },
      { score: 3, label: 'Good', color: 'blue' },
      { score: 4, label: 'Strong', color: 'green' },
      { score: 5, label: 'Very Strong', color: 'green' },
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
      {/* Loading Progress */}
      {(externalLoading ?? loading) && (
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div className="bg-red-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}

      {/* Error Alert */}
      {(externalError || error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{externalError || error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none',
                'transition-all duration-200',
                formErrors.name && 'border-red-300 bg-red-50'
              )}
              placeholder="Enter your full name"
              disabled={externalLoading ?? loading}
            />
          </div>
          {formErrors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.name}
            </p>
          )}
          {!formErrors.name && (
            <p className="text-gray-500 text-sm mt-1">This will be displayed as your name</p>
          )}
        </div>

        {/* Blood Type */}
        <div>
          <label htmlFor="bloodType" className="block text-sm font-semibold text-gray-700 mb-2">
            Blood Type *
          </label>
          <div className="relative">
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="bloodType"
              required
              value={formData.bloodType}
              onChange={(e) => handleInputChange('bloodType', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none',
                'transition-all duration-200 bg-white',
                formErrors.bloodType && 'border-red-300 bg-red-50'
              )}
              disabled={externalLoading ?? loading}
            >
              <option value="">Select your blood type</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type} ({type.includes('+') ? 'Positive' : 'Negative'})
                </option>
              ))}
            </select>
          </div>
          {formErrors.bloodType && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.bloodType}
            </p>
          )}
          {!formErrors.bloodType && (
            <p className="text-gray-500 text-sm mt-1">Required for medical emergency protocols</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none',
                'transition-all duration-200',
                formErrors.phoneNumber && 'border-red-300 bg-red-50'
              )}
              placeholder="+8801700000000"
              disabled={externalLoading ?? loading}
            />
          </div>
          {formErrors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.phoneNumber}
            </p>
          )}
          {!formErrors.phoneNumber && (
            <p className="text-gray-500 text-sm mt-1">Include country code for international numbers</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none',
                'transition-all duration-200',
                formErrors.email && 'border-red-300 bg-red-50'
              )}
              placeholder="example@domain.com"
              disabled={externalLoading ?? loading}
            />
          </div>
          {formErrors.email && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.email}
            </p>
          )}
          {!formErrors.email && (
            <p className="text-gray-500 text-sm mt-1">This will be your login email address</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                'w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none',
                'transition-all duration-200',
                formErrors.password && 'border-red-300 bg-red-50'
              )}
              placeholder="Create a strong password (min. 8 characters)"
              disabled={externalLoading ?? loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.password}
            </p>
          )}

          {/* Password Strength */}
          {formData.password && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className={cn(
                  'text-xs font-semibold px-2 py-1 rounded',
                  passwordStrength.color === 'red' && 'bg-red-100 text-red-800',
                  passwordStrength.color === 'yellow' && 'bg-yellow-100 text-yellow-800',
                  passwordStrength.color === 'blue' && 'bg-blue-100 text-blue-800',
                  passwordStrength.color === 'green' && 'bg-green-100 text-green-800'
                )}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-all duration-300',
                      i < passwordStrength.score
                        ? passwordStrength.color === 'red' ? 'bg-red-400'
                        : passwordStrength.color === 'yellow' ? 'bg-yellow-400'
                        : passwordStrength.color === 'blue' ? 'bg-blue-400'
                        : 'bg-green-400'
                        : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={cn(
                'w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded mt-1',
                'focus:ring-red-500 focus:ring-2',
                formErrors.terms && 'border-red-500'
              )}
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-red-600 hover:text-red-500 font-medium hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-red-600 hover:text-red-500 font-medium hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {formErrors.terms && (
            <p className="text-red-600 text-sm mt-1 flex items-center ml-7">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.terms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={(externalLoading ?? loading) || !acceptedTerms}
          >
            {(externalLoading ?? loading) ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Join LifeConnect</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-1">Donor Registration</h4>
            <p className="text-green-700 text-sm leading-relaxed">
              This registration creates a donor account with access to blood donation services.
              All information must be accurate for safety and verification purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200 hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}