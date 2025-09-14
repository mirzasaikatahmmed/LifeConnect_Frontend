'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Droplets,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  User,
  Activity,
  Edit,
  Trash2,
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
  postedBy?: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  fulfilled: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800'
};

export default function BloodRequestDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [bloodRequest, setBloodRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const requestId = params?.id as string;

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
      setError(null);
    } catch (err) {
      console.error('Error fetching blood request:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blood request details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bloodRequest) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this blood request for ${bloodRequest.bloodType} at ${bloodRequest.hospitalName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      const authToken = token || TokenStorage.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blood request: ${response.statusText}`);
      }

      // Redirect back to blood requests list after successful deletion
      router.push('/admin/blood-requests');
    } catch (err) {
      console.error('Error deleting blood request:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete blood request');
    } finally {
      setDeleteLoading(false);
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

  const getUrgencyIcon = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-green-600" />;
    }
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

  if (error || !bloodRequest) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
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
            <p className="text-red-600 mb-4">{error || 'Blood request not found'}</p>
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

  const isUrgent = new Date(bloodRequest.neededBy).getTime() - new Date().getTime() <= 24 * 60 * 60 * 1000;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/admin/blood-requests"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blood Requests
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Droplets className="h-8 w-8 text-red-600 mr-3" />
                Blood Request Details
              </h1>
              <p className="text-gray-600 mt-2">Request ID: #{bloodRequest.id}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBloodRequest}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteLoading ? 'Deleting...' : 'Delete Request'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blood Request Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blood Type</p>
                    <p className="text-2xl font-bold text-red-600">{bloodRequest.bloodType}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Units Needed</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {bloodRequest.unitsNeeded} {bloodRequest.unitsNeeded === 1 ? 'Unit' : 'Units'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    {getUrgencyIcon(bloodRequest.urgencyLevel)}
                    <span className="ml-2">Urgency Level</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    urgencyColors[bloodRequest.urgencyLevel as keyof typeof urgencyColors]
                  }`}>
                    {bloodRequest.urgencyLevel.charAt(0).toUpperCase() + bloodRequest.urgencyLevel.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Status
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[bloodRequest.status as keyof typeof statusColors]
                  }`}>
                    {bloodRequest.status.charAt(0).toUpperCase() + bloodRequest.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hospital Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hospital Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Hospital Name</p>
                  <p className="text-lg text-gray-900">{bloodRequest.hospitalName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address
                  </p>
                  <p className="text-gray-900">{bloodRequest.hospitalAddress}</p>
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
                    <p className="text-sm font-medium text-gray-900">Request Created</p>
                    <p className="text-sm text-gray-500">{formatDate(bloodRequest.createdAt)}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(bloodRequest.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      isUrgent ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Needed By</p>
                    <p className={`text-sm ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {formatDate(bloodRequest.neededBy)}
                    </p>
                    <p className={`text-xs ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                      {formatRelativeTime(bloodRequest.neededBy)}
                      {isUrgent && ' ⚠️ URGENT'}
                    </p>
                  </div>
                </div>

                {bloodRequest.updatedAt !== bloodRequest.createdAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Edit className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(bloodRequest.updatedAt)}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(bloodRequest.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Manager Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Posted By
              </h3>

              {bloodRequest.postedBy ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Manager Name</p>
                    <p className="text-gray-900">{bloodRequest.postedBy.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </p>
                    <a
                      href={`mailto:${bloodRequest.postedBy.email}`}
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {bloodRequest.postedBy.email}
                    </a>
                  </div>

                  {bloodRequest.postedBy.phoneNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </p>
                      <a
                        href={`tel:${bloodRequest.postedBy.phoneNumber}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {bloodRequest.postedBy.phoneNumber}
                      </a>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <Link
                      href={`/admin/users/${bloodRequest.postedBy.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 mr-1" />
                      View Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Manager information not available</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Hospital
                </button>

                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Activity className="h-4 w-4 mr-2" />
                  View Related Requests
                </button>

                <Link
                  href={`/admin/blood-requests/${bloodRequest.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Link>
              </div>
            </div>

            {/* Request Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Stats</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days since created:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(bloodRequest.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time until deadline:</span>
                  <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                    {Math.max(0, Math.floor((new Date(bloodRequest.neededBy).getTime() - new Date().getTime()) / (1000 * 60 * 60)))} hours
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