'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Users,
  Bell,
  Save,
  X,
  Info,
  AlertCircle,
  XCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { TokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';

interface CreateAlertData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status?: 'active' | 'inactive' | 'archived';
  expiresAt: string;
  isSystemWide: boolean;
  targetAudience: 'all' | 'donors' | 'managers' | 'admins';
  priority: number;
  sendEmail: boolean;
}

const alertTypes = [
  { value: 'info', label: 'Info', icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'warning', label: 'Warning', icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { value: 'error', label: 'Error', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' }
];

const priorityLevels = [
  { value: 0, label: 'Low', color: 'text-green-600', description: 'General information' },
  { value: 1, label: 'Medium', color: 'text-yellow-600', description: 'Important updates' },
  { value: 2, label: 'High', color: 'text-orange-600', description: 'Urgent notifications' },
  { value: 3, label: 'Critical', color: 'text-red-600', description: 'Emergency alerts' }
];

const targetAudiences = [
  { value: 'all', label: 'All Users', description: 'Everyone using the platform' },
  { value: 'donors', label: 'Donors', description: 'Blood donors only' },
  { value: 'managers', label: 'Managers', description: 'Hospital managers only' },
  { value: 'admins', label: 'Admins', description: 'System administrators only' }
];

const priorityLabels = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical'
};

export default function CreateAlertPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAlertData>({
    title: '',
    message: '',
    type: 'info',
    status: undefined,
    expiresAt: '',
    isSystemWide: true,
    targetAudience: 'all',
    priority: 0,
    sendEmail: true
  });

  const handleInputChange = (field: keyof CreateAlertData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      // Validate expiration date if provided
      if (formData.expiresAt) {
        const expiresAtDate = new Date(formData.expiresAt);
        if (expiresAtDate <= new Date()) {
          throw new Error('Expiration date must be in the future');
        }
      }

      const authToken = token || TokenStorage.getToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Prepare the data for the API based on endpoint type
      let alertData;

      if (formData.sendEmail) {
        // For send-email endpoint, use SendAlertEmailDto format
        alertData = {
          title: formData.title,
          message: formData.message,
          type: formData.type,
          targetAudience: formData.targetAudience,
          priority: formData.priority,
          sendEmail: formData.sendEmail,
          ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() })
        };
      } else {
        // For regular alerts endpoint, use CreateAlertDto format
        alertData = {
          title: formData.title,
          message: formData.message,
          type: formData.type,
          targetAudience: formData.targetAudience,
          priority: formData.priority,
          isSystemWide: formData.isSystemWide,
          ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() })
        };
      }

      // Use XMLHttpRequest instead of fetch
      const xhr = new XMLHttpRequest();
      // Choose the endpoint based on whether to send email or not
      const url = formData.sendEmail
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/send-email`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`;

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              if (formData.sendEmail) {
                console.log('Alert created and email sent successfully:', result);
                // Show success message for email alerts
                alert('Alert created and email notifications sent successfully!');
              } else {
                console.log('Alert created successfully:', result);
              }
              // Redirect to the alerts list
              router.push('/admin/alerts');
            } catch (parseError) {
              setError('Alert created but failed to parse response');
              setLoading(false);
            }
          } else {
            let errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }

            if (xhr.status === 401) {
              errorMessage = 'Unauthorized: Please check your admin credentials.';
            } else if (xhr.status === 403) {
              errorMessage = 'Forbidden: Admin privileges required.';
            }

            setError(errorMessage);
            setLoading(false);
          }
        }
      };

      xhr.onerror = function() {
        setError('Network error: Unable to create alert');
        setLoading(false);
      };

      xhr.send(JSON.stringify(alertData));

    } catch (err) {
      console.error('Error creating alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to create alert');
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getSelectedAlertType = () => {
    return alertTypes.find(type => type.value === formData.type) || alertTypes[0];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/admin/alerts"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alerts
            </Link>
          </div>

          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                Create System Alert
              </h1>
              <p className="text-gray-600 mt-2">Create a new system alert or notification</p>
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

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Alert Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter alert title"
                required
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/255 characters
              </p>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Alert Message *
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Enter detailed alert message"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Alert Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {alertTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        formData.type === type.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-full mb-2 ${type.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${type.color}`} />
                      </div>
                      <span className={`text-sm font-medium ${type.color}`}>{type.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priorityLevels.map(level => (
                  <label
                    key={level.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.priority === level.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level.value}
                      checked={formData.priority === level.value}
                      onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${level.color}`}>{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Target Audience *
              </label>
              <div className="space-y-3">
                {targetAudiences.map(audience => (
                  <label
                    key={audience.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.targetAudience === audience.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetAudience"
                      value={audience.value}
                      checked={formData.targetAudience === audience.value}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{audience.label}</div>
                      <div className="text-sm text-gray-500">{audience.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* System Wide Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSystemWide"
                checked={formData.isSystemWide}
                onChange={(e) => handleInputChange('isSystemWide', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isSystemWide" className="ml-2 block text-sm text-gray-900">
                System-wide alert (visible across all platform sections)
              </label>
            </div>

            {/* Send Email Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-900">
                Send email notifications to all users automatically
              </label>
            </div>


            {/* Expiration Date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Expiration Date (Optional)
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                value={formData.expiresAt}
                min={getMinDateTime()}
                onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty for alerts that don't expire automatically
              </p>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Alert Preview</h3>
              <div className={`p-4 rounded-lg border-l-4 ${
                formData.type === 'info' ? 'bg-blue-50 border-blue-400' :
                formData.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                formData.type === 'error' ? 'bg-red-50 border-red-400' :
                'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {(() => {
                      const selectedType = getSelectedAlertType();
                      const IconComponent = selectedType.icon;
                      return <IconComponent className={`h-5 w-5 ${selectedType.color}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {formData.title || 'Alert title will appear here'}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {formData.message || 'Alert message will appear here'}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Bell className="h-3 w-3 mr-1" />
                      <span>
                        {priorityLabels[formData.priority as keyof typeof priorityLabels]} priority •
                        {formData.isSystemWide ? ' System-wide' : ` ${formData.targetAudience}`}
                        {formData.expiresAt && ` • Expires ${new Date(formData.expiresAt).toLocaleDateString()}`}
                        {formData.sendEmail && ' • 📧 Email notifications enabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/alerts"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Alert
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-900 font-medium mb-2">Creating System Alerts</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Choose the appropriate alert type and priority level</li>
            <li>• System-wide alerts appear across all platform sections</li>
            <li>• Target specific user groups when needed</li>
            <li>• Set expiration dates for temporary alerts</li>
            <li>• Enable email notifications to automatically send alerts to all users</li>
            <li>• Use the preview to see how your alert will look</li>
          </ul>
        </div>
      </div>
    </div>
  );
}