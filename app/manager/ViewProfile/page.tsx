"use client"
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Droplets, 
  Shield, 
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';
import {z} from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Please provide a valid email address"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 characters").max(15, "Phone number cannot exceed 15 characters"),
bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
  .refine((val) => !!val, { message: "Please select a valid blood type" }),
  userType: z.enum(["donor", "manager", "admin"]).default("donor"),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// TypeScript types
type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Original data to restore on cancel
  const [originalData] = useState<ProfileData>({
    name: 'Dr. Ahmed Rahman',
    email: 'ahmed@bloodconnect.org',
    phoneNumber: '+880 1712-345678',
    bloodType: 'B+',
    userType: 'manager',
    isActive: true,
    isVerified: true
  });

  // Form data state
  const [formData, setFormData] = useState<ProfileData>({...originalData});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Error states
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (profileErrors[field]) {
      setProfileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    // শুধুমাত্র changed fields গুলো validate করবো
    const changedData: Partial<ProfileData> = {};
    
    // Check করি কোন fields change হয়েছে
    if (formData.name !== originalData.name) {
      changedData.name = formData.name?.trim();
    }
    if (formData.email !== originalData.email) {
      changedData.email = formData.email?.trim();
    }
    if (formData.phoneNumber !== originalData.phoneNumber) {
      changedData.phoneNumber = formData.phoneNumber?.trim();
    }
    if (formData.bloodType !== originalData.bloodType) {
      changedData.bloodType = formData.bloodType;
    }

    // যদি কোন change না হয় তাহলে বলে দিবো
    if (Object.keys(changedData).length === 0) {
      alert('No changes detected to save');
      return;
    }

    // Manual validation করি changed fields গুলোর
    const errors: Record<string, string> = {};

    if (changedData.name !== undefined) {
      if (!changedData.name || changedData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
      } else if (changedData.name.length > 50) {
        errors.name = 'Name cannot exceed 50 characters';
      }
    }

    if (changedData.email !== undefined) {
      if (!changedData.email) {
        errors.email = 'Email cannot be empty';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changedData.email)) {
        errors.email = 'Please provide a valid email address';
      }
    }

    if (changedData.phoneNumber !== undefined) {
      if (!changedData.phoneNumber) {
        errors.phoneNumber = 'Phone number cannot be empty';
      }
    }

    if (changedData.bloodType !== undefined) {
      const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      if (!changedData.bloodType || !validBloodTypes.includes(changedData.bloodType)) {
        errors.bloodType = 'Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-';
      }
    }

    // যদি error থাকে তাহলে দেখাবো
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    // Clear errors and save
    setProfileErrors({});
    console.log('Saving changed profile data:', changedData);
    
    // Simulate API call - শুধুমাত্র changed data পাঠাবো
    setTimeout(() => {
      setIsEditing(false);
      alert(`Profile updated successfully! Changed fields: ${Object.keys(changedData).join(', ')}`);
    }, 500);
  };

  const handleCancel = () => {
    setFormData({...originalData});
    setProfileErrors({});
    setIsEditing(false);
  };

  const handlePasswordSave = () => {
    const result = passwordSchema.safeParse(passwordData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};
      
      // Type-safe error mapping
      if (errors.currentPassword) {
        errorMap.currentPassword = errors.currentPassword[0];
      }
      if (errors.newPassword) {
        errorMap.newPassword = errors.newPassword[0];
      }
      if (errors.confirmPassword) {
        errorMap.confirmPassword = errors.confirmPassword[0];
      }
      
      setPasswordErrors(errorMap);
      return;
    }

    // Clear errors and save
    setPasswordErrors({});
    console.log('Changing password...');
    
    // Simulate API call
    setTimeout(() => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    }, 500);
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    error, 
    type = "text", 
    placeholder, 
    icon: Icon,
    disabled = false 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="h-4 w-4 inline mr-2" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center border-4 border-red-300 relative">
                <User className="h-8 w-8 text-red-700" />
                <button className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{formData.userType}</span>
                  {formData.isVerified && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 text-sm">Verified</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditing
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          profileErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {profileErrors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{formData.name}</div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          profileErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.email}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{formData.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          profileErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {profileErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.phoneNumber}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{formData.phoneNumber}</div>
                  )}
                </div>

                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="h-4 w-4 inline mr-2" />
                    Blood Type
                  </label>
                  {isEditing ? (
                    <>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                          profileErrors.bloodType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {profileErrors.bloodType && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.bloodType}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 flex items-center">
                      <span className="text-red-600 font-semibold text-lg mr-2">{formData.bloodType}</span>
                    </div>
                  )}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="h-4 w-4 inline mr-2" />
                    User Type
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    <span className="capitalize font-medium">{formData.userType}</span>
                    <span className="text-sm text-gray-500 ml-2">(Cannot be changed)</span>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">
                        Account is {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {formData.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm text-gray-700">
                        Account is {formData.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your password and security preferences</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10 ${
                        passwordErrors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      passwordErrors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, number, and symbol
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      passwordErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePasswordSave}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Update Password
                </button>
              </div>

              {/* Additional Security Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Account Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-800">Email Verified</span>
                    </div>
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-blue-800">Account Created</span>
                    </div>
                    <span className="text-xs text-blue-600">January 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}