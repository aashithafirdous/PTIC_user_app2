import React, { useState } from 'react';
import { COMPREHENSIVE_NOTIFICATIONS } from '../data/notificationsData';
import { PTICNotification, NavRoute } from '../types';
import { 
  Bell, 
  MessageSquare, 
  Heart, 
  HelpCircle, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Ticket, 
  Smile, 
  ShoppingBag, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  MapPin, 
  XCircle, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { pushNav } from '../lib/router';
import { useToast } from '../components/ui/Toast';

export interface NotificationsViewProps {
  onNavigate?: (route: NavRoute) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<PTICNotification[]>(COMPREHENSIVE_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'messages' | 'events' | 'network' | 'knowledge'>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All Notifications Marked as Read', undefined, 'info');
  };

  const handleNotificationClick = (item: PTICNotification) => {
    // Mark as read immediately
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    // Route to destination
    if (item.actionUrl) {
      pushNav(item.actionUrl);
      if (onNavigate && item.route) {
        onNavigate(item.route);
      }
    } else if (item.route) {
      if (item.route === 'inbox') pushNav('/inbox');
      else if (item.route === 'events') pushNav(item.targetId ? `/events/${item.targetId}` : '/events');
      else if (item.route === 'emart') pushNav(item.targetId ? `/e-mart/products/${item.targetId}` : '/e-mart');
      else if (item.route === 'ask') pushNav(item.targetId ? `/ask-experts/question/${item.targetId}` : '/ask-experts');
      else if (item.route === 'profile') pushNav('/profile');
      else pushNav(`/${item.route}`);

      if (onNavigate) onNavigate(item.route);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={17} className="text-sky-600 dark:text-sky-400" />;
      case 'product_enquiry':
        return <ShoppingBag size={17} className="text-teal-600 dark:text-teal-400" />;
      case 'registration_closing':
        return <Clock size={17} className="text-rose-600 dark:text-rose-400" />;
      case 'event_pass_ready':
        return <Ticket size={17} className="text-emerald-600 dark:text-emerald-400" />;
      case 'new_event':
      case 'upcoming_conference':
      case 'event_update':
        return <Calendar size={17} className="text-blue-600 dark:text-blue-400" />;
      case 'venue_change':
        return <MapPin size={17} className="text-amber-600 dark:text-amber-400" />;
      case 'cancellation':
        return <XCircle size={17} className="text-slate-600 dark:text-slate-400" />;
      case 'question_answer':
      case 'expert_response':
        return <HelpCircle size={17} className="text-indigo-600 dark:text-indigo-400" />;
      case 'comment_like':
        return <Heart size={17} className="text-rose-500 fill-rose-500/20" />;
      case 'incomplete_profile':
        return <AlertTriangle size={17} className="text-amber-600 dark:text-amber-400" />;
      case 'profile_verification':
        return <ShieldCheck size={17} className="text-emerald-600 dark:text-emerald-400" />;
      case 'profile_completion':
        return <UserCheck size={17} className="text-[#135E69] dark:text-[#5ce0d2]" />;
      case 'connection_request':
        return <UserPlus size={17} className="text-cyan-600 dark:text-cyan-400" />;
      case 'guest_greeting':
        return <Smile size={17} className="text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell size={17} className="text-[#135E69] dark:text-[#5ce0d2]" />;
    }
  };

  // Filter list
  const filtered = notifications.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (filterUnreadOnly && !item.unread) return false;
    return true;
  });

  return (
    <div className="w-full max-w-full px-0 sm:px-1 pt-1 pb-10 text-left">
      {/* Header with Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#294966]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#135E69] text-white shadow-2xs">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
            Real-time updates, event passes, member messages, and council advisory alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-[#B3CFE5] bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] hover:bg-slate-50 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCheck size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
              <span>Mark all as read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filterUnreadOnly
                ? 'bg-[#135E69] text-white shadow-2xs'
                : 'bg-white dark:bg-[#153451] text-slate-700 dark:text-[#B3CFE5] border border-slate-200 dark:border-[#294966] hover:bg-slate-50 dark:hover:bg-[#1A3D63]'
            }`}
          >
            {filterUnreadOnly ? 'Showing Unread' : 'Filter Unread'}
          </button>
        </div>
      </div>

      {/* Filter Tabs by Category */}
      <div className="py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap">
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'messages', label: 'Messages & Enquiries', count: notifications.filter(n => n.category === 'messages').length },
          { id: 'events', label: 'Events & Summits', count: notifications.filter(n => n.category === 'events').length },
          { id: 'network', label: 'Profile & Network', count: notifications.filter(n => n.category === 'network').length },
          { id: 'knowledge', label: 'Expert Answers', count: notifications.filter(n => n.category === 'knowledge').length },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-[#135E69] text-white shadow-2xs'
                : 'bg-white dark:bg-[#153451] text-slate-600 dark:text-[#B3CFE5] border border-slate-200 dark:border-[#294966] hover:bg-slate-50 dark:hover:bg-[#1A3D63]'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#102640] text-slate-500 dark:text-[#B3CFE5]'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification Stream Cards */}
      <div className="space-y-2.5 pt-1">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#153451] rounded-2xl border border-slate-200 dark:border-[#294966] text-slate-400">
            <Bell size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No notifications found</p>
            <p className="text-xs text-slate-500 mt-0.5">All updates have been reviewed.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`group w-full p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 sm:gap-4 ${
                item.unread
                  ? 'bg-white dark:bg-[#153451] border-slate-300 dark:border-[#294966] shadow-xs hover:border-[#135E69]/40 hover:shadow-subtle'
                  : 'bg-white/70 dark:bg-[#153451]/70 border-slate-200/80 dark:border-[#294966]/70 hover:bg-white dark:hover:bg-[#153451] hover:border-slate-300'
              }`}
            >
              {/* Type Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {getNotificationIcon(item.type)}
              </div>

              {/* Text Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs sm:text-sm tracking-tight leading-snug truncate ${
                    item.unread 
                      ? 'font-extrabold text-slate-900 dark:text-[#F6FAFD]' 
                      : 'font-semibold text-slate-700 dark:text-[#F6FAFD]'
                  }`}>
                    {item.title}
                  </h3>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#135E69] shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-[#B3CFE5] mt-1 leading-relaxed">
                  {item.supportingText}
                </p>

                <div className="flex items-center gap-2.5 mt-2 text-[10px] text-slate-400 dark:text-[#B3CFE5]/60 font-medium">
                  {item.author && <span>{item.author}</span>}
                  {item.author && <span>•</span>}
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Action Button on the Right */}
              <div className="shrink-0 flex items-center gap-1.5 self-center">
                {item.actionLabel && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] bg-[#135E69]/10 dark:bg-[#18A999]/20 group-hover:bg-[#135E69] group-hover:text-white transition-all">
                    <span>{item.actionLabel}</span>
                    <ChevronRight size={13} />
                  </span>
                )}
                <div className="sm:hidden text-slate-400 group-hover:text-[#135E69]">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
