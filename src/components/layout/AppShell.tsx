import React, { useState } from 'react';
import { NavRoute, Stakeholder } from '../../types';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ProfileModal } from './ProfileModal';
import { NotificationsModal } from './NotificationsModal';
import { SettingsModal } from './SettingsModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { StakeholderDetailModal } from './StakeholderDetailModal';
import { LoginModal } from '../auth/LoginModal';
import { useApp } from '../../context/AppContext';
import { parseCurrentLocation, pushNav } from '../../lib/router';

export interface AppShellProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  stakeholderProfile?: Stakeholder | null;
  onCloseStakeholderProfile?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onRouteChange,
  stakeholderProfile,
  onCloseStakeholderProfile,
  children,
}) => {
  const {
    isAuthenticated,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K for council global search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync /profile and /settings with URL
  React.useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentLocation();
      setIsProfileOpen(!!parsed.isProfileOpen);
      setIsSettingsOpen(!!parsed.isSettingsOpen);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('ptic-navigate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('ptic-navigate', handleUrlChange);
    };
  }, []);

  const getBaseNavUrl = () => {
    if (currentRoute === 'home') return '/home';
    if (currentRoute === 'directory' || currentRoute === 'people') return '/directory';
    if (currentRoute === 'events') return '/events';
    if (currentRoute === 'emart') return '/e-mart';
    if (currentRoute === 'ask') return '/ask-experts';
    if (currentRoute === 'inbox') return '/inbox';
    if (currentRoute === 'notifications') return '/notifications';
    if (currentRoute === 'profile') return '/profile';
    return `/${currentRoute}`;
  };

  const handleOpenProfile = () => {
    onRouteChange('profile');
    pushNav('/profile');
    setIsProfileOpen(false);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    pushNav(getBaseNavUrl());
  };

  const handleOpenSettings = () => {
    pushNav('/settings');
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    pushNav(getBaseNavUrl());
  };

  return (
    <div className="min-h-screen flex flex-col bg-ptic-bg text-ptic-dark antialiased">
      {/* Top Header */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={onRouteChange}
        onOpenNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
        onOpenSearch={() => setIsSearchOpen(true)}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full py-4 sm:py-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 xl:px-10 overflow-x-clip">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileNav
        currentRoute={currentRoute}
        onRouteChange={onRouteChange}
      />

      {/* Global Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
      />

      {/* Notifications Floating Panel */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={onRouteChange}
        notifications={notifications}
        onNotificationsChange={() => {}}
        onMarkAllRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
        onOpenProfile={handleOpenProfile}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onRouteChange}
      />

      <StakeholderDetailModal
        stakeholder={stakeholderProfile || null}
        onClose={onCloseStakeholderProfile || (() => {})}
      />
    </div>
  );
};
