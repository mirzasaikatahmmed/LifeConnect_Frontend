"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Heart, User, Mail, Lock, Phone, Droplet, UserCheck } from 'lucide-react';
import { z } from 'zod';
import axios from 'axios';

const signupSchema = z.object({
  name: z
    .string().nonempty("Name is required")
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and space)" })
    .trim(),
  
  email: z
    .string().nonempty("Email is required")
    .email({ message: "Please provide a valid email address" })
    .trim(),
  
  password: z
    .string().nonempty("Password is required")
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
    .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
    .regex(/(?=.*\d)/, { message: "Password must contain at least one number" })
    .regex(/(?=.*[@$!%*?&])/, { message: "Password must contain at least one symbol (@$!%*?&)" }),
  
  phoneNumber: z
    .string().nonempty("phone number is required")
    .min(1, { message: "Phone number is required" })
    .trim(),
  
  bloodType: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
      message: "Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-"
    })
    .optional()
    .or(z.literal('')), 
  
  userType: z.literal('donor'), 
  
  roleId: z
    .number()
    .int({ message: "Role ID must be an integer" })
    .min(1, { message: "Role ID must be greater than 0" })
});

type SignupFormData = z.infer<typeof signupSchema>;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    bloodType: '',
    userType: 'manager',
    roleId: 1
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    

    const newValue = name === 'roleId' ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    
    if (apiError) setApiError('');
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    try {
      
      signupSchema.parse(formData);
      setErrors({}); 
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {

    setApiError('');
    setSuccessMessage('');
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        bloodType: formData.bloodType || undefined
      };

      const response = await api.post('/manager/createmanagerUser', submitData);
      
      console.log('User created successfully:', response.data);
     
      setSuccessMessage('Account created successfully! Please check your email for verification.');
      

      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        bloodType: '',
        userType: 'donor',
        roleId: 1
      });

    } catch (error) {
      console.error('Signup error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
        
          const { status, data } = error.response;
          
          switch (status) {
            case 400:
            
              if (data.message && Array.isArray(data.message)) {
                const backendErrors: Record<string, string> = {};
                data.message.forEach((msg: string) => {
                  if (msg.includes('email')) backendErrors.email = msg;
                  else if (msg.includes('password')) backendErrors.password = msg;
                  else if (msg.includes('name')) backendErrors.name = msg;
                  else if (msg.includes('phone')) backendErrors.phoneNumber = msg;
                  else if (msg.includes('blood')) backendErrors.bloodType = msg;
                  else if (msg.includes('role')) backendErrors.roleId = msg;
                });
                setErrors(backendErrors);
              } else {
                setApiError(data.message || 'Invalid data provided. Please check your inputs.');
              }
              break;
              
            case 409:
              setApiError('User with this email already exists. Please use a different email.');
              break;
              
            case 500:
              setApiError('Server error occurred. Please try again later.');
              break;
              
            default:
              setApiError(data.message || 'An unexpected error occurred. Please try again.');
          }
        } else if (error.request) {
          
          setApiError('Unable to connect to server. Please check your internet connection.');
        } else {
          setApiError('An unexpected error occurred. Please try again.');
        }
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Mission</h1>
          <p className="text-gray-600">Create your account to start saving lives</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{apiError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be 8+ characters with uppercase, lowercase, number, and symbol
              </p>
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Blood Type Field */}
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type (Optional)
              </label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 appearance-none bg-white ${
                    errors.bloodType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.bloodType && (
                <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
              )}
            </div>

            {/* Role ID Field */}
            <div>
              <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-2">
                Role ID *
              </label>
              <input
                type="number"
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ${
                  errors.roleId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter role ID"
              />
              {errors.roleId && (
                <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-red-500 hover:text-red-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}