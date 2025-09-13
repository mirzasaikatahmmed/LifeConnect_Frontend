"use client"
import { useEffect, useState } from 'react';
import {
  Bell,
  User,
  Home,
  Users,
  Activity,
  Mail,
  Settings,
  Search,
  Menu,
  X,
  Droplets,
  ChevronDown,
  Shield,
  AlertTriangle,
  BarChart3,
  Database,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminNavigation() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, timestamp: Date}>>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate some admin notifications
    setNotificationCount(3);
    setNotifications([
      {
        id: '1',
        message: 'New user registration pending approval',
        timestamp: new Date()
      },
      {
        id: '2',
        message: 'System backup completed successfully',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        message: 'Blood request alert sent to 25 donors',
        timestamp: new Date(Date.now() - 7200000)
      }
    ]);
  }, []);

  const clearNotifications = () => {
    setNotificationCount(0);
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Blood Requests', icon: Droplets, href: '/admin/blood-requests' },
    { name: 'System Alerts', icon: AlertTriangle, href: '/admin/alerts' },
    { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
    { name: 'Email Center', icon: Mail, href: '/admin/mailer' }
    // { name: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center -ml-2">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LifeConnect</span>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">Admin</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    } px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Search Bar */}
            <div className="hidden xl:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users, requests..."
                className="block w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Admin Notifications</h3>
                      {notificationCount > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                              <Shield className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1.5 px-2 py-1.5 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center border-2 border-purple-300">
                  <User className="h-4 w-4 text-purple-700" />
                </div>
                <div className="hidden xl:block text-left">
                  <div className="font-semibold text-gray-900 text-xs">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.name || 'Administrator'}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  <Link href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </Link>
                  {/* <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Settings
                  </Link> */}
                  <Link href="/admin/system" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Database className="h-4 w-4 mr-3" />
                    System Info
                  </Link>
                  <div className="border-t border-gray-200 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Mobile Search */}
              <div className="px-2 pb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users, requests..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    } flex items-center space-x-3 px-4 py-3 text-sm font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}