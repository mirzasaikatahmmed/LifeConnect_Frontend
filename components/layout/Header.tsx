'use client';

import { Heart } from "lucide-react";
import Button from "@/components/Home/Button";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultDashboardPath } from '@/lib/authUtils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleAuthAction = (action: 'login' | 'register') => {
    setIsMenuOpen(false); // Close mobile menu if open
    // If user is already authenticated, redirect to their dashboard
    if (isAuthenticated && user?.role) {
      const dashboardPath = getDefaultDashboardPath(user.role);
      router.push(dashboardPath);
    } else {
      // Otherwise, go to the requested auth page
      router.push(`/${action}`);
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LifeConnect</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAuthAction('login')}
              >
                {isAuthenticated ? 'Dashboard' : 'Sign In'}
              </Button>
              <Button
                size="sm"
                onClick={() => handleAuthAction('register')}
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>

          {/* Mobile menu toggle button */}
          <div className="md:hidden">
            <input
              id="menu-toggle"
              type="checkbox"
              className="hidden peer"
              checked={isMenuOpen}
              onChange={(e) => setIsMenuOpen(e.target.checked)}
            />
            <label
              htmlFor="menu-toggle"
              className="cursor-pointer text-gray-700 hover:text-red-600"
            >
              {/* Hamburger / Close icon */}
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAuthAction('login')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAuthAction('register')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}