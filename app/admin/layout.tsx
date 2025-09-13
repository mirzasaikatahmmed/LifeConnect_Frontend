'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminNavigation from '@/components/admin/Navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Admin Layout - User data:', JSON.stringify(user, null, 2)); // Debug log
    console.log('Admin Layout - Is authenticated:', isAuthenticated); // Debug log
    console.log('Admin Layout - Loading:', loading); // Debug log
    console.log('Admin Layout - Current pathname:', pathname); // Debug log

    // Don't redirect while loading
    if (loading) {
      console.log('Admin Layout - Still loading, waiting...');
      return;
    }

    // Allow access to register page without authentication
    if (!isAuthenticated && !pathname.includes('/register')) {
      console.log('Admin Layout - Not authenticated, redirecting to login');
      router.replace('/login');
      return;
    }

    // Check if user has admin role for admin routes (only if authenticated and not loading)
    if (isAuthenticated && !loading && pathname.startsWith('/admin') && !pathname.includes('/register')) {
      console.log('Admin Layout - Checking role for admin access. User role:', user?.role);
      if (user?.role !== 'admin') {
        console.log('Admin Layout - User is not admin, redirecting based on role');
        // Redirect non-admin users to their appropriate dashboard using replace to prevent back navigation
        if (user?.role === 'manager') {
          console.log('Admin Layout - Redirecting manager to manager dashboard');
          router.replace('/manager/Dashboard');
        } else if (user?.role === 'donor' || user?.role === 'user') {
          console.log('Admin Layout - Redirecting user to user dashboard');
          router.replace('/user');
        } else {
          console.log('Admin Layout - Unknown role, redirecting to login');
          router.replace('/login');
        }
        return; // Exit early to prevent rendering admin layout
      } else {
        console.log('Admin Layout - User is admin, allowing access');
      }
    }
  }, [isAuthenticated, loading, router, pathname, user]);

  // Show loading spinner while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && !pathname.includes('/register')) {
    return null;
  }

  // Simple layout for register page
  if (pathname.includes('/register')) {
    return <>{children}</>;
  }

  // Don't render admin layout for non-admin users
  if (isAuthenticated && !loading && pathname.startsWith('/admin') && !pathname.includes('/register') && user?.role !== 'admin') {
    return null; // Return null while redirecting to prevent flash of admin layout
  }

  return (
    <>
      <AdminNavigation />
      {children}
    </>
  );
}