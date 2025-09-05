'use client';

import { Typography } from '@mui/material';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
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
      'min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
      'flex items-center justify-center p-4'
    )}>
      <div className={cn(
        'w-full',
        className?.includes('max-w-lg') ? 'max-w-lg' : 'max-w-md'
      )}>
        <Card className={cn('animate-slide-up shadow-2xl border-0', className)} hover={false} padding="lg">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Typography variant="h4" className="text-white font-bold">
                  LC
                </Typography>
              </div>
            </div>
            
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              {title}
            </Typography>
            
            {subtitle && (
              <Typography variant="body1" className="text-gray-600 leading-relaxed">
                {subtitle}
              </Typography>
            )}
          </CardHeader>
          
          <CardBody>
            {children}
          </CardBody>
        </Card>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-secondary-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}