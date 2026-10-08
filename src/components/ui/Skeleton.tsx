import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-[12px]',
    circular: 'rounded-full',
    text: 'rounded-[6px] h-4 w-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-ptic-soft/25 via-ptic-soft/40 to-ptic-soft/25',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-ptic-border rounded-[16px] p-5 shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={44} height={44} />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-1/2 h-4" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton variant="text" className="w-full h-3" />
      <Skeleton variant="text" className="w-4/5 h-3" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton variant="rectangular" className="w-20 h-6" />
        <Skeleton variant="rectangular" className="w-24 h-8" />
      </div>
    </div>
  );
};
