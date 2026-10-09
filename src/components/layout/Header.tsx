import React, { useState, useRef, useEffect } from 'react';
import { NavRoute } from '../../types';
import { CURRENT_USER, MOCK_EMART_ITEMS, MOCK_EVENTS, MOCK_QUESTIONS, MOCK_STAKEHOLDERS } from '../../data/mockData';
import { 
  Bell, 
  Settings, 
  LogOut, 
  Search,
  Home, 
  Users, 
  Calendar, 
  ShoppingBag, 
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Mail,
  User,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';
import { useLanguage } from '../../lib/LanguageContext';
import { useTheme } from '../../lib/ThemeContext';
import { pushNav } from '../../lib/router';

export interface HeaderProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  onOpenSearch?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onRouteChange,
  onOpenNotifications,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  isAuthenticated = true,
  onOpenLogin,
  unreadNotificationsCount = 3,
}) => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleToggleLang = () => {
    toggleLanguage();
    showToast(
      language === 'EN' ? 'மொழி மாற்றப்பட்டது: தமிழ்' : 'Language switched to English',
      language === 'EN' ? 'இடைமுக லேபிள்கள் தமிழில் புதுப்பிக்கப்பட்டுள்ளன.' : 'Interface labels updated to English.',
      'info'
    );
  };

  const handleQuickThemeToggle = () => {
    toggleTheme();
    const next = resolvedTheme === 'dark' ? 'Light Theme' : 'Dark Theme';
    showToast(`Switched to ${next}`, undefined, 'info');
  };

  const searchResults = searchQuery.trim()
    ? [
        ...MOCK_STAKEHOLDERS.filter((item) =>
          `${item.name} ${item.role} ${item.organization} ${item.location} ${item.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ).map((item) => ({
          id: `stakeholder-${item.id}`,
          title: item.name,
          subtitle: `${item.role} · ${item.organization}`,
          route: 'directory' as NavRoute,
        })),
        ...MOCK_EVENTS.filter((item) =>
          `${item.title} ${item.location} ${item.category} ${item.description}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ).map((item) => ({
          id: `event-${item.id}`,
          title: item.title,
          subtitle: `${item.date} · ${item.location}`,
          route: 'events' as NavRoute,
        })),
        ...MOCK_EMART_ITEMS.filter((item) =>
          `${item.title} ${item.provider} ${item.category} ${item.description}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ).map((item) => ({
          id: `product-${item.id}`,
          title: item.title,
          subtitle: `${item.provider} · ${item.category}`,
          route: 'emart' as NavRoute,
        })),
        ...MOCK_QUESTIONS.filter((item) =>
          `${item.title} ${item.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ).map((item) => ({
          id: `question-${item.id}`,
          title: item.title,
          subtitle: `${item.category} · Expert discussion`,
          route: 'ask' as NavRoute,
        })),
      ].slice(0, 6)
    : [];

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchResults[0]) {
      onRouteChange(searchResults[0].route);
      setSearchQuery('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Primary navigation strictly focused on:
  // Home, People, Events, E-Mart, Ask Experts, Notifications
  const navItems = [
    { id: 'home' as NavRoute, label: 'Home', icon: Home, badge: undefined },
    { id: 'directory' as NavRoute, label: 'People', icon: Users, badge: undefined },
    { id: 'events' as NavRoute, label: 'Events', icon: Calendar, badge: undefined },
    { id: 'emart' as NavRoute, label: 'E-Mart', icon: ShoppingBag, badge: undefined },
    { id: 'ask' as NavRoute, label: 'Ask Experts', icon: HelpCircle, badge: undefined },
    { id: 'notifications' as NavRoute, label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#102640] text-slate-800 dark:text-[#F6FAFD] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] select-none transition-colors">
      <div className="mx-auto flex h-[66px] w-full max-w-full items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Left: Brand Logo & Large Search Box */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onRouteChange('home')}
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer focus:outline-none"
            title="PTIC Platform Home"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#135E69] text-white shadow-sm font-extrabold text-sm sm:text-base tracking-wider font-sans transition-transform group-hover:scale-105 active:scale-95">
              PTIC
            </div>
            <div className="hidden lg:block text-left">
              <span className="font-display text-sm font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight leading-none block">
                PTIC
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#B3CFE5] font-semibold tracking-tight block mt-0.5">
                Poultry Technology Platform
              </span>
            </div>
          </button>

          {/* Large Quick Search Box */}
          <div className="relative flex items-center">
            <div className="relative flex h-11 w-44 sm:w-64 md:w-80 lg:w-96 xl:w-[420px] items-center gap-2.5 rounded-full bg-slate-100/90 dark:bg-[#153451] hover:bg-slate-200/70 dark:hover:bg-[#1A3D63] focus-within:bg-white dark:focus-within:bg-[#153451] focus-within:ring-2 focus-within:ring-[#135E69]/30 border border-slate-200/90 dark:border-[#294966] px-4 text-slate-700 dark:text-[#F6FAFD] transition-all shadow-2xs">
              <Search size={17} className="shrink-0 text-slate-400 dark:text-[#B3CFE5]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search PTIC directory, events, products, discussions..."
                aria-label="Search"
                className="w-full border-0 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-[#F6FAFD] outline-none placeholder:text-slate-400 font-normal"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 top-full z-50 mt-1.5 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-200 dark:border-[#294966] bg-white dark:bg-[#153451] p-1.5 text-left shadow-lg">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      onRouteChange(result.route);
                      setSearchQuery('');
                    }}
                    className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-[#1A3D63] cursor-pointer"
                  >
                    <Search size={13} className="mt-0.5 shrink-0 text-[#135E69] dark:text-[#4A7FA7]" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-900 dark:text-[#F6FAFD]">{result.title}</span>
                      <span className="block truncate text-[10px] text-slate-500 dark:text-[#B3CFE5]">{result.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Primary Navigation & Me Menu */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4 h-full shrink-0">
          
          {/* Desktop Navigation Modules */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 h-full" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id || (item.id === 'directory' && currentRoute === 'people');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onRouteChange(item.id);
                    if (item.id === 'notifications' && onOpenNotifications) {
                      onOpenNotifications();
                    }
                  }}
                  type="button"
                  className={cn(
                    'relative flex h-[66px] flex-col items-center justify-center px-3 lg:px-4 xl:px-5 transition-all group cursor-pointer select-none',
                    isActive
                      ? 'text-[#135E69] dark:text-[#5ce0d2] font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:bg-[#135E69] dark:after:bg-[#5ce0d2]'
                      : 'text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#F6FAFD] hover:bg-slate-50/70 dark:hover:bg-[#1A3D63]/30 font-normal'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.4 : 1.9}
                      className={cn(
                        'transition-colors',
                        isActive ? 'text-[#135E69] dark:text-[#5ce0d2]' : 'text-slate-500 dark:text-[#B3CFE5] group-hover:text-[#135E69]'
                      )}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#135E69] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    'mt-0.5 text-[11px] leading-tight tracking-tight whitespace-nowrap',
                    isActive ? 'font-bold text-[#135E69] dark:text-[#5ce0d2]' : 'font-medium text-slate-600 dark:text-[#B3CFE5] group-hover:text-[#135E69]'
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-[#294966] mx-1 hidden md:block" />

          {/* "ME" Menu with Clean Dropdown */}
          {!isAuthenticated ? (
            <div className="flex items-center h-full px-1">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#135E69] hover:bg-[#0e4850] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="relative h-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className={cn(
                  'flex h-[66px] min-w-[56px] flex-col items-center justify-center px-2.5 text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#F6FAFD] transition-colors cursor-pointer group',
                  isProfileDropdownOpen && 'text-[#135E69] dark:text-[#5ce0d2]'
                )}
                aria-expanded={isProfileDropdownOpen}
                title="Me Account Menu"
              >
                <div className="h-9 w-9 rounded-full bg-[#135E69] text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-200 dark:ring-[#294966] overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  {CURRENT_USER.initials}
                </div>
                <div className="mt-0.5 flex items-center gap-0.5 text-[11px] leading-tight font-medium text-slate-600 dark:text-[#B3CFE5] group-hover:text-[#135E69]">
                  <span>Me</span>
                  <ChevronDown size={11} className={cn('transition-transform', isProfileDropdownOpen && 'rotate-180')} />
                </div>
              </button>

              {/* Clean "Me" Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-68 rounded-2xl bg-white dark:bg-[#153451] border border-slate-200/90 dark:border-[#294966] shadow-xl p-2 z-50 text-left animate-fadeIn">
                  
                  {/* User Badge Info */}
                  <div className="p-2.5 pb-3 border-b border-slate-100 dark:border-[#294966] flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#135E69] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {CURRENT_USER.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] truncate">{CURRENT_USER.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#B3CFE5] truncate">{CURRENT_USER.role}</p>
                      <p className="text-[10px] text-[#135E69] dark:text-[#5ce0d2] font-semibold truncate">{CURRENT_USER.organization}</p>
                    </div>
                  </div>

                  {/* Menu Options: View Profile, Inbox, Preferences, Accounts, Logout */}
                  <div className="py-1.5 space-y-0.5">
                    
                    {/* View Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] hover:bg-slate-50 dark:hover:bg-[#1A3D63] hover:text-[#135E69] dark:hover:text-[#5ce0d2] transition-colors text-left cursor-pointer"
                    >
                      <User size={15} className="text-slate-400 group-hover:text-[#135E69]" />
                      <span>View Profile</span>
                    </button>

                    {/* Inbox */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onRouteChange('inbox');
                        pushNav('/inbox');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] hover:bg-slate-50 dark:hover:bg-[#1A3D63] hover:text-[#135E69] dark:hover:text-[#5ce0d2] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail size={15} className="text-slate-400" />
                        <span>Inbox</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#135E69]/10 text-[#135E69] font-bold">
                        Messages
                      </span>
                    </button>

                    {/* Preferences */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] hover:bg-slate-50 dark:hover:bg-[#1A3D63] hover:text-[#135E69] dark:hover:text-[#5ce0d2] transition-colors text-left cursor-pointer"
                    >
                      <Settings size={15} className="text-slate-400" />
                      <span>Preferences</span>
                    </button>

                    {/* Accounts */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        showToast('PTIC Verified Account', `${CURRENT_USER.name} · Verified Membership Tier`, 'info');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#F6FAFD] hover:bg-slate-50 dark:hover:bg-[#1A3D63] hover:text-[#135E69] dark:hover:text-[#5ce0d2] transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck size={15} className="text-slate-400" />
                      <span>Accounts</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-1.5 border-t border-slate-100 dark:border-[#294966]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                        else showToast('Logged out of PTIC session', undefined, 'info');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Theme Toggle Button */}
          <button
            type="button"
            onClick={handleQuickThemeToggle}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-[#294966] bg-slate-100/70 dark:bg-[#153451] text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#F6FAFD] hover:bg-slate-200/60 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer shrink-0 ml-1"
            title={`Toggle Theme (Current: ${theme})`}
            aria-label="Toggle Theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun size={14} className="text-amber-400" />
            ) : (
              <Moon size={14} className="text-slate-700" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#8f5800] dark:text-[#B3CFE5] bg-[#fbf0da] dark:bg-[#153451] hover:bg-[#fae7c2] dark:hover:bg-[#1A3D63] border border-[#f0c878]/60 dark:border-[#294966] transition-colors cursor-pointer shrink-0"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Languages size={13} className="text-[#8f5800] dark:text-[#4A7FA7]" />
            <span className="text-[11px] font-bold">{language === 'EN' ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
