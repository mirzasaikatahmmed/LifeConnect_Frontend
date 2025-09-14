'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Droplets,
  ArrowLeft,
  Calendar,
  MapPin,
  AlertTriangle,
  Hospital,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { TokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';

interface BloodRequest {
  id: number;
  bloodType: string;
  urgencyLevel: string;
  hospitalName: string;
  hospitalAddress: string;
  status: string;
  neededBy: string;
  unitsNeeded: number;
  createdAt: string;
  updatedAt: string;
}

interface EditBloodRequestData {
  bloodType: string;
  urgencyLevel: string;
  hospitalName: string;
  hospitalAddress: string;
  neededBy: string;
  unitsNeeded: number;
  status: string;
}

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const urgencyLevels = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical', color: 'text-red-600' }
];

const statusOptions = [
  { value: 'active', label: 'Active', color: 'text-blue-600' },
  { value: 'fulfilled', label: 'Fulfilled', color: 'text-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-gray-600' },
  { value: 'expired', label: 'Expired', color: 'text-red-600' }
];

export default function EditBloodRequestPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [bloodRequest, setBloodRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = params?.id as string;

  const [formData, setFormData] = useState<EditBloodRequestData>({
    bloodType: '',
    urgencyLevel: '',
    hospitalName: '',
    hospitalAddress: '',
    neededBy: '',
    unitsNeeded: 1,
    status: 'active'
  });

  useEffect(() => {
    if (requestId) {
      fetchBloodRequest();
    }
  }, [requestId]);

  const fetchBloodRequest = async () => {
    try {
      setLoading(true);
      const authToken = token || TokenStorage.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blood request: ${response.statusText}`);
      }

      const data = await response.json();
      setBloodRequest(data);

      // Populate form with existing data
      setFormData({
        bloodType: data.bloodType,
        urgencyLevel: data.urgencyLevel,
        hospitalName: data.hospitalName,
        hospitalAddress: data.hospitalAddress,
        neededBy: new Date(data.neededBy).toISOString().slice(0, 16), // Format for datetime-local input
        unitsNeeded: data.unitsNeeded,
        status: data.status
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching blood request:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blood request details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EditBloodRequestData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.bloodType || !formData.urgencyLevel || !formData.hospitalName ||
          !formData.hospitalAddress || !formData.neededBy) {
        throw new Error('Please fill in all required fields');
      }

      // Validate date is in the future (only if status is active)
      const neededByDate = new Date(formData.neededBy);
      if (formData.status === 'active' && neededByDate <= new Date()) {
        throw new Error('Needed by date must be in the future for active requests');
      }

      const authToken = token || TokenStorage.getToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      let response;
      let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests/${requestId}`;

      try {
        response = await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            neededBy: neededByDate.toISOString()
          })
        });

        // If main endpoint fails, try simple endpoint
        if (!response.ok && (response.status === 400 || response.status === 500)) {
          console.log('Main update endpoint failed, trying simple endpoint...');
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests/${requestId}/simple`;
          response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...formData,
              neededBy: neededByDate.toISOString()
            })
          });
        }
      } catch (fetchError) {
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Unauthorized: Please check your admin credentials.');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('Blood request not found.');
        } else {
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const updatedBloodRequest = await response.json();
      console.log('Blood request updated successfully:', updatedBloodRequest);

      // Redirect to the blood request details page
      router.push(`/admin/blood-requests/${requestId}`);
    } catch (err) {
      console.error('Error updating blood request:', err);
      setError(err instanceof Error ? err.message : 'Failed to update blood request');
    } finally {
      setSaving(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error && !bloodRequest) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href="/admin/blood-requests"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blood Requests
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Blood Request</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBloodRequest}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href={`/admin/blood-requests/${requestId}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </div>

          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Droplets className="h-8 w-8 text-red-600 mr-3" />
                Edit Blood Request
              </h1>
              <p className="text-gray-600 mt-2">Request ID: #{requestId}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Blood Type and Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type *
                </label>
                <select
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="unitsNeeded" className="block text-sm font-medium text-gray-700 mb-2">
                  Units Needed *
                </label>
                <input
                  type="number"
                  id="unitsNeeded"
                  min="1"
                  max="20"
                  value={formData.unitsNeeded}
                  onChange={(e) => handleInputChange('unitsNeeded', parseInt(e.target.value) || 1)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map(level => (
                  <label
                    key={level.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.urgencyLevel === level.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value={level.value}
                      checked={formData.urgencyLevel === level.value}
                      onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <AlertTriangle className={`h-4 w-4 mr-2 ${level.color}`} />
                      <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statusOptions.map(status => (
                  <label
                    key={status.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.status === status.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        status.value === 'active' ? 'bg-blue-500' :
                        status.value === 'fulfilled' ? 'bg-green-500' :
                        status.value === 'cancelled' ? 'bg-gray-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Hospital Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Hospital className="h-5 w-5 mr-2" />
                Hospital Information
              </h3>

              <div>
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  id="hospitalName"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                  placeholder="Enter hospital name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Hospital Address *
                </label>
                <textarea
                  id="hospitalAddress"
                  rows={3}
                  value={formData.hospitalAddress}
                  onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
                  placeholder="Enter complete hospital address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="neededBy" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Needed By *
              </label>
              <input
                type="datetime-local"
                id="neededBy"
                value={formData.neededBy}
                min={formData.status === 'active' ? getMinDateTime() : undefined}
                onChange={(e) => handleInputChange('neededBy', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.status === 'active'
                  ? 'Date must be in the future for active requests'
                  : 'Select when the blood is needed by'
                }
              </p>
            </div>

            {/* Changes Summary */}
            {bloodRequest && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Changes Summary</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  {formData.bloodType !== bloodRequest.bloodType && (
                    <p><span className="font-medium">Blood Type:</span> {bloodRequest.bloodType} → {formData.bloodType}</p>
                  )}
                  {formData.urgencyLevel !== bloodRequest.urgencyLevel && (
                    <p><span className="font-medium">Urgency:</span> {bloodRequest.urgencyLevel} → {formData.urgencyLevel}</p>
                  )}
                  {formData.status !== bloodRequest.status && (
                    <p><span className="font-medium">Status:</span> {bloodRequest.status} → {formData.status}</p>
                  )}
                  {formData.unitsNeeded !== bloodRequest.unitsNeeded && (
                    <p><span className="font-medium">Units:</span> {bloodRequest.unitsNeeded} → {formData.unitsNeeded}</p>
                  )}
                  {formData.hospitalName !== bloodRequest.hospitalName && (
                    <p><span className="font-medium">Hospital:</span> {bloodRequest.hospitalName} → {formData.hospitalName}</p>
                  )}
                  {new Date(formData.neededBy).getTime() !== new Date(bloodRequest.neededBy).getTime() && (
                    <p><span className="font-medium">Deadline:</span> {new Date(bloodRequest.neededBy).toLocaleString()} → {new Date(formData.neededBy).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={`/admin/blood-requests/${requestId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-900 font-medium mb-2">Editing Blood Requests</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Changes are tracked and shown in the summary above</li>
            <li>• Active requests must have future deadlines</li>
            <li>• Status changes affect validation rules</li>
            <li>• Changes will be immediately visible to matching donors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}