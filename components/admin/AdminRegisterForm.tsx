'use client';

import { useState } from 'react';
import { Typography, IconButton, Alert, LinearProgress, MenuItem, Chip } from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, Phone, Bloodtype } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AdminData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  bloodType: string;
  roleId: number;
}

interface AdminRegisterFormProps {
  onSubmit: (adminData: AdminData) => void;
  isLoading: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  bloodType?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function AdminRegisterForm({ onSubmit, isLoading }: AdminRegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bloodType: '',
    roleId: 1
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-8">
      {isLoading && (
        <LinearProgress 
          className="rounded-full" 
          sx={{
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#667eea'
            }
          }}
        />
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
            error={!!errors.name}
            helperText={errors.name || "This will be displayed as your admin name"}
            disabled={isLoading}
            className={cn(
              'transition-all duration-200',
              errors.name && 'animate-bounce-gentle'
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
            error={!!errors.bloodType}
            helperText={errors.bloodType || "Required for medical emergency protocols"}
            disabled={isLoading}
            className={cn(
              'transition-all duration-200',
              errors.bloodType && 'animate-bounce-gentle'
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
            placeholder="+1 (555) 123-4567"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber || "Include country code for international numbers"}
            disabled={isLoading}
            className={cn(
              'transition-all duration-200',
              errors.phoneNumber && 'animate-bounce-gentle'
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
            placeholder="admin@lifeconnect.com"
            error={!!errors.email}
            helperText={errors.email || "This will be your login email address"}
            disabled={isLoading}
            className={cn(
              'transition-all duration-200',
              errors.email && 'animate-bounce-gentle'
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
            error={!!errors.password}
            helperText={errors.password || "Must contain uppercase, lowercase, number, and special character"}
            disabled={isLoading}
            className={cn(
              'transition-all duration-200',
              errors.password && 'animate-bounce-gentle'
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

        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className={cn(
              "w-full h-14 text-lg font-bold tracking-wide text-white",
              "bg-emerald-600 hover:bg-emerald-700",
              "border-2 border-emerald-500 hover:border-emerald-600",
              "rounded-xl transition-all duration-300 ease-in-out",
              "transform hover:-translate-y-1 hover:scale-105",
              "relative overflow-hidden group",
              "focus:ring-4 focus:ring-emerald-300 focus:outline-none"
            )}
          >
            {/* Animated background shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {isLoading ? (
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">Creating Administrator Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <span className="flex items-center space-x-2">
                  <span>Register Administrator</span>
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
        'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary-500',
        'p-5 rounded-xl shadow-soft'
      )}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Typography variant="body2" className="text-white font-bold text-sm">
              ⚡
            </Typography>
          </div>
          <div className="flex-1">
            <Typography variant="body1" className="text-primary-800 font-semibold mb-1">
              Administrator Privileges
            </Typography>
            <Typography variant="body2" className="text-primary-700 leading-relaxed">
              This registration creates an admin account with elevated system privileges. 
              All information must be accurate and will be verified before activation.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}