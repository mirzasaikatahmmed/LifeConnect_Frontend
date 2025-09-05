'use client';

import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ variant = 'outlined', startIcon, endIcon, className, error, helperText, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant={variant}
        fullWidth
        error={error}
        helperText={helperText}
        className={cn(
          'transition-all duration-200',
          error && 'animate-pulse',
          className
        )}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start" className="text-gray-400">
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end" className="text-gray-400">
              {endIcon}
            </InputAdornment>
          ),
          className: cn(
            'rounded-lg transition-all duration-200',
            'hover:shadow-soft focus-within:shadow-medium',
            error && 'border-red-500 focus-within:ring-red-500'
          ),
        }}
        InputLabelProps={{
          className: cn(
            'font-medium transition-all duration-200',
            error ? 'text-red-500' : 'text-gray-600'
          ),
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;