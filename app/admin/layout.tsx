'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Dashboard, 
  People, 
  LocalHospital, 
  Notifications, 
  Assessment, 
  Settings, 
  ExitToApp,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  Email,
  SupervisorAccount,
  Assignment,
  BarChart,
  TrendingUp,
  Security
} from '@mui/icons-material';
import { Typography, Drawer, IconButton, Divider } from '@mui/material';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    label: 'Dashboard', 
    icon: Dashboard, 
    href: '/admin/dashboard',
    description: 'Overview & Analytics'
  },
  { 
    label: 'User Management', 
    icon: People, 
    href: '/admin/users',
    description: 'Manage Users & Roles'
  },
  { 
    label: 'Blood Requests', 
    icon: LocalHospital, 
    href: '/admin/blood-requests',
    description: 'Monitor Requests'
  },
  { 
    label: 'System Alerts', 
    icon: Notifications, 
    href: '/admin/alerts',
    description: 'Notifications & Alerts'
  },
  { 
    label: 'Reports', 
    icon: Assessment, 
    href: '/admin/reports',
    description: 'Analytics & Reports',
    subItems: [
      { label: 'User Reports', href: '/admin/reports/users', icon: People },
      { label: 'Donation Reports', href: '/admin/reports/donations', icon: LocalHospital },
      { label: 'Activity Reports', href: '/admin/reports/activity', icon: TrendingUp },
      { label: 'Blood Compatibility', href: '/admin/reports/compatibility', icon: Assignment },
      { label: 'Monthly Summary', href: '/admin/reports/monthly', icon: BarChart },
    ]
  },
  { 
    label: 'Email Center', 
    icon: Email, 
    href: '/admin/mailer',
    description: 'Email Management'
  },
  { 
    label: 'Admin Settings', 
    icon: Settings, 
    href: '/admin/settings',
    description: 'System Configuration'
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    // Allow access to register page without authentication
    if (!isAuthenticated && !pathname.includes('/register')) {
      router.push('/login');
    }
  }, [isAuthenticated, router, pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (!isAuthenticated && !pathname.includes('/register')) {
    return null;
  }

  // Simple layout for register page
  if (pathname.includes('/register')) {
    return <>{children}</>;
  }

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Typography variant="h6" className="text-white font-bold">
              LC
            </Typography>
          </div>
          {sidebarOpen && (
            <div>
              <Typography variant="h6" className="text-white font-bold">
                LifeConnect
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Admin Panel
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <Typography variant="body2" className="text-white font-medium truncate">
                {user?.name}
              </Typography>
              <Typography variant="caption" className="text-gray-400 truncate">
                {user?.role || 'Administrator'}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItem === item.label;

            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.label);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200 flex-shrink-0",
                    isActive && "drop-shadow-sm"
                  )} />
                  {sidebarOpen && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item.label}
                        </div>
                        <div className={cn(
                          "text-xs opacity-75 truncate",
                          isActive ? "text-blue-100" : "text-gray-500"
                        )}>
                          {item.description}
                        </div>
                      </div>
                      {hasSubItems && (
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                          isExpanded && "transform rotate-90"
                        )} />
                      )}
                    </>
                  )}
                </button>

                {/* Sub Items */}
                {hasSubItems && isExpanded && sidebarOpen && (
                  <div className="ml-6 mt-1 space-y-1 pb-2">
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = isItemActive(subItem.href);
                      
                      return (
                        <button
                          key={subItem.label}
                          onClick={() => router.push(subItem.href)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isSubActive 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          )}
                        >
                          <SubIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <ExitToApp className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col transition-all duration-300 shadow-2xl",
        sidebarOpen ? "w-80" : "w-20"
      )}>
        {sidebarContent}
        
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-20 -right-3 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-50"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="lg:hidden"
        PaperProps={{
          className: "w-80"
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <Typography variant="h6" className="font-semibold text-gray-800">
              Admin Panel
            </Typography>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}