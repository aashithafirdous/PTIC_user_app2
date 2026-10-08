import React from 'react';
import { NavRoute } from '../../types';
import { cn } from '../../lib/utils';
import { Home, Users, Calendar, ShoppingBag, HelpCircle, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface MobileNavProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  const { unreadNotificationsCount } = useApp();

  const items = [
    { id: 'home' as NavRoute, label: 'Home', icon: Home, badge: undefined },
    { id: 'directory' as NavRoute, label: 'People', icon: Users, badge: undefined },
    { id: 'events' as NavRoute, label: 'Events', icon: Calendar, badge: undefined },
    { id: 'emart' as NavRoute, label: 'E-Mart', icon: ShoppingBag, badge: undefined },
    { id: 'ask' as NavRoute, label: 'Experts', icon: HelpCircle, badge: undefined },
    { id: 'notifications' as NavRoute, label: 'Alerts', icon: Bell, badge: unreadNotificationsCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#102640]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#294966] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-1 py-1 flex items-center justify-around safe-bottom select-none">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id || (item.id === 'directory' && currentRoute === 'people');

        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onRouteChange(item.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all min-h-[50px] select-none cursor-pointer relative',
              isActive
                ? 'text-[#135E69] dark:text-[#5ce0d2] font-bold'
                : 'text-slate-500 dark:text-[#B3CFE5] hover:text-slate-800 dark:hover:text-white'
            )}
          >
            <div className="relative flex items-center justify-center">
              <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} className={isActive ? 'text-[#135E69] dark:text-[#5ce0d2]' : 'text-slate-500 dark:text-[#B3CFE5]'} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#135E69] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              'text-[10px] tracking-tight mt-1 leading-none',
              isActive ? 'font-bold text-[#135E69] dark:text-[#5ce0d2]' : 'font-medium text-slate-500 dark:text-[#B3CFE5]'
            )}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-4 h-0.5 bg-[#135E69] dark:bg-[#5ce0d2] rounded-full mt-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
