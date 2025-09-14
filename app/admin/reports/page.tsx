'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Users,
  Activity,
  Heart,
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Target,
  Database,
  FileText,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { TokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';

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

interface BloodRequestAnalytics {
  summary: {
    totalRequests: number;
    activeRequests: number;
    completedRequests: number;
    cancelledRequests: number;
    overallFulfillmentRate: string;
  };
  fulfillmentRates: {
    overall: string;
    byBloodType: Record<string, string>;
  };
  responseMetrics: {
    averageResponseTime: string;
    medianResponseTime: string;
  };
  geographicDistribution: Array<{
    location: string;
    count: number;
    fulfillmentRate: string;
  }>;
  urgencyAnalysis: Record<string, {
    count: number;
    avgFulfillmentTime: string;
  }>;
}

interface DonationAnalytics {
  donationTrends: {
    totalDonations: number;
    thisMonth: number;
    lastMonth: number;
    growthRate: string;
  };
  donorRetention: {
    returnDonors: string;
    firstTimeDonors: string;
    averageDonationsPerDonor: number;
  };
  collectionCenters: Array<{
    name: string;
    donations: number;
    avgUnitsPerDonation: number;
    efficiency: string;
  }>;
  seasonalTrends: {
    quarters: Array<{
      quarter: string;
      donations: number;
    }>;
  };
  bloodTypeBreakdown: Record<string, number>;
}

interface UserReports {
  summary: {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    newUsersLast30Days: number;
    activationRate: string;
    verificationRate: string;
  };
  usersByType: Record<string, number>;
  usersByBloodType: Record<string, number>;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [bloodRequestAnalytics, setBloodRequestAnalytics] = useState<BloodRequestAnalytics | null>(null);
  const [donationAnalytics, setDonationAnalytics] = useState<DonationAnalytics | null>(null);
  const [userReports, setUserReports] = useState<UserReports | null>(null);

  const makeAPICall = async (endpoint: string) => {
    const authToken = token || TokenStorage.getToken();
    if (!authToken) {
      throw new Error('Authentication required');
    }

    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`;

      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (parseError) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            let errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            reject(new Error(errorMessage));
          }
        }
      };

      xhr.onerror = function() {
        reject(new Error('Network error'));
      };

      xhr.send();
    });
  };

  const fetchAllReports = async () => {
    try {
      setError(null);
      const [dashboardData, bloodRequestData, donationData, userData] = await Promise.all([
        makeAPICall('dashboard/stats'),
        makeAPICall('reports/blood-request-analytics'),
        makeAPICall('reports/donation-analytics'),
        makeAPICall('reports/users')
      ]);

      setDashboardStats(dashboardData);
      setBloodRequestAnalytics(bloodRequestData);
      setDonationAnalytics(donationData);
      setUserReports(userData);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllReports();
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  // Prepare chart data
  const bloodTypeChartData = dashboardStats?.bloodTypeDistribution ?
    Object.entries(dashboardStats.bloodTypeDistribution).map(([type, count]) => ({
      name: type,
      value: count
    })) : [];

  const donationTrendsData = donationAnalytics?.seasonalTrends?.quarters?.map(q => ({
    name: q.quarter,
    donations: q.donations
  })) || [];

  const geographicData = bloodRequestAnalytics?.geographicDistribution?.map(item => ({
    name: item.location,
    requests: item.count,
    fulfillment: parseFloat(item.fulfillmentRate.replace('%', ''))
  })) || [];

  const collectionCenterData = donationAnalytics?.collectionCenters?.map(center => ({
    name: center.name,
    donations: center.donations,
    efficiency: parseFloat(center.efficiency.replace('%', ''))
  })) || [];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">Loading reports...</span>
          </div>
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
                <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
                Admin Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive analytics and reporting dashboard
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Reports</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'blood-requests', name: 'Blood Requests', icon: Heart },
              { id: 'donations', name: 'Donations', icon: Activity },
              { id: 'users', name: 'Users', icon: Users },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && dashboardStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats.overview.totalUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats.overview.activeUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blood Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats.bloodRequests.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats.alerts.active.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blood Type Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Type Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bloodTypeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bloodTypeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Types */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Donors</span>
                    <span className="text-sm font-medium">{dashboardStats.userTypes.donors.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Managers</span>
                    <span className="text-sm font-medium">{dashboardStats.userTypes.managers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Admins</span>
                    <span className="text-sm font-medium">{dashboardStats.userTypes.admins.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blood Requests Tab */}
        {activeTab === 'blood-requests' && bloodRequestAnalytics && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bloodRequestAnalytics.summary.totalRequests.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {bloodRequestAnalytics.summary.activeRequests.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-green-600">
                  {bloodRequestAnalytics.summary.completedRequests.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-red-600">
                  {bloodRequestAnalytics.summary.cancelledRequests.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Fulfillment Rate</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {bloodRequestAnalytics.summary.overallFulfillmentRate}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Geographic Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Geographic Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="requests" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Response Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Response Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="text-sm font-medium">{bloodRequestAnalytics.responseMetrics.averageResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Median Response Time</span>
                    <span className="text-sm font-medium">{bloodRequestAnalytics.responseMetrics.medianResponseTime}</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Fulfillment by Blood Type</h4>
                    <div className="space-y-2">
                      {Object.entries(bloodRequestAnalytics.fulfillmentRates.byBloodType).map(([type, rate]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{type}</span>
                          <span className="text-sm font-medium">{rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && donationAnalytics && (
          <div className="space-y-6">
            {/* Donation Trends */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {donationAnalytics.donationTrends.totalDonations.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {donationAnalytics.donationTrends.thisMonth.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Last Month</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {donationAnalytics.donationTrends.lastMonth.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className={`text-2xl font-semibold ${
                  donationAnalytics.donationTrends.growthRate.startsWith('-') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {donationAnalytics.donationTrends.growthRate}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quarterly Trends */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quarterly Donation Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donationTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="donations" stroke="#4ECDC4" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Collection Centers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Collection Center Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={collectionCenterData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="donations" fill="#45B7D1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Donor Retention */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Donor Retention Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{donationAnalytics.donorRetention.returnDonors}</p>
                  <p className="text-sm text-gray-600 mt-1">Return Donors</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{donationAnalytics.donorRetention.firstTimeDonors}</p>
                  <p className="text-sm text-gray-600 mt-1">First-time Donors</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{donationAnalytics.donorRetention.averageDonationsPerDonor}</p>
                  <p className="text-sm text-gray-600 mt-1">Avg Donations per Donor</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && userReports && (
          <div className="space-y-6">
            {/* User Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="text-sm font-medium">{userReports.summary.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-medium">{userReports.summary.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verified Users</span>
                    <span className="text-sm font-medium">{userReports.summary.verifiedUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Users (30d)</span>
                    <span className="text-sm font-medium">{userReports.summary.newUsersLast30Days.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Success Rates</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Activation Rate</span>
                    <span className="text-sm font-medium">{userReports.summary.activationRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification Rate</span>
                    <span className="text-sm font-medium">{userReports.summary.verificationRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(userReports.usersByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type}s</span>
                      <span className="text-sm font-medium">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blood Type Distribution for Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Blood Type Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(userReports.usersByBloodType).map(([type, count]) => (
                  <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">Data is refreshed automatically every hour</p>
        </div>
      </div>
    </div>
  );
}