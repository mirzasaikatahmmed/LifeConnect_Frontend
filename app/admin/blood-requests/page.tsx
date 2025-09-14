'use client';

import { useState, useEffect } from 'react';
import { Droplets, Eye, Calendar, MapPin, Clock, Plus, Search, Filter, RefreshCw } from 'lucide-react';
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

export default function AdminBloodRequestsPage() {
  const { isAuthenticated, token, user } = useAuth();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
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

      // Try the main endpoint first, then fallback to alternative
      let response;
      let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests`;

      try {
        response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        // If main endpoint fails, try alternative
        if (!response.ok && response.status === 401) {
          console.log('Main endpoint unauthorized, trying alternative...');
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests-alt`;
          response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (fetchError) {
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Unauthorized: Please check your admin credentials and login again.');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Admin privileges required.');
        } else {
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setBloodRequests(Array.isArray(data) ? data : []);
      setError(null);
      console.log(`Successfully fetched ${Array.isArray(data) ? data.length : 0} blood requests from ${endpoint}`);
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blood requests');
      setBloodRequests([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch =
      request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hospitalAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.postedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgencyLevel === urgencyFilter;
    const matchesBloodType = bloodTypeFilter === 'all' || request.bloodType === bloodTypeFilter;

    return matchesSearch && matchesStatus && matchesUrgency && matchesBloodType;
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

  const isUrgent = (neededBy: string) => {
    const deadline = new Date(neededBy);
    const now = new Date();
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft <= 24;
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
                <Droplets className="h-8 w-8 text-red-600 mr-3" />
                Blood Requests Management
              </h1>
              <p className="text-gray-600 mt-2">Monitor and manage all blood donation requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBloodRequests}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <Link
                href="/admin/blood-requests/create"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Request
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{bloodRequests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-green-600">
                  {bloodRequests.filter(r => r.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Urgent</p>
                <p className="text-2xl font-bold text-red-600">
                  {bloodRequests.filter(r => r.urgencyLevel === 'critical').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bloodRequests.filter(r => r.status === 'fulfilled').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Droplets className="h-6 w-6 text-purple-600" />
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
                placeholder="Search by hospital, blood type, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Blood Types</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
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

        {/* Blood Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted By
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Droplets className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">
                          {bloodRequests.length === 0 ? 'No blood requests found' : 'No requests match your filters'}
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
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <Droplets className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.bloodType} Blood
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.unitsNeeded} unit{request.unitsNeeded !== 1 ? 's' : ''} needed
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.hospitalName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.hospitalAddress.length > 30
                            ? `${request.hospitalAddress.substring(0, 30)}...`
                            : request.hospitalAddress}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          urgencyColors[request.urgencyLevel as keyof typeof urgencyColors]
                        }`}>
                          {request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[request.status as keyof typeof statusColors]
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${isUrgent(request.neededBy) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(request.neededBy)}
                        </div>
                        {isUrgent(request.neededBy) && (
                          <div className="text-xs text-red-500">⚠️ Within 24 hours</div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.postedBy?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.postedBy?.email || 'No email'}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/blood-requests/${request.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredRequests.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {bloodRequests.length} blood request{bloodRequests.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}