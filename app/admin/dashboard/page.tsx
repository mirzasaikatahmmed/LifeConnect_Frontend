'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Download,
  Eye,
  Settings,
  Bell,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  MapPin,
  Droplets
} from 'lucide-react';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import LineChart from '@/components/charts/LineChart';

interface DashboardStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  userTypes: {
    donors: number;
    managers: number;
    admins: number;
  };
  bloodRequests: {
    total: number;
    active: number;
    completed: number;
  };
  alerts: {
    total: number;
    active: number;
  };
  bloodTypeDistribution: Record<string, number>;
  lastUpdated: string;
}

interface DashboardCharts {
  userRegistrations: {
    title: string;
    data: Array<{ month: string; users: number }>;
  };
  bloodRequests: {
    title: string;
    data: Array<{ month: string; requests: number }>;
  };
  bloodTypeDistribution: {
    title: string;
    data: Array<{ bloodType: string; count: number }>;
  };
  generatedAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Only fetch data if user is admin
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, token, router, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, chartsResponse, usersResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/charts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/details`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setCharts(chartsResponse.data);
      setRecentUsers(usersResponse.data.slice(0, 10)); // Show recent 10 users
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({
        overview: { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
        userTypes: { donors: 0, managers: 0, admins: 0 },
        bloodRequests: { total: 0, active: 0, completed: 0 },
        alerts: { total: 0, active: 0 },
        bloodTypeDistribution: {},
        lastUpdated: new Date().toISOString()
      });
      setRecentUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredUsers = recentUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">System Overview & Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-6 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with LifeConnect today.
          </p>
          {stats && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.overview.totalUsers.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">{stats?.overview.activeUsers || 0} active</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Blood Donors</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.userTypes.donors.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Droplets className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">Critical</span>
              <span className="text-gray-500 ml-1">resource</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Requests</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.bloodRequests.active.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stats?.bloodRequests.completed || 0} completed</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">System Alerts</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.alerts.active.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${(stats?.alerts.active || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(stats?.alerts.active || 0) > 0 ? 'Attention needed' : 'All clear'}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Registrations Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">User Registration Trends</h3>
                    <p className="text-gray-500 text-sm mt-1">Monthly user growth over time</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-80 bg-gray-200 animate-pulse rounded"></div>
                ) : charts ? (
                  <div className="w-full overflow-x-auto">
                    <LineChart
                      data={charts.userRegistrations.data.map(item => ({
                        date: item.month,
                        value: item.users
                      }))}
                      width={650}
                      height={320}
                      color="#3B82F6"
                      className="min-w-[600px]"
                    />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blood Type Distribution */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Blood Type Distribution</h3>
                    <p className="text-gray-500 text-sm mt-1">Donor blood type breakdown</p>
                  </div>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-80 bg-gray-200 animate-pulse rounded-full mx-auto w-80"></div>
                ) : stats ? (
                  <div className="flex justify-center">
                    <DonutChart
                      data={Object.entries(stats.bloodTypeDistribution).map(([type, count]) => ({
                        label: type,
                        value: count
                      }))}
                      width={280}
                      height={320}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="space-y-1">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {user.bloodGroup || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.contactNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            title="Edit User"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this user?')) {
                                console.log('Deleting user:', user.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Delete User"
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

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {stats?.overview.totalUsers || 0} users
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  View All Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}