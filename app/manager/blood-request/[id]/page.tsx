// File: app/manager/blood-request/[id]/page.tsx (Fixed Version)
"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Droplets,
  Clock,
  AlertCircle,
  CheckCircle,
  Building
} from 'lucide-react';

type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical' | string;
type BloodRequest = {
  id: number;
  patientName: string;
  bloodType: string;
  urgencyLevel: UrgencyLevel;
  hospitalName: string;
  hospitalAddress: string;
  neededBy: string;
  unitsNeeded?: number;
  status?: 'active' | 'fulfilled' | 'cancelled' | 'expired' | string;
  createdAt?: string;
  contactNumber?: string;
  patientAge?: number;
  reason?: string;
  doctorName?: string;
};

export default function BloodRequestDetails() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Dashboard এর সাথে same data + additional fields for details view
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

  useEffect(() => {
    // Simulate API call delay
    const loadData = () => {
      try {
        const requestId = parseInt(params.id as string);
        console.log('Looking for request ID:', requestId); // Debug log
        
        const foundRequest = bloodRequests.find(req => req.id === requestId);
        console.log('Found request:', foundRequest); // Debug log
        
        if (foundRequest) {
          setRequest(foundRequest);
        } else {
          console.log('No request found with ID:', requestId);
          setRequest(null);
        }
      } catch (error) {
        console.error('Error loading request:', error);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to simulate real API call
    setTimeout(loadData, 500);
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'fulfilled': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-4">The blood request you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/manager/Dashboard')} // Fixed: Capital D to match your folder
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/manager/Dashboard')} // Fixed: Capital D
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blood Request Details</h1>
              <p className="text-gray-600 mt-1">Request ID: #{request.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Edit3 className="h-4 w-4" />
              <span>Edit Request</span>
            </button>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete this request?')) {
                  console.log('Deleting request:', request.id);
                  router.push('/manager/Dashboard');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Status Banner */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status ?? 'active')}`}>
            {getStatusIcon(request.status ?? 'active')}
            <span className="ml-2 capitalize">{request.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-red-600 mr-2" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                  <p className="mt-1 text-lg font-medium text-gray-900">{request.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Age</label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {request.patientAge ? `${request.patientAge} years` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Blood Type</label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <Droplets className="h-4 w-4 mr-1" />
                      {request.bloodType}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Units Needed</label>
                  <p className="mt-1 text-lg font-medium text-gray-900">{request.unitsNeeded} units</p>
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 text-red-600 mr-2" />
                Hospital Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Hospital Name</label>
                  <p className="mt-1 text-lg font-medium text-gray-900">{request.hospitalName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    {request.hospitalAddress}
                  </p>
                </div>
                {request.doctorName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Doctor Name</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{request.doctorName}</p>
                  </div>
                )}
                {request.contactNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="mt-1 text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {request.contactNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Details */}
            {request.reason && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  Medical Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Reason for Blood Requirement</label>
                  <p className="mt-1 text-gray-700">{request.reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgency Level */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Level</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="capitalize">{request.urgencyLevel}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Request Created</p>
                    <p className="text-sm text-gray-500">{request.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Needed By</p>
                    <p className="text-sm text-red-600 font-medium">{request.neededBy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    console.log('Mark as Fulfilled:', request.id);
                    alert('Request marked as fulfilled!');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Mark as Fulfilled
                </button>
                <button 
                  onClick={() => {
                    console.log('Update Status:', request.id);
                    alert('Status update functionality will be implemented');
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Update Status
                </button>
                <button 
                  onClick={() => {
                    console.log('Contact Hospital:', request.id);
                    alert('Contact information will be available from hospital data');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Contact Hospital
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}