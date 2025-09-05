'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Alert,
  Skeleton,
  Chip
} from '@mui/material';
import { 
  Dashboard, 
  People, 
  LocalHospital, 
  Notifications,
  TrendingUp,
  TrendingDown,
  Assessment,
  Refresh,
  Visibility
} from '@mui/icons-material';
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, token, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, chartsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/charts`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setCharts(chartsResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Dashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="h4" className="font-bold text-gray-800">
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Real-time system overview and analytics
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <Refresh className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-right">
                <Typography variant="body1" className="font-semibold text-gray-800">
                  {user?.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Administrator
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Here's what's happening with LifeConnect today.
          </Typography>
          {stats && (
            <Typography variant="caption" className="text-gray-500">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </Typography>
          )}
        </div>

        {/* Stats Cards */}
        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {loading ? (
                      <Skeleton width={80} height={40} />
                    ) : (
                      <Typography variant="h3" className="font-bold text-blue-700">
                        {stats?.overview.totalUsers.toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" className="text-blue-600 mt-1 font-medium">
                      Total Users
                    </Typography>
                    {stats && (
                      <div className="flex items-center mt-2 space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <Typography variant="caption" className="text-green-600 font-medium">
                          {stats.overview.activeUsers} active
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center">
                    <People className="w-8 h-8 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {loading ? (
                      <Skeleton width={80} height={40} />
                    ) : (
                      <Typography variant="h3" className="font-bold text-red-700">
                        {stats?.userTypes.donors.toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" className="text-red-600 mt-1 font-medium">
                      Blood Donors
                    </Typography>
                    {stats && (
                      <div className="flex items-center mt-2">
                        <Chip 
                          label="Critical Resource" 
                          size="small" 
                          className="bg-red-200 text-red-700 font-medium"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-red-200 rounded-2xl flex items-center justify-center">
                    <LocalHospital className="w-8 h-8 text-red-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {loading ? (
                      <Skeleton width={80} height={40} />
                    ) : (
                      <Typography variant="h3" className="font-bold text-green-700">
                        {stats?.bloodRequests.active.toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" className="text-green-600 mt-1 font-medium">
                      Active Requests
                    </Typography>
                    {stats && (
                      <div className="flex items-center mt-2 space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <Typography variant="caption" className="text-green-600 font-medium">
                          {stats.bloodRequests.completed} completed
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-green-200 rounded-2xl flex items-center justify-center">
                    <Assessment className="w-8 h-8 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    {loading ? (
                      <Skeleton width={80} height={40} />
                    ) : (
                      <Typography variant="h3" className="font-bold text-yellow-700">
                        {stats?.alerts.active.toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" className="text-yellow-600 mt-1 font-medium">
                      System Alerts
                    </Typography>
                    {stats && (
                      <div className="flex items-center mt-2">
                        <Chip 
                          label={stats.alerts.active > 0 ? "Attention Needed" : "All Clear"} 
                          size="small" 
                          className={stats.alerts.active > 0 ? "bg-yellow-200 text-yellow-700" : "bg-green-200 text-green-700"}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-yellow-200 rounded-2xl flex items-center justify-center">
                    <Notifications className="w-8 h-8 text-yellow-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} className="mb-8">
          {/* User Registrations Chart */}
          <Grid item xs={12} lg={8}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h6" className="font-bold text-gray-800">
                      User Registration Trends
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      Monthly user growth over time
                    </Typography>
                  </div>
                  <Visibility className="w-5 h-5 text-gray-400" />
                </div>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={320} />
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
                  <div className="h-[320px] flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Blood Type Distribution */}
          <Grid item xs={12} lg={4}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h6" className="font-bold text-gray-800">
                      Blood Type Distribution
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      Donor blood type breakdown
                    </Typography>
                  </div>
                  <LocalHospital className="w-5 h-5 text-gray-400" />
                </div>
                {loading ? (
                  <Skeleton variant="circular" width={280} height={280} className="mx-auto" />
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
                  <div className="h-[320px] flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={4}>
          {/* User Types Chart */}
          <Grid item xs={12} md={6}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h6" className="font-bold text-gray-800">
                      User Types Overview
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      Distribution of user roles
                    </Typography>
                  </div>
                  <People className="w-5 h-5 text-gray-400" />
                </div>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={280} />
                ) : stats ? (
                  <div className="w-full overflow-x-auto">
                    <BarChart
                      data={[
                        { label: 'Donors', value: stats.userTypes.donors, color: '#EF4444' },
                        { label: 'Managers', value: stats.userTypes.managers, color: '#10B981' },
                        { label: 'Admins', value: stats.userTypes.admins, color: '#3B82F6' }
                      ]}
                      width={380}
                      height={280}
                      className="min-w-[350px]"
                    />
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h6" className="font-bold text-gray-800">
                      Quick Actions
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      Common administrative tasks
                    </Typography>
                  </div>
                  <Assessment className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/admin/users')}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <People className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                          Manage Users
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          View, edit, and manage user accounts
                        </Typography>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/admin/blood-requests')}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <LocalHospital className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                          Blood Requests
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Monitor and manage blood requests
                        </Typography>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/admin/alerts')}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Notifications className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body1" className="font-semibold text-gray-800 mb-1">
                          System Alerts
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Create and manage system notifications
                        </Typography>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}