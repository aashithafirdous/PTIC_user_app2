import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'soft' | 'outline' | 'solid' | 'secondary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'soft',
  size = 'md',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-[6px] font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-[8px] font-medium tracking-tight',
  };

  const variantStyles = {
    // Soft: #B3CFE5 background with #0A1931 text
    soft: 'bg-ptic-soft/35 text-ptic-dark border border-ptic-soft/60',
    // Outline: subtle light blue border with #1A3D63 text
    outline: 'border border-ptic-soft text-ptic-primary bg-white',
    // Solid: #1A3D63 background with white text
    solid: 'bg-ptic-primary text-white',
    // Secondary: #4A7FA7 with soft white text
    secondary: 'bg-ptic-secondary/15 text-ptic-secondary border border-ptic-secondary/25',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 select-none transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
