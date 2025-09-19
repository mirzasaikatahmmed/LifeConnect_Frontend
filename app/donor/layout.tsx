'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../../components/donor/DonorNav';
import Footer from '@/components/donor/DonorNav';

export default function DonorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
        if (!loading && user && user.role !== 'donor') {
            router.replace('/unauthorized'); 
        }
    }, [isAuthenticated, loading, user, router]);

    if (loading || !isAuthenticated || (user && user.role !== 'donor')) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
                <p className="ml-4 text-gray-600">Loading donor dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow p-4 md:p-8 bg-gray-50">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
            
        </div>
    );
}