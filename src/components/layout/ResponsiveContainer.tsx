import React from 'react';
import { cn } from '../../lib/utils';

export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  size = 'lg',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-150',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 3,
  className,
  ...props
}) => {
  const colStyles = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6',
  };

  return (
    <div className={cn(colStyles[columns], className)} {...props}>
      {children}
    </div>
  );
};
