'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  Bell,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
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

export default function AdminAlertsPage() {
  const { isAuthenticated, token, user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [emailLoadingId, setEmailLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // Use the proper token from AuthContext or TokenStorage
      const authToken = token || TokenStorage.getToken();

      if (!authToken) {
        throw new Error('No authentication token found. Please login again.');
      }

      if (!isAuthenticated) {
        throw new Error('You are not authenticated. Please login again.');
      }

      // Check if user has admin privileges
      if (user?.role !== 'admin') {
        throw new Error('Admin privileges required. Current role: ' + (user?.role || 'unknown'));
      }

      // Use XMLHttpRequest instead of fetch
      const xhr = new XMLHttpRequest();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`;

      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              setAlerts(Array.isArray(data) ? data : []);
              setError(null);
              console.log(`Successfully retrieved ${Array.isArray(data) ? data.length : 0} alerts`);
            } catch (parseError) {
              setError('Failed to parse server response');
              setAlerts([]);
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
              errorMessage = 'Unauthorized: Please check your admin credentials and login again.';
            } else if (xhr.status === 403) {
              errorMessage = 'Forbidden: Admin privileges required.';
            }

            setError(errorMessage);
            setAlerts([]);
          }
          setLoading(false);
        }
      };

      xhr.onerror = function() {
        setError('Network error: Unable to connect to server');
        setAlerts([]);
        setLoading(false);
      };

      xhr.send();

    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      setAlerts([]);
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: number) => {
    if (!confirm('Are you sure you want to delete this alert? This action cannot be undone.')) {
      return;
    }

    try {
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
            // Remove the deleted alert from the list
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
            console.log('Alert deleted successfully');
          } else {
            let errorMessage = `Failed to delete alert: HTTP ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            alert(errorMessage);
          }
        }
      };

      xhr.onerror = function() {
        alert('Network error: Unable to delete alert');
      };

      xhr.send();

    } catch (err) {
      console.error('Error deleting alert:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete alert');
    }
  };

  const sendEmailAlert = async (alertId: number, alertTitle: string) => {
    const confirmSend = window.confirm(
      `Send alert "${alertTitle}" via email to all users?\n\nThis will send immediate email notifications to all registered users.`
    );

    if (!confirmSend) return;

    try {
      setEmailLoadingId(alertId);
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
            setEmailLoadingId(null);
          } else {
            let errorMessage = `Failed to send email: HTTP ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            alert(errorMessage);
            setEmailLoadingId(null);
          }
        }
      };

      xhr.onerror = function() {
        alert('Network error: Unable to send email');
        setEmailLoadingId(null);
      };

      xhr.send();

    } catch (err) {
      console.error('Error sending email:', err);
      alert(err instanceof Error ? err.message : 'Failed to send email');
      setEmailLoadingId(null);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesAudience = audienceFilter === 'all' || alert.targetAudience === audienceFilter;

    return matchesSearch && matchesStatus && matchesType && matchesAudience;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getAlertIcon = (type: Alert['type']) => {
    const IconComponent = alertTypeIcons[type];
    return <IconComponent className="h-5 w-5" />;
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                System Alerts Management
              </h1>
              <p className="text-gray-600 mt-2">Create and manage system-wide alerts and notifications</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAlerts}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <Link
                href="/admin/alerts/create"
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.priority === 3).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Wide</p>
                <p className="text-2xl font-bold text-purple-600">
                  {alerts.filter(a => a.isSystemWide).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts by title, message, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>

              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Audiences</option>
                <option value="all">All Users</option>
                <option value="donors">Donors</option>
                <option value="managers">Managers</option>
                <option value="admins">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <div className="mt-3 text-sm text-red-600">
              <p>Troubleshooting steps:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check if you're logged in with admin credentials</li>
                <li>Verify your token hasn't expired</li>
                <li><Link href="/admin/auth-debug" className="text-blue-600 hover:text-blue-800 underline">Use the debug page</Link> to test authentication</li>
                <li>Try refreshing the page or logging out and back in</li>
              </ul>
            </div>
          </div>
        )}

        {/* Alerts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alert Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">
                          {alerts.length === 0 ? 'No alerts found' : 'No alerts match your filters'}
                        </p>
                        {searchTerm && (
                          <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                            alertTypeColors[alert.type]
                          }`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {alert.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {alert.message.length > 100
                                ? `${alert.message.substring(0, 100)}...`
                                : alert.message}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          alertTypeColors[alert.type]
                        }`}>
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </div>
                        <div className={`text-sm font-medium mt-1 ${priorityColors[alert.priority as keyof typeof priorityColors]}`}>
                          {priorityLabels[alert.priority as keyof typeof priorityLabels]}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[alert.status as keyof typeof statusColors]
                        }`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {alert.isSystemWide ? 'System Wide' : alert.targetAudience || 'All'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {alert.isSystemWide ? 'All users' : `${alert.targetAudience || 'all'} users`}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {alert.createdBy?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(alert.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.expiresAt ? (
                          <div className={`text-sm ${isExpired(alert.expiresAt) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {formatDate(alert.expiresAt)}
                            {isExpired(alert.expiresAt) && (
                              <div className="text-xs text-red-500">⚠️ Expired</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Never</div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/alerts/${alert.id}`}
                            className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => sendEmailAlert(alert.id, alert.title)}
                            disabled={emailLoadingId === alert.id}
                            className="inline-flex items-center p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Send Email"
                          >
                            {emailLoadingId === alert.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/alerts/${alert.id}/edit`}
                            className="inline-flex items-center p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Alert"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="inline-flex items-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Alert"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredAlerts.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredAlerts.length} of {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}