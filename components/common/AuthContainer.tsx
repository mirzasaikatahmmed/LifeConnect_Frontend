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
      'min-h-screen bg-gray-50',
      'flex items-center justify-center p-4'
    )}>
      <div className={cn(
        'w-full',
        className?.includes('max-w-lg') ? 'max-w-lg' : 'max-w-md'
      )}>
        <Card className={cn(
          'bg-white shadow-lg border border-gray-200',
          'animate-slide-up hover:shadow-xl transition-all duration-300',
          className
        )} hover={false} padding="lg">
          <CardHeader className="text-center">
            {/* Simple Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
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
      </div>
    </div>
  );
}