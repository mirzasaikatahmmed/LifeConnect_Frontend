"use client"
import { useState } from 'react';
import { 
  Bell, 
  User, 
  Home, 
  Users, 
  Calendar, 
  MapPin, 
  BarChart3, 
  Settings, 
  Search,
  Menu,
  X,
  Droplets,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(5);

  const navigationItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: true },
    { name: 'Donors', icon: Users, href: '/donors' },
    { name: 'Campaigns', icon: Calendar, href: '/campaigns' },
    { name: 'Blood Banks', icon: MapPin, href: '/blood-banks' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LifeConnect</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Manager</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.active 
                      ? 'bg-red-50 text-red-700 border-b-2 border-red-600' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  } px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
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
                placeholder="Search..."
                className="block w-48 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1.5 px-2 py-1.5 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center border-2 border-red-300">
                  <User className="h-4 w-4 text-red-700" />
                </div>
                <div className="hidden xl:block text-left">
                  <div className="font-semibold text-gray-900 text-xs">Dr. Ahmed</div>
                  <div className="text-xs text-gray-500">Manager</div>
                </div>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Dr. Ahmed Rahman</div>
                        <div className="text-sm text-gray-500">ahmed@bloodconnect.org</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/manager/ViewProfile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </Link>
                  <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </a>
                  <div className="border-t border-gray-200 mt-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
              className="md:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
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
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.active 
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } flex items-center space-x-3 px-4 py-3 text-sm font-medium`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}