'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AuthContainer({ title, subtitle, children, className }: AuthContainerProps) {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50',
      'flex items-center justify-center p-4'
    )}>
      <div className={cn(
        'w-full max-w-lg'
      )}>
        <div className={cn(
          'bg-white shadow-xl border border-gray-200 rounded-2xl p-8',
          'animate-slide-up hover:shadow-2xl transition-all duration-300',
          className
        )}>
          {/* LifeConnect Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-red-600 p-3 rounded-full shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LifeConnect</h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>

            {subtitle && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}