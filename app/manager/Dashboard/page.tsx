// File: app/manager/dashboard/page.tsx (Updated version)
"use client"
import { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Activity, 
  List, 
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Droplets,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Add this import

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'|string;
   type BloodRequest = {
  id: number;
  patientName: string;
  bloodType: string;
  urgencyLevel: UrgencyLevel
  hospitalName: string;
  hospitalAddress: string;
  neededBy: string;
  unitsNeeded?: number;
  status?: 'active' | 'fulfilled' | 'cancelled' | 'expired'| string;
  createdAt?: string;
};

  // Sample data
  const stats = {
    totalDonors: 1247,
    activeRequests: 23,
    completedToday: 8,
    criticalRequests: 5
  };

  const bloodRequests = [
     {
    id: 1,
    patientName: 'রহিম উদ্দিন',
    bloodType: 'O+',
    urgencyLevel: 'critical',
    hospitalName: 'ঢাকা মেডিকেল কলেজ',
    hospitalAddress: 'Dhaka Address Here',
    neededBy: '2025-01-15',
    unitsNeeded: 2,
    status: 'active',
    createdAt: '2025-01-10',
  },
  {
    id: 2,
    patientName: 'ফাতেমা খাতুন',
    bloodType: 'A+',
    urgencyLevel: 'medium',
    hospitalName: 'বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়',
    hospitalAddress: 'Dhaka Address Here',
    neededBy: '2025-01-14',
    unitsNeeded: 1,
    status: 'fulfilled',
    createdAt: '2025-01-10',
  },
  {
    id: 3,
    patientName: 'করিম মিয়া',
    bloodType: 'B-',
    urgencyLevel: 'high',
    hospitalName: 'স্কয়ার হাসপাতাল',
    hospitalAddress: 'Dhaka Address Here',
    neededBy: '2025-01-16',
    unitsNeeded: 3,
    status: 'active',
    createdAt: '2025-01-11',
  },{
    id: 4,
    patientName: 'করিম মিয়া',
    bloodType: 'B-',
    urgencyLevel: 'high',
    hospitalName: 'স্কয়ার হাসপাতাল',
    hospitalAddress: 'Dhaka Address Here',
    neededBy: '2025-01-16',
    unitsNeeded: 3,
    status: 'active',
    createdAt: '2025-01-11',
  }
  ];
   const router = useRouter();
   const handleCreate = () => {
    setShowCreateModal(false);
    router.push("/manager/CreateBloodRequest");
  };

  const getStatusColor = (status:string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency:string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Blood Donation Management System</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blood Request</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDonors}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeRequests}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">+3</span>
              <span className="text-gray-500 ml-1">new today</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedToday}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">8 donations</span>
              <span className="text-gray-500 ml-1">successful</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Critical Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.criticalRequests}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">Urgent</span>
              <span className="text-gray-500 ml-1">attention needed</span>
            </div>
          </div>
        </div>

        {/* Blood Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Blood Requests</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
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
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="fulfilled">fulfilled</option>
                  <option value="cancelled">Cancelled</option>
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Droplets className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <Link 
                            href={`/manager/blood-request/${request.id}`}
                            className="hover:text-red-600 transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-900 hover:text-red-600 cursor-pointer">{request.patientName}</div>
                          </Link>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {request.hospitalAddress}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.unitsNeeded} units
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{request.hospitalName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                        {request.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {request.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* <Link href={`/manager/blood-request/${request.id}`}> */}
                          <button 
                            onClick={() => router.push(`/manager/blood-request/${request.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        {/* </Link> */}
                        <button 
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Edit Request"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete Request"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this request?')) {
                              // Handle delete logic here
                              console.log('Deleting request:', request.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredRequests.length} of {bloodRequests.length} requests
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-red-600 text-white rounded">1</span>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Blood Request</h3>
            <p className="text-gray-600 mb-4">Blood request creation form will be implemented here.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button onClick={handleCreate} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Blood Request</h3>
            <p className="text-gray-600 mb-4">Edit form for {selectedRequest?.hospitalName} blood request will be implemented here.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Update Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}