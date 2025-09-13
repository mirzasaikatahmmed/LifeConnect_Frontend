'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRegisterContainer from '@/components/admin/AdminRegisterContainer';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultDashboardPath } from '@/lib/authUtils';

export default function AdminRegisterPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role) {
      console.log('User already authenticated, redirecting to dashboard');
      const dashboardPath = getDefaultDashboardPath(user.role);
      router.replace(dashboardPath);
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading spinner while checking authentication or redirecting
  if (loading || (isAuthenticated && user?.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? 'Loading...' : 'Redirecting to dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminRegisterContainer />
    </div>
  );
}