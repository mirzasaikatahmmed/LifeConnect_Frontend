'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from "@/components/manager/Navigation";

export default function ManagerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Manager Layout - User data:', JSON.stringify(user, null, 2)); // Debug log
    console.log('Manager Layout - Is authenticated:', isAuthenticated); // Debug log
    console.log('Manager Layout - Loading:', loading); // Debug log
    console.log('Manager Layout - Current pathname:', pathname); // Debug log
    
    // Don't redirect while loading
    if (loading) {
      console.log('Manager Layout - Still loading, waiting...');
      return;
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('Manager Layout - Not authenticated, redirecting to login');
      router.replace('/login');
      return;
    }

    // Check if user has manager role for manager routes (only if authenticated and not loading)
    if (isAuthenticated && !loading && pathname.startsWith('/manager')) {
      console.log('Manager Layout - Checking role for manager access. User role:', user?.role);
      if (user?.role !== 'manager') {
        console.log('Manager Layout - User is not manager, redirecting based on role');
        // Redirect non-manager users to their appropriate dashboard
        if (user?.role === 'admin') {
          console.log('Manager Layout - Redirecting admin to admin dashboard');
          router.replace('/admin/dashboard');
        } else if (user?.role === 'donor' || user?.role === 'user') {
          console.log('Manager Layout - Redirecting user to user dashboard');
          router.replace('/user');
        } else {
          console.log('Manager Layout - Unknown role, redirecting to login');
          router.replace('/login');
        }
        return;
      } else {
        console.log('Manager Layout - User is manager, allowing access');
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

  // Don't render manager layout for non-authenticated or non-manager users
  if (!isAuthenticated || (isAuthenticated && !loading && pathname.startsWith('/manager') && user?.role !== 'manager')) {
    return null; // Return null while redirecting
  }

  
  return (
    <>
      <Navigation/>
      {children}
    </>
  );
}