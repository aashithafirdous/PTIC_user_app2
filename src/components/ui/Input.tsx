import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-ptic-dark/90 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-ptic-secondary pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-white text-ptic-dark placeholder:text-ptic-textMuted/70 border border-ptic-soft/80 rounded-[12px] px-3.5 py-2.5 text-sm transition-all duration-150',
            'focus:outline-none focus:border-ptic-secondary focus:ring-2 focus:ring-ptic-secondary/15',
            'disabled:bg-ptic-bg disabled:text-ptic-textMuted disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-ptic-secondary flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-ptic-textMuted">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search people, products, questions...',
  sizeVariant = 'md',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-2 pl-9 pr-8 text-xs rounded-[10px]',
    md: 'py-2.5 pl-10 pr-9 text-sm rounded-[12px]',
    lg: 'py-3 pl-11 pr-10 text-base rounded-[14px]',
  };

  const iconSizes = {
    sm: 15,
    md: 17,
    lg: 19,
  };

  return (
    <div className={cn('relative w-full flex items-center', className)}>
      <Search
        size={iconSizes[sizeVariant]}
        className="absolute left-3.5 text-ptic-secondary/80 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-white text-ptic-dark placeholder:text-ptic-textMuted/70 border border-ptic-soft/80 shadow-subtle transition-all duration-150',
          'focus:outline-none focus:border-ptic-secondary focus:ring-2 focus:ring-ptic-secondary/20',
          sizeStyles[sizeVariant]
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 p-1 rounded-full text-ptic-secondary hover:text-ptic-dark hover:bg-ptic-soft/30 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
