import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statusIndicator?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  statusIndicator,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
    xl: 28,
  };

  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full font-semibold select-none overflow-hidden transition-transform',
        showFallback ? 'bg-ptic-soft text-ptic-dark' : 'bg-ptic-border',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : initials ? (
        <span className="uppercase tracking-wider font-semibold text-ptic-dark">
          {initials.slice(0, 2)}
        </span>
      ) : (
        <User size={iconSizes[size]} className="text-ptic-dark/80" />
      )}

      {statusIndicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            statusIndicator === 'online' && 'bg-emerald-500',
            statusIndicator === 'offline' && 'bg-slate-400',
            statusIndicator === 'busy' && 'bg-amber-500'
          )}
        />
      )}
    </div>
  );
};
