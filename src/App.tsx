import React, { useState, useEffect, useCallback } from 'react';
import { NavRoute, Stakeholder } from './types';
import { ToastProvider } from './components/ui/Toast';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { HomeView } from './pages/HomeView';
import { DirectoryView } from './pages/DirectoryView';
import { EventsView } from './pages/EventsView';
import { EMartView } from './pages/EMartView';
import { AskExpertView } from './pages/AskExpertView';
import { DesignSystemView } from './pages/DesignSystemView';
import { ProfileView } from './pages/ProfileView';
import { InboxView } from './pages/InboxView';
import { NotificationsView } from './pages/NotificationsView';
import { parseCurrentLocation, pushNav, slugify } from './lib/router';

const AppContent: React.FC = () => {
  const getInitialRoute = (): NavRoute => {
    const parsed = parseCurrentLocation();
    return parsed.route;
  };

  const [currentRoute, setCurrentRoute] = useState<NavRoute>(getInitialRoute);
  const [selectedStakeholderForProfile, setSelectedStakeholderForProfile] = useState<Stakeholder | null>(null);

  const handleRouteChange = useCallback((route: NavRoute) => {
    setCurrentRoute(route);
    let targetUrl = '/home';
    if (route === 'home') targetUrl = '/home';
    else if (route === 'directory' || route === 'people') targetUrl = '/directory';
    else if (route === 'events') targetUrl = '/events';
    else if (route === 'emart') targetUrl = '/e-mart';
    else if (route === 'ask') targetUrl = '/ask-experts';
    else if (route === 'inbox') targetUrl = '/inbox';
    else if (route === 'notifications') targetUrl = '/notifications';
    else if (route === 'design-system') targetUrl = '/design-system';
    else if (route === 'profile') targetUrl = '/profile';

    pushNav(targetUrl);
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentLocation();
      setCurrentRoute(parsed.route);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('ptic-navigate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('ptic-navigate', handleUrlChange);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleRouteChange}
            onSelectStakeholder={(stk) => {
              pushNav(`/directory/people/${slugify(stk.name)}`);
            }}
          />
        );
      case 'directory':
      case 'people':
        return <DirectoryView onNavigate={handleRouteChange} />;
      case 'events':
        return <EventsView />;
      case 'emart':
        return <EMartView />;
      case 'ask':
        return <AskExpertView />;
      case 'inbox':
        return <InboxView onNavigate={handleRouteChange} />;
      case 'notifications':
        return <NotificationsView onNavigate={handleRouteChange} />;
      case 'design-system':
        return <DesignSystemView />;
      case 'profile':
        return <ProfileView onNavigate={handleRouteChange} />;
      default:
        return (
          <HomeView
            onNavigate={handleRouteChange}
            onSelectStakeholder={(stk) => {
              pushNav(`/directory/people/${slugify(stk.name)}`);
            }}
          />
        );
    }
  };

  return (
    <AppShell
      currentRoute={currentRoute}
      onRouteChange={handleRouteChange}
      stakeholderProfile={selectedStakeholderForProfile}
      onCloseStakeholderProfile={() => setSelectedStakeholderForProfile(null)}
    >
      {renderCurrentView()}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
