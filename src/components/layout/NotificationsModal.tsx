import React, { useState, useEffect, useRef } from 'react';
import { NavRoute, PTICNotification } from '../../types';
import { 
  Calendar, 
  Check, 
  X, 
  HelpCircle, 
  ShoppingBag, 
  UserCheck, 
  ShieldCheck, 
  CheckCheck
} from 'lucide-react';
import { pushNav } from '../../lib/router';

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: NavRoute) => void;
  notifications: PTICNotification[];
  onNotificationsChange?: (notifications: PTICNotification[]) => void;
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  onOpenProfile?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigate,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onOpenProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (item: PTICNotification) => {
    // Mark as read immediately
    if (onMarkRead) {
      onMarkRead(item.id);
    }

    // Close panel
    onClose();

    // Special link action: profile
    if (item.linkAction === 'profile' && onOpenProfile) {
      onOpenProfile();
      return;
    }

    // Direct routing
    if (item.route === 'ask') {
      if (item.targetId) {
        pushNav(`/ask-experts/question/${item.targetId}`);
      } else {
        pushNav('/ask-experts');
      }
      if (onNavigate) onNavigate('ask');
    } else if (item.route === 'emart') {
      if (item.targetId) {
        pushNav(`/e-mart/products/${item.targetId}`);
      } else {
        pushNav('/e-mart');
      }
      if (onNavigate) onNavigate('emart');
    } else if (item.route === 'events') {
      if (item.targetId) {
        pushNav(`/events/${item.targetId}`);
      } else {
        pushNav('/events');
      }
      if (onNavigate) onNavigate('events');
    } else if (onNavigate && item.route) {
      onNavigate(item.route);
    }
  };

  const displayedNotifications = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return (
          <div className="w-8 h-8 rounded-full bg-[#135E69]/15 text-[#135E69] dark:text-[#5ce0d2] flex items-center justify-center shrink-0 shadow-2xs">
            <UserCheck size={16} />
          </div>
        );
      case 'ask':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
            <HelpCircle size={16} />
          </div>
        );
      case 'event':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar size={16} />
          </div>
        );
      case 'emart':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
            <ShoppingBag size={16} />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck size={16} />
          </div>
        );
    }
  };

  return (
    <>
      {/* Subtle Background Dimming Overlay */}
      <div 
        className="fixed inset-0 bg-black/15 dark:bg-black/40 backdrop-blur-[1px] z-40 transition-opacity animate-in fade-in-0 duration-150"
        aria-hidden="true"
      />

      {/* Floating Top-Right Notification Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
        className="fixed top-[64px] right-2 sm:right-6 md:right-10 lg:right-20 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-16px)] h-[560px] max-h-[calc(100vh-80px)] rounded-2xl bg-white dark:bg-[#153451] border border-slate-200/90 dark:border-[#294966] shadow-2xl flex flex-col overflow-hidden text-left animate-in fade-in-0 slide-in-from-top-2 duration-150 select-none"
      >
        {/* Sticky Header: "Notifications" + [ All ] [ Unread ] Pills */}
        <div className="shrink-0 p-4 border-b border-slate-100 dark:border-[#294966] bg-white/95 dark:bg-[#153451]/95 backdrop-blur-sm flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#0B263D] dark:text-[#F6FAFD]">
              Notifications
            </h3>
            {notifications.filter((n) => n.unread).length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#135E69]/15 text-[#135E69] dark:bg-[#18A999]/25 dark:text-[#5ce0d2]">
                {notifications.filter((n) => n.unread).length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* All / Unread Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#102640] p-0.5 rounded-full text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#135E69] text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-[#135E69] text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69]'
                }`}
              >
                Unread
              </button>
            </div>

            {/* Mark All Read button */}
            {onMarkAllRead && notifications.some((n) => n.unread) && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="p-1.5 rounded-full text-slate-500 hover:text-[#135E69] hover:bg-slate-100 dark:hover:bg-[#102640] transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#102640] transition-colors cursor-pointer"
              title="Close notifications"
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/90 dark:divide-[#294966] overscroll-contain">
          {displayedNotifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-500 dark:text-[#B3CFE5]">
              <div className="w-12 h-12 rounded-full bg-[#135E69]/10 text-[#135E69] dark:text-[#5ce0d2] flex items-center justify-center mb-3">
                <Check size={22} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-[#0B263D] dark:text-[#F6FAFD]">
                You're all caught up!
              </p>
              <p className="text-xs text-slate-400 dark:text-[#88B0D3] mt-1">
                No notifications to display.
              </p>
            </div>
          ) : (
            displayedNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 sm:p-4 cursor-pointer transition-colors flex items-start gap-3 relative group ${
                  item.unread
                    ? 'bg-[#135E69]/[0.05] dark:bg-[#18A999]/[0.10] hover:bg-[#135E69]/[0.10] dark:hover:bg-[#18A999]/[0.15]'
                    : 'bg-white dark:bg-[#153451] hover:bg-slate-50/80 dark:hover:bg-[#1A3D63]/50'
                }`}
              >
                {/* Left: PTIC-themed Icon */}
                <div className="mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                {/* Center: Content & Supporting Text */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs leading-snug line-clamp-1 ${item.unread ? 'font-bold text-[#0B263D] dark:text-[#F6FAFD]' : 'font-medium text-slate-800 dark:text-[#F6FAFD]'}`}>
                      {item.title}
                    </p>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#135E69] dark:bg-[#18A999] shrink-0" />
                    )}
                  </div>

                  {item.supportingText && (
                    <p className="text-[11px] text-slate-600 dark:text-[#B3CFE5] line-clamp-2 mt-0.5 leading-relaxed">
                      {item.supportingText}
                    </p>
                  )}

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-[#88B0D3]">
                    <span>{item.timestamp}</span>
                    <span className="font-semibold text-[#135E69] dark:text-[#5ce0d2] group-hover:underline">
                      View details →
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-[#294966] bg-slate-50/80 dark:bg-[#102640]/80 text-center">
          <p className="text-[10px] text-slate-400 dark:text-[#B3CFE5]">
            PTIC Stakeholder Notifications & Advisories
          </p>
        </div>
      </div>
    </>
  );
};
