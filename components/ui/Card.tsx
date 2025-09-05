'use client';

import { Card as MuiCard, CardContent, CardActions, Paper } from '@mui/material';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, padding = 'md', ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <MuiCard
        ref={ref}
        elevation={0}
        className={cn(
          'bg-white rounded-xl shadow-large border border-gray-100',
          'transition-all duration-300 ease-in-out',
          hover && 'hover:shadow-glow hover:-translate-y-1 cursor-pointer',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cn('mb-6', className)}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody = ({ children, className }: CardBodyProps) => (
  <CardContent className={cn('p-0', className)}>
    {children}
  </CardContent>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => (
  <CardActions className={cn('p-0 mt-6 flex justify-end gap-3', className)}>
    {children}
  </CardActions>
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;
export { CardHeader, CardBody, CardFooter };