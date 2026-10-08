import React from 'react';
import { NavRoute } from '../../types';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';
import { 
  Home, 
  Users, 
  Calendar, 
  ShoppingBag, 
  HelpCircle
} from 'lucide-react';

export interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  onOpenNotifications: () => void;
  onOpenInbox?: () => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  unreadCount?: number;
  unreadMessagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  const { t } = useLanguage();

  const mainNavItems = [
    { id: 'home' as NavRoute, label: t('navHome'), icon: Home },
    { id: 'directory' as NavRoute, label: t('navDirectory'), icon: Users },
    { id: 'events' as NavRoute, label: t('navEvents'), icon: Calendar },
    { id: 'emart' as NavRoute, label: t('navEmart'), icon: ShoppingBag },
    { id: 'ask' as NavRoute, label: t('navAsk'), icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:flex w-full shrink-0 bg-ptic-dark border-b border-white/10 px-4 lg:px-7 text-left select-none overflow-x-auto">
      {/* Primary Navigation Section */}
      <div className="grid w-full grid-cols-5 items-center gap-2 py-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onRouteChange(item.id)}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-sm px-2.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap',
                isActive
                  ? 'bg-ptic-primary text-white shadow-subtle'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon
                size={15}
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-ptic-soft'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

    </aside>
  );
};
