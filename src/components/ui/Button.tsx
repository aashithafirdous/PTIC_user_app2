import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';
  
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 min-h-[32px]',
    md: 'text-sm px-5 py-2 rounded-full gap-2 min-h-[38px]',
    lg: 'text-base px-6 py-2.5 rounded-full gap-2.5 min-h-[44px]',
  };

  const variantStyles = {
    // Primary: #135E69 -> hover: #0e4850, text: #FFFFFF
    primary: 'bg-[#135E69] text-white hover:bg-[#0e4850] shadow-sm hover:shadow active:scale-[0.98]',
    // Secondary: #FFFFFF, border: #135E69/30, text: #135E69, hover: #135E69/10
    secondary: 'bg-white border border-[#135E69]/30 text-[#135E69] dark:bg-[#153451] dark:border-[#18A999]/40 dark:text-[#5ce0d2] hover:bg-[#135E69]/5 dark:hover:bg-[#18A999]/15 shadow-2xs',
    // Ghost: transparent, text: #135E69, hover: soft teal
    ghost: 'bg-transparent text-[#135E69] dark:text-[#5ce0d2] hover:bg-[#135E69]/10 dark:hover:bg-[#18A999]/20',
    // Soft: subtle soft background, text #135E69
    soft: 'bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] hover:bg-[#135E69]/20',
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0 items-center justify-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 items-center justify-center">{rightIcon}</span>}
    </button>
  );
};
