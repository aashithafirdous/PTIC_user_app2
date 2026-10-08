import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8 text-left', className)}>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ptic-dark">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-ptic-textMuted mt-0.5 sm:mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  viewAllLabel?: string;
  onViewAll?: () => void;
  className?: string;
  count?: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  viewAllLabel = 'View all',
  onViewAll,
  className,
  count,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-3.5 sm:mb-4 text-left', className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-sm sm:text-base font-semibold text-ptic-dark tracking-tight">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-ptic-soft/30 text-ptic-primary">
            {count}
          </span>
        )}
      </div>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-ptic-secondary hover:text-ptic-primary transition-colors group"
        >
          <span>{viewAllLabel}</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
};
