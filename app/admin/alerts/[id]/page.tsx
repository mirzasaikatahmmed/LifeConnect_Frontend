'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Users,
  Bell,
  Edit,
  Trash2,
  RefreshCw,
  Info,
  AlertCircle,
  XCircle,
  CheckCircle,
  Clock,
  User,
  Eye,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { TokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'active' | 'inactive' | 'expired' | 'archived';
  expiresAt?: string;
  isSystemWide: boolean;
  targetAudience?: string;
  priority: number;
  userId?: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const alertTypeColors = {
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  success: 'bg-green-100 text-green-800 border-green-200'
};

const alertTypeIcons = {
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800',
  archived: 'bg-purple-100 text-purple-800'
};

const priorityLabels = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical'
};

const priorityColors = {
  0: 'text-green-600',
  1: 'text-yellow-600',
  2: 'text-orange-600',
  3: 'text-red-600'
};

export default function AlertDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const alertId = params?.id as string;

  useEffect(() => {
    if (alertId) {
      fetchAlert();
    }
  }, [alertId]);

  const fetchAlert = async () => {
    try {
      setLoading(true);
      const authToken = token || TokenStorage.getToken();

      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Use XMLHttpRequest instead of fetch
      const xhr = new XMLHttpRequest();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alertId}`;

      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              setAlert(data);
              setError(null);
            } catch (parseError) {
              setError('Failed to parse server response');
            }
          } else {
            let errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }

            if (xhr.status === 404) {
              errorMessage = 'Alert not found';
            } else if (xhr.status === 401) {
              errorMessage = 'Unauthorized: Please check your admin credentials.';
            } else if (xhr.status === 403) {
              errorMessage = 'Forbidden: Admin privileges required.';
            }

            setError(errorMessage);
          }
          setLoading(false);
        }
      };

      xhr.onerror = function() {
        setError('Network error: Unable to connect to server');
        setLoading(false);
      };

      xhr.send();

    } catch (err) {
      console.error('Error fetching alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alert details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!alert) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the alert "${alert.title}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      const authToken = token || TokenStorage.getToken();

      if (!authToken) {
        throw new Error('Authentication required');
      }

      const xhr = new XMLHttpRequest();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alertId}`;

      xhr.open('DELETE', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Redirect back to alerts list after successful deletion
            router.push('/admin/alerts');
          } else {
            let errorMessage = `Failed to delete alert: HTTP ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            window.alert(errorMessage);
            setDeleteLoading(false);
          }
        }
      };

      xhr.onerror = function() {
        window.alert('Network error: Unable to delete alert');
        setDeleteLoading(false);
      };

      xhr.send();

    } catch (err) {
      console.error('Error deleting alert:', err);
      window.alert(err instanceof Error ? err.message : 'Failed to delete alert');
      setDeleteLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!alert) return;

    const confirmSend = window.confirm(
      `Send this alert "${alert.title}" via email to all users?\n\nThis will send immediate email notifications to all registered users.`
    );

    if (!confirmSend) return;

    try {
      setEmailLoading(true);
      const authToken = token || TokenStorage.getToken();

      if (!authToken) {
        throw new Error('Authentication required');
      }

      const xhr = new XMLHttpRequest();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/${alertId}/send-email`;

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              window.alert(`Email sent successfully!\n\nSent: ${result.data?.sentCount || 'N/A'}\nFailed: ${result.data?.failedCount || 0}`);
            } catch (parseError) {
              window.alert('Email sending process completed successfully!');
            }
            setEmailLoading(false);
          } else {
            let errorMessage = `Failed to send email: HTTP ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            window.alert(errorMessage);
            setEmailLoading(false);
          }
        }
      };

      xhr.onerror = function() {
        window.alert('Network error: Unable to send email');
        setEmailLoading(false);
      };

      xhr.send();

    } catch (err) {
      console.error('Error sending email:', err);
      window.alert(err instanceof Error ? err.message : 'Failed to send email');
      setEmailLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      const pastHours = Math.abs(diffInHours);
      if (pastHours < 24) {
        return `${Math.floor(pastHours)} hours ago`;
      } else {
        return `${Math.floor(pastHours / 24)} days ago`;
      }
    } else if (diffInHours < 24) {
      return `In ${Math.floor(diffInHours)} hours`;
    } else {
      return `In ${Math.floor(diffInHours / 24)} days`;
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    const IconComponent = alertTypeIcons[type];
    return <IconComponent className="h-6 w-6" />;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/admin/alerts"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alerts
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Alert</h2>
            <p className="text-red-600 mb-4">{error || 'Alert not found'}</p>
            <button
              onClick={fetchAlert}
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
      <div className="max-w-4xl mx-auto">
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

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                Alert Details
              </h1>
              <p className="text-gray-600 mt-2">Alert ID: #{alert.id}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAlert}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              <button
                onClick={handleSendEmail}
                disabled={emailLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="h-4 w-4 mr-2" />
                {emailLoading ? 'Sending...' : 'Send Email'}
              </button>

              <Link
                href={`/admin/alerts/${alert.id}/edit`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Alert
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteLoading ? 'Deleting...' : 'Delete Alert'}
              </button>
            </div>
          </div>
        </div>

        {/* Alert Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Preview</h2>
          <div className={`p-6 rounded-lg border-l-4 ${
            alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
            alert.type === 'error' ? 'bg-red-50 border-red-400' :
            'bg-green-50 border-green-400'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-4 p-2 rounded-full ${alertTypeColors[alert.type]}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{alert.title}</h3>
                <p className="text-gray-700 mb-3">{alert.message}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Bell className="h-4 w-4 mr-1" />
                  <span>
                    {priorityLabels[alert.priority as keyof typeof priorityLabels]} priority •
                    {alert.isSystemWide ? ' System-wide' : ` ${alert.targetAudience} users`}
                    {alert.expiresAt && (
                      <>
                        {' • '}
                        <span className={isExpired(alert.expiresAt) ? 'text-red-600' : ''}>
                          {isExpired(alert.expiresAt) ? 'Expired' : 'Expires'} {new Date(alert.expiresAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Alert Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Alert Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${alertTypeColors[alert.type]}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Alert Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{alert.type}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Priority</p>
                    <p className={`text-lg font-semibold ${priorityColors[alert.priority as keyof typeof priorityColors]}`}>
                      {priorityLabels[alert.priority as keyof typeof priorityLabels]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[alert.status as keyof typeof statusColors]
                  }`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Scope</span>
                  <span className="text-sm text-gray-900">
                    {alert.isSystemWide ? 'System-wide' : `${alert.targetAudience} only`}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Message Content</h2>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{alert.title}</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {alert.message}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Timeline</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Alert Created</p>
                    <p className="text-sm text-gray-500">{formatDate(alert.createdAt)}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(alert.createdAt)}</p>
                  </div>
                </div>

                {alert.expiresAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isExpired(alert.expiresAt) ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <Clock className={`h-4 w-4 ${isExpired(alert.expiresAt) ? 'text-red-600' : 'text-yellow-600'}`} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {isExpired(alert.expiresAt) ? 'Expired' : 'Expires'}
                      </p>
                      <p className={`text-sm ${isExpired(alert.expiresAt) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {formatDate(alert.expiresAt)}
                      </p>
                      <p className={`text-xs ${isExpired(alert.expiresAt) ? 'text-red-500' : 'text-gray-400'}`}>
                        {formatRelativeTime(alert.expiresAt)}
                        {isExpired(alert.expiresAt) && ' ⚠️ EXPIRED'}
                      </p>
                    </div>
                  </div>
                )}

                {alert.updatedAt !== alert.createdAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(alert.updatedAt)}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(alert.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Created By */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Created By
              </h3>

              {alert.createdBy ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Admin Name</p>
                    <p className="text-gray-900">{alert.createdBy.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <a
                      href={`mailto:${alert.createdBy.email}`}
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {alert.createdBy.email}
                    </a>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <Link
                      href={`/admin/users/${alert.createdBy.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 mr-1" />
                      View Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Creator information not available</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Target Audience
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scope</p>
                  <p className="text-gray-900">
                    {alert.isSystemWide ? 'System-wide Alert' : 'Targeted Alert'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Audience</p>
                  <p className="text-gray-900 capitalize">
                    {alert.targetAudience || 'All users'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {emailLoading ? 'Sending...' : 'Send Email'}
                </button>

                <Link
                  href={`/admin/alerts/${alert.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Alert
                </Link>

                <button
                  onClick={() => navigator.clipboard.writeText(alert.message)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Copy Message
                </button>

                <Link
                  href="/admin/alerts"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Alerts
                </Link>
              </div>
            </div>

            {/* Alert Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Stats</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days active:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(alert.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>

                {alert.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time until expiry:</span>
                    <span className={`text-sm font-medium ${isExpired(alert.expiresAt) ? 'text-red-600' : 'text-gray-900'}`}>
                      {isExpired(alert.expiresAt) ? 'Expired' :
                        `${Math.max(0, Math.floor((new Date(alert.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60)))} hours`
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last modified:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(alert.updatedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}