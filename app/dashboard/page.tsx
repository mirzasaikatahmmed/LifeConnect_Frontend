'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getDefaultDashboardPath } from '@/lib/authUtils';

export default function DashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Redirect to appropriate dashboard based on user role
    const dashboardPath = getDefaultDashboardPath(user?.role);
    console.log(`Redirecting ${user?.role} user to: ${dashboardPath}`);
    router.replace(dashboardPath);
  }, [isAuthenticated, loading, user, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}