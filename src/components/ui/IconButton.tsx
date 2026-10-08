import React from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary' | 'primary';
  hasBadge?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'ghost',
  hasBadge = false,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-[10px] text-xs',
    md: 'w-10 h-10 rounded-[11px] text-sm',
    lg: 'w-11 h-11 rounded-[12px] text-base',
  };

  const variantStyles = {
    ghost: 'text-ptic-dark hover:bg-ptic-soft/30 hover:text-ptic-primary',
    secondary: 'bg-white border border-ptic-border text-ptic-primary hover:bg-ptic-bg hover:border-ptic-soft shadow-subtle',
    primary: 'bg-ptic-primary text-white hover:bg-ptic-dark',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ptic-secondary',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {hasBadge && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ptic-secondary ring-2 ring-white animate-pulse" />
      )}
    </button>
  );
};
