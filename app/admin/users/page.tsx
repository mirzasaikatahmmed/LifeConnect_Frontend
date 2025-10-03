'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  bloodType?: string;
  phoneNumber?: string;
  userType?: 'donor' | 'manager' | 'admin'; // Keep for backward compatibility
  role?: {
    id: number;
    name: string;
  };
  roleId?: number;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Helper function to get role display name
const getRoleDisplayName = (user: User) => {
  if (user.role?.name) {
    return user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1);
  }
  if (user.userType) {
    return user.userType.charAt(0).toUpperCase() + user.userType.slice(1);
  }
  return 'Unknown';
};

// Helper function to get role name for filtering and statistics
const getRoleName = (user: User) => {
  if (user.role?.name) {
    return user.role.name;
  }
  return user.userType || 'unknown';
};

export default function UsersManagement() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [isAuthenticated, token, router, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Users API Response:', response.data);
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);

      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        router.push('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load users');
      }

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!userId || !Number.isInteger(userId)) {
      alert('Invalid user ID');
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    // Validate all user IDs are valid integers
    const validUserIds = Array.from(selectedUsers).filter(userId =>
      userId && Number.isInteger(userId)
    );

    if (validUserIds.length !== selectedUsers.size) {
      alert('Some selected users have invalid IDs. Please refresh the page and try again.');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} selected users? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletePromises = validUserIds.map(userId =>
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);

      // Remove users from local state
      setUsers(users.filter(user => !selectedUsers.has(user.id)));
      setSelectedUsers(new Set());
    } catch (err: any) {
      console.error('Error bulk deleting users:', err);
      alert('Failed to delete some users. Please try again.');
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert('Failed to export users');
    }
  };

  const handleSelectUser = (userId: number) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length && filteredUsers.every(user => selectedUsers.has(user.id))) {
      // Deselect all users on current page
      const newSelectedUsers = new Set(selectedUsers);
      filteredUsers.forEach(user => newSelectedUsers.delete(user.id));
      setSelectedUsers(newSelectedUsers);
    } else {
      // Select all users on current page
      const newSelectedUsers = new Set(selectedUsers);
      filteredUsers.forEach(user => newSelectedUsers.add(user.id));
      setSelectedUsers(newSelectedUsers);
    }
  };

  // Reset to page 1 when search/filter changes
  const currentFilters = searchTerm + filterStatus + filterRole;
  const previousFilters = React.useRef(currentFilters);
  React.useEffect(() => {
    if (previousFilters.current !== currentFilters) {
      setCurrentPage(1);
      previousFilters.current = currentFilters;
    }
  }, [currentFilters]);

  if (!isAuthenticated) {
    return null;
  }

  const allFilteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bloodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phoneNumber?.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);

    const matchesRole = filterRole === 'all' || getRoleName(user) === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(allFilteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredUsers = allFilteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getRoleColor = (user: User) => {
    const roleName = getRoleName(user);
    switch (roleName) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'donor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all system users and their permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchUsers}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => router.push('/admin/users/create')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create User</span>
            </button>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => getRoleName(u) === 'donor').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Droplets className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Managers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => getRoleName(u) === 'manager').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
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
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="manager">Managers</option>
                  <option value="admin">Admins</option>
                </select>
                <button
                  onClick={handleExportUsers}
                  className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {selectedUsers.size > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <span className="text-blue-700 font-medium">
                  {selectedUsers.size} users selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div></td>
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
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 hover:text-red-600 cursor-pointer">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {user.bloodType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phoneNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user)}`}>
                          {getRoleDisplayName(user)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
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
                            onClick={() => handleDeleteUser(user.id, user.name)}
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
                Showing {startIndex + 1}-{Math.min(endIndex, allFilteredUsers.length)} of {allFilteredUsers.length} users
              </div>
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="px-3 py-1 text-sm text-gray-400">
                        {page}
                      </span>
                    )
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}