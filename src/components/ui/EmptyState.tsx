import React from 'react';
import { Button } from './Button';
import { Inbox, AlertCircle } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[16px] bg-white border border-ptic-border shadow-subtle max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-ptic-soft/30 flex items-center justify-center text-ptic-secondary mb-3.5">
        {icon || <Inbox size={22} />}
      </div>
      <h3 className="text-base font-semibold text-ptic-dark">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-ptic-textMuted mt-1 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected issue occurred while loading this view.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-[16px] bg-white border border-ptic-border shadow-subtle max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3.5">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-base font-semibold text-ptic-dark">
        {title}
      </h3>
      {message && (
        <p className="text-xs text-ptic-textMuted mt-1 max-w-xs leading-relaxed">
          {message}
        </p>
      )}
      {onRetry && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
