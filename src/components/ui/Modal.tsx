import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'wide' | 'product';
  className?: string;
  bodyClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  headerActions,
  maxWidth = 'md',
  className,
  bodyClassName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-5xl',
    full: 'max-w-6xl',
    wide: 'w-[94vw] sm:w-[86vw] lg:w-[80vw] max-w-[1200px]',
    product: 'w-[94vw] sm:w-[84vw] lg:w-[78vw] xl:w-[75vw] max-w-[1220px]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ptic-dark/35 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-[#153451] rounded-[16px] border border-ptic-border dark:border-[#294966] shadow-modal z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]',
          maxWidthStyles[maxWidth] || maxWidthStyles.md,
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-5 sm:px-6 pt-5 pb-3.5 border-b border-ptic-border dark:border-[#294966] flex items-start justify-between gap-3 shrink-0">
            <div className="flex-1 pr-2 text-left">
              {title && (
                <h3 className="text-lg font-semibold text-ptic-dark dark:text-[#F6FAFD] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-ptic-textMuted dark:text-[#B3CFE5] mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {headerActions}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-full text-ptic-textMuted hover:text-ptic-dark dark:text-[#B3CFE5] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className={cn("p-5 sm:p-6 text-left overflow-y-auto flex-1 overscroll-contain", bodyClassName)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 bg-ptic-bg/50 dark:bg-[#102640]/60 border-t border-ptic-border dark:border-[#294966] flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
