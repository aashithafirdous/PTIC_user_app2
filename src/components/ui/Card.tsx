import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  padding = 'md',
  as: Component = 'div',
  className,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  return (
    <Component
      className={cn(
        'bg-white border border-ptic-border rounded-[16px] shadow-card transition-all duration-200',
        interactive && 'hover:border-ptic-soft hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
