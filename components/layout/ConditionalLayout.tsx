'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();


  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    '/login',
    '/register', 
    '/forgot-password'
  ];

  // Check if current route should hide header/footer
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route => 
    pathname.startsWith(route)
  ) || (isAuthenticated && pathname.startsWith('/admin'));

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <main className={shouldHideHeaderFooter ? "min-h-screen" : "flex-1"}>
        {children}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}