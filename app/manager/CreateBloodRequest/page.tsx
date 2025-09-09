"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Droplets, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Hospital,
  Save,
  X
} from 'lucide-react';

// Zod validation schema based on your DTO
const createBloodRequestSchema = z.object({
  bloodType: z.string()
    .min(1, "Blood type is required")
    .refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), 
      "Please select a valid blood type"),
  
  urgencyLevel: z.string()
    .min(1, "Urgency level is required")
    .refine((val) => ['low', 'medium', 'high', 'critical'].includes(val), 
      "Please select a valid urgency level"),
  
  hospitalName: z.string()
    .min(1, "Hospital name is required")
    .min(2, "Hospital name must be at least 2 characters"),
  
  hospitalAddress: z.string()
    .min(1, "Hospital address is required")
    .min(5, "Hospital address must be at least 5 characters"),
  
  neededBy: z.string()
    .min(1, "Date needed is required")
    .refine((dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Date must be today or in the future"),
  
  unitsNeeded: z.number()
    .min(1, "At least 1 unit is required")
    .max(20, "Cannot exceed 20 units")
    .optional()
    .default(1),
});

type FormData = z.infer<typeof createBloodRequestSchema>;

export default function CreateBloodRequest() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<FormData>>({
    bloodType: '',
    urgencyLevel: '',
    hospitalName: '',
    hospitalAddress: '',
    neededBy: '',
    unitsNeeded: 1,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 
    const handleGoBack = () => {
    router.push("/manager/Dashboard"); // dashboard এ redirect
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { value: 'critical', label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));


    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      const validatedData = createBloodRequestSchema.parse({
        ...formData,
        unitsNeeded: Number(formData.unitsNeeded) || 1,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to create the blood request
      console.log('Creating blood request:', formData);
      
      // Show success and redirect back to dashboard
      alert('Blood request created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating blood request:', error);
      alert('Failed to create blood request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level ? `${level.color} ${level.bgColor}` : '';
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Mock router for demo purposes
  const mockRouter = {
    push: (path: string) => alert(`Would navigate to: ${path}`)
  };
  
  // Use mock router for demo
  const demoRouter = process.env.NODE_ENV === 'development' ? mockRouter : router;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Blood Request</h1>
              <p className="text-gray-600 mt-1">Fill out the form to create a new blood donation request</p>
            </div>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Droplets className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Blood Type & Urgency Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Droplets className="h-5 w-5 text-red-600 mr-2" />
              Blood Request Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type *
                </label>
                <select
                  value={formData.bloodType || ''}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.bloodType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.bloodType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.bloodType}
                  </p>
                )}
              </div>

              {/* Units Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units Needed
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.unitsNeeded || 1}
                  onChange={(e) => handleInputChange('unitsNeeded', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.unitsNeeded ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.unitsNeeded && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.unitsNeeded}
                  </p>
                )}
              </div>

              {/* Urgency Level */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleInputChange('urgencyLevel', level.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        formData.urgencyLevel === level.value
                          ? `${level.bgColor} ${level.color} border-current`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
                      {level.label}
                    </button>
                  ))}
                </div>
                {errors.urgencyLevel && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.urgencyLevel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hospital Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Hospital className="h-5 w-5 text-blue-600 mr-2" />
              Hospital Information
            </h2>
            
            <div className="space-y-6">
              {/* Hospital Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName || ''}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.hospitalName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.hospitalName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.hospitalName}
                  </p>
                )}
              </div>

              {/* Hospital Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Hospital Address *
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter complete hospital address"
                  value={formData.hospitalAddress || ''}
                  onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                    errors.hospitalAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.hospitalAddress && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.hospitalAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              Timeline
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Needed By *
              </label>
              <input
                type="date"
                min={today}
                value={formData.neededBy || ''}
                onChange={(e) => handleInputChange('neededBy', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.neededBy ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.neededBy && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.neededBy}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select the date by when the blood is needed
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}