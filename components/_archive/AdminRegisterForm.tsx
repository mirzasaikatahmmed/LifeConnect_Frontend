'use client';

import { useState } from 'react';

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
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber) || formData.phoneNumber.replace(/\D/g, '').length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Blood type validation
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!formData.bloodType.trim()) {
      newErrors.bloodType = 'Blood type is required';
    } else if (!validBloodTypes.includes(formData.bloodType)) {
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
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Enter full name"
          disabled={isLoading}
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="bloodType" className="form-label">Blood Type</label>
        <select
          id="bloodType"
          value={formData.bloodType}
          onChange={(e) => handleInputChange('bloodType', e.target.value)}
          className={`form-input ${errors.bloodType ? 'error' : ''}`}
          disabled={isLoading}
        >
          <option value="">Select blood type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        {errors.bloodType && <div className="form-error">{errors.bloodType}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
          placeholder="+1555123456"
          disabled={isLoading}
        />
        {errors.phoneNumber && <div className="form-error">{errors.phoneNumber}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter email address"
          disabled={isLoading}
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Create a strong password"
          disabled={isLoading}
        />
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>
      
      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register Admin'}
      </button>
    </form>
  );
}