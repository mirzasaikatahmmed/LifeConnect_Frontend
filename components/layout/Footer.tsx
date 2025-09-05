'use client';

import { Typography, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900',
      'text-white mt-auto relative overflow-hidden'
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Typography variant="h6" className="text-white font-bold text-sm">
                  LC
                </Typography>
              </div>
              <Typography variant="h6" className="font-bold text-xl">
                LifeConnect
              </Typography>
            </div>
            <Typography variant="body2" className="text-gray-300 leading-relaxed">
              Connecting lives, building communities. We bring people together through innovative technology and meaningful experiences.
            </Typography>
            
            {/* Social Media */}
            <div className="flex space-x-2 pt-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: LinkedIn, href: '#', label: 'LinkedIn' }
              ].map(({ icon: Icon, href, label }) => (
                <IconButton
                  key={label}
                  href={href}
                  className={cn(
                    'text-gray-300 hover:text-white hover:bg-primary-600',
                    'transition-all duration-200 hover:scale-110'
                  )}
                  size="small"
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h6" className="font-semibold mb-4 text-primary-300">
              Quick Links
            </Typography>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blog', href: '/blog' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link 
                    href={href} 
                    className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <Typography variant="h6" className="font-semibold mb-4 text-primary-300">
              Support
            </Typography>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'FAQ', href: '/faq' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link 
                    href={href} 
                    className="text-gray-300 hover:text-primary-300 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <Typography variant="h6" className="font-semibold mb-4 text-primary-300">
              Get in Touch
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Email fontSize="small" className="text-primary-400" />
                <Typography variant="body2">support@lifeconnect.com</Typography>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone fontSize="small" className="text-primary-400" />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <LocationOn fontSize="small" className="text-primary-400" />
                <Typography variant="body2">123 Business Ave, Suite 100</Typography>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Typography variant="body2" className="text-gray-300 mb-3">
                Subscribe to our newsletter
              </Typography>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className={cn(
                    'flex-1 px-3 py-2 bg-gray-700 border border-gray-600',
                    'rounded-md text-white placeholder-gray-400 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  )}
                />
                <button className={cn(
                  'px-4 py-2 bg-gradient-primary text-white text-sm font-medium',
                  'rounded-md hover:shadow-lg transition-all duration-200',
                  'hover:-translate-y-0.5'
                )}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className="border-gray-700" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Typography variant="body2" className="text-gray-400 text-center md:text-left">
            © {currentYear} LifeConnect. All rights reserved.
          </Typography>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}