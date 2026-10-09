import React, { useState, useMemo } from 'react';
import { NavRoute, Stakeholder, PTICEvent, EMartItem, ExpertQuestion } from '../types';
import { SectionHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { SearchInput } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ResponsiveGrid } from '../components/layout/ResponsiveContainer';
import { Footer } from '../components/layout/Footer';
import { useLanguage } from '../lib/LanguageContext';
import { useApp } from '../context/AppContext';
import { calculatePersonalProfileScore, INITIAL_PERSONAL_PROFILE } from '../data/profileData';
import { 
  MOCK_STAKEHOLDERS, 
  MOCK_EVENTS 
} from '../data/mockData';
import { 
  Users, 
  HelpCircle, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  CalendarDays, 
  X, 
  HeartPulse, 
  TrendingUp, 
  ShieldCheck, 
  Megaphone,
  CheckCircle2,
  Bookmark,
  FileText,
  Bell,
  MessageSquare,
  Sparkles,
  Building2,
  Tag
} from 'lucide-react';

export interface HomeViewProps {
  onNavigate: (route: NavRoute) => void;
  onSelectStakeholder?: (stakeholder: Stakeholder) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectStakeholder }) => {
  const { t } = useLanguage();
  const { 
    isAuthenticated, 
    currentUser, 
    setIsLoginModalOpen, 
    products, 
    questions, 
    enquiries, 
    notifications,
    likedQuestionIds,
    unreadNotificationsCount 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Search Results Filtering
  const searchResults = useMemo(() => {
    if (!trimmedQuery) {
      return { stakeholders: [], events: [], products: [] };
    }
    return {
      stakeholders: MOCK_STAKEHOLDERS.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmedQuery) ||
          s.role.toLowerCase().includes(trimmedQuery) ||
          s.organization.toLowerCase().includes(trimmedQuery) ||
          s.location.toLowerCase().includes(trimmedQuery) ||
          s.category.toLowerCase().includes(trimmedQuery)
      ),
      events: MOCK_EVENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(trimmedQuery) ||
          e.location.toLowerCase().includes(trimmedQuery) ||
          e.category.toLowerCase().includes(trimmedQuery) ||
          e.description.toLowerCase().includes(trimmedQuery)
      ),
      products: products.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmedQuery) ||
          p.provider.toLowerCase().includes(trimmedQuery) ||
          p.category.toLowerCase().includes(trimmedQuery) ||
          p.description.toLowerCase().includes(trimmedQuery)
      ),
    };
  }, [trimmedQuery, products]);

  const totalResults =
    searchResults.stakeholders.length +
    searchResults.events.length +
    searchResults.products.length;

  // 1. Explore PTIC Discovery & Shortcut Cards (Consistent across states)
  const exploreCards = [
    {
      id: 'people',
      title: 'People',
      description: 'Discover professionals and companies across the poultry industry.',
      icon: Users,
      route: 'directory' as NavRoute,
      ctaLabel: 'Explore Directory',
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Explore upcoming conferences, workshops and industry opportunities.',
      icon: Calendar,
      route: 'events' as NavRoute,
      ctaLabel: 'View Events',
    },
    {
      id: 'emart',
      title: 'E-Mart',
      description: 'Discover verified products, equipment and farm technology solutions.',
      icon: ShoppingBag,
      route: 'emart' as NavRoute,
      ctaLabel: 'Browse E-Mart',
    },
    {
      id: 'ask',
      title: 'Ask Experts',
      description: 'Find answers, discuss challenges and share poultry knowledge.',
      icon: HelpCircle,
      route: 'ask' as NavRoute,
      ctaLabel: 'Ask Experts',
    },
  ];

  // 2. Upcoming Events: First 3 upcoming events
  const upcomingEvents: PTICEvent[] = useMemo(() => {
    return MOCK_EVENTS.slice(0, 3);
  }, []);

  // 3. Featured Products: First 3 items from products state
  const featuredProducts: EMartItem[] = useMemo(() => {
    const featured = products.filter((p) => p.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : products.slice(0, 3);
  }, [products]);

  // 4. Latest Discussions: First 3 discussions from questions state
  const latestDiscussions: ExpertQuestion[] = useMemo(() => {
    return questions.slice(0, 3);
  }, [questions]);

  // 5. Why PTIC: 4 existing value cards
  const whyPticCards = [
    {
      id: 'health',
      title: 'Better Poultry Health',
      description: 'Veterinary-backed flock health standards and biosecurity protocols.',
      icon: HeartPulse,
    },
    {
      id: 'productivity',
      title: 'Better Productivity',
      description: 'Smart shed automation, feed optimization, and high-yield practices.',
      icon: TrendingUp,
    },
    {
      id: 'guidance',
      title: 'Expert Guidance',
      description: 'Direct consultations with certified avian pathologists and specialists.',
      icon: ShieldCheck,
    },
    {
      id: 'updates',
      title: 'Industry Updates',
      description: 'Timely market intelligence, disease alerts, and council initiatives.',
      icon: Megaphone,
    },
  ];

  // User-Specific Activity Data (Only real data from state)
  const userRegisteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((e) => e.isAttending || e.isInterested);
  }, []);

  const savedDiscussionsCount = likedQuestionIds.length;
  const userEnquiriesCount = enquiries.length;
  const userEventsCount = userRegisteredEvents.length;

  // Profile completion score
  const profileScoreResult = useMemo(() => {
    return calculatePersonalProfileScore(INITIAL_PERSONAL_PROFILE);
  }, []);

  return (
    <div className="w-full max-w-full px-0 sm:px-1 space-y-8 sm:space-y-10 lg:space-y-12 text-left">
      {/* Search Input Bar */}
      {trimmedQuery && (
        <div className="max-w-2xl space-y-2 text-left">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('searchPlaceholder', 'Search stakeholders, technical events, innovations...')}
            sizeVariant="lg"
          />
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-[#B3CFE5]">
            <span>
              {t('search', 'Search')} <strong className="text-slate-900 dark:text-[#F6FAFD]">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &ldquo;<span className="text-[#135E69] dark:text-[#5ce0d2] font-medium">{searchQuery}</span>&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-[#F6FAFD] font-medium cursor-pointer"
            >
              <X size={12} /> {t('clearSearch', 'Clear search')}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEARCH ACTIVE VIEW                                                        */}
      {/* ========================================================================= */}
      {trimmedQuery ? (
        <div className="space-y-6">
          {totalResults === 0 ? (
            <EmptyState
              title={t('noResultsFound', 'No results found')}
              description={`We couldn't find any stakeholders, events, or products matching "${searchQuery}". Try a different keyword.`}
              actionLabel={t('clearSearch', 'Clear search')}
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <div className="space-y-6 text-left">
              {/* Stakeholders results */}
              {searchResults.stakeholders.length > 0 && (
                <div className="space-y-3">
                  <SectionHeader
                    title={t('matchingStakeholders', 'Matching Stakeholders')}
                    count={searchResults.stakeholders.length}
                    viewAllLabel="Open People"
                    onViewAll={() => onNavigate('directory')}
                  />
                  <ResponsiveGrid columns={3}>
                    {searchResults.stakeholders.map((stk) => (
                      <Card key={stk.id} interactive className="flex flex-col text-left justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <Avatar initials={stk.initials} size="md" />
                            <Badge variant="soft" size="sm">
                              {stk.category}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">{stk.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-[#B3CFE5] font-medium">{stk.role}</p>
                          <p className="text-xs text-slate-500 dark:text-[#B3CFE5]/80 mt-0.5">{stk.organization}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#B3CFE5]/80 mt-2.5">
                            <MapPin size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
                            <span>{stk.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#294966] flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-[#B3CFE5]">
                            {stk.connectionsCount} {t('dirConnections', 'links')}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (onSelectStakeholder) onSelectStakeholder(stk);
                              else onNavigate('directory');
                            }}
                          >
                            {t('viewProfile', 'View Profile')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </ResponsiveGrid>
                </div>
              )}

              {/* Events results */}
              {searchResults.events.length > 0 && (
                <div className="space-y-3">
                  <SectionHeader
                    title={t('matchingEvents', 'Matching Events')}
                    count={searchResults.events.length}
                    viewAllLabel="Open Events"
                    onViewAll={() => onNavigate('events')}
                  />
                  <ResponsiveGrid columns={2}>
                    {searchResults.events.map((ev) => (
                      <Card key={ev.id} interactive padding="none" className="flex flex-col justify-between text-left overflow-hidden">
                        <div>
                          {ev.flyerUrl && (
                            <div className="relative w-full h-36 bg-slate-100 dark:bg-[#102640] overflow-hidden border-b border-slate-200 dark:border-[#294966]">
                              <img
                                src={ev.flyerUrl}
                                alt={ev.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2.5 right-2.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
                                  {ev.mode}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="soft" size="sm">{ev.category}</Badge>
                              <span className="text-xs text-slate-500 dark:text-[#B3CFE5] flex items-center gap-1">
                                <CalendarDays size={13} className="text-[#135E69] dark:text-[#5ce0d2]" />
                                {ev.date}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] mt-1">{ev.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2">{ev.description}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-[#B3CFE5] font-medium mt-2.5">
                              <MapPin size={13} />
                              <span>{ev.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 pt-3 border-t border-slate-200 dark:border-[#294966] flex items-center justify-between bg-white dark:bg-[#153451]">
                          <span className="text-xs text-slate-500 dark:text-[#B3CFE5]">{ev.attendeesCount} {t('eventsAttending', 'attending')}</span>
                          <Button variant="primary" size="sm" onClick={() => onNavigate('events')}>
                            {t('viewEvent', 'View Event')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </ResponsiveGrid>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* USER-STATE SPECIFIC TOP SECTIONS                                          */}
          {/* ========================================================================= */}

          {!isAuthenticated ? (
            /* ----------------------------------------------------------------------- */
            /* 2. FIRST-TIME USER HOME PAGE — DISCOVER PTIC                             */
            /* ----------------------------------------------------------------------- */
            <>
              {/* Hero Section: Discover PTIC */}
              <section
                aria-label="PTIC Welcome Hero"
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F0F7F9] dark:bg-[#102640] border border-[#D5E7EB] dark:border-[#294966] p-6 sm:p-8 lg:p-9 shadow-xs transition-colors"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
                  {/* Left Side: Headline & Single Primary CTA */}
                  <div className="flex-1 text-left space-y-3 sm:space-y-4 z-10 w-full">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#135E69]/10 text-[#135E69] dark:bg-[#135E69]/30 dark:text-[#5ce0d2]">
                      Poultry Technology & Innovation Council
                    </span>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight leading-tight">
                      Welcome to PTIC
                    </h1>

                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-[#B3CFE5] max-w-xl leading-relaxed">
                      Your gateway to poultry industry connections, technology and opportunities.
                    </p>

                    <div className="pt-1 sm:pt-2">
                      <button
                        type="button"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#135E69] hover:bg-[#0e4850] dark:bg-[#135E69] dark:hover:bg-[#18A999] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer group active:scale-95"
                      >
                        <span>Get Started with PTIC</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Balanced Poultry Imagery */}
                  <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-end z-10">
                    <div className="relative overflow-hidden rounded-2xl shadow-sm border border-white/80 dark:border-[#294966]">
                      <img
                        src="/ptic_hero_farmer.jpg"
                        alt="Poultry Industry Professional"
                        className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[360px] lg:max-w-[420px] h-48 sm:h-56 md:h-60 object-cover object-center transition-transform duration-300 hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Explore PTIC: 4 Compact Discovery Cards */}
              <section aria-labelledby="explore-ptic-heading" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 id="explore-ptic-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                    Explore PTIC
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {exploreCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => onNavigate(card.route)}
                        className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 flex flex-col justify-between text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group h-full select-none"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105">
                            <Icon size={20} strokeWidth={2} />
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors">
                            {card.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1.5 leading-relaxed line-clamp-2">
                            {card.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] group-hover:translate-x-1 transition-transform">
                          <span>{card.ctaLabel}</span>
                          <ArrowRight size={14} className="ml-1 shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            /* ----------------------------------------------------------------------- */
            /* 3. RETURNING USER HOME PAGE — PERSONALIZED PTIC                          */
            /* ----------------------------------------------------------------------- */
            <>
              {/* Personalized Welcome Banner */}
              <section
                aria-label="PTIC Personalized Welcome"
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#102640] via-[#153451] to-[#135E69] text-white p-6 sm:p-8 shadow-sm transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 z-10 relative">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white backdrop-blur-xs border border-white/15">
                      <Sparkles size={12} className="text-[#5ce0d2]" />
                      <span>PTIC Member Portal · {currentUser.organization}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Welcome back{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                      Pick up where you left off and discover what's new in your PTIC network.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-[#5ce0d2]" />
                        {currentUser.location}
                      </span>
                      <span>•</span>
                      <span>{currentUser.role}</span>
                      <span>•</span>
                      <span className="text-[#5ce0d2] font-semibold">Verified Member</span>
                    </div>
                  </div>

                  {/* Profile Quick Action */}
                  <div className="shrink-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-sm font-bold text-white shadow-xs">
                      {currentUser.initials}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('profile')}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer active:scale-95"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </section>

              {/* Profile Completion Prompt (Only shown when profile has remaining recommendations) */}
              {profileScoreResult.totalScore < 100 && (
                <section
                  aria-label="Profile Completion"
                  className="rounded-2xl bg-white dark:bg-[#153451] border border-slate-200/90 dark:border-[#294966] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                        Profile Strength: {profileScoreResult.totalScore}%
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#135E69]/10 text-[#135E69] dark:bg-[#135E69]/30 dark:text-[#5ce0d2]">
                        {profileScoreResult.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md h-2 rounded-full bg-slate-100 dark:bg-[#102640] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#135E69] dark:bg-[#5ce0d2] transition-all duration-500"
                        style={{ width: `${profileScoreResult.totalScore}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-[#B3CFE5]">
                      Complete your farm details, equipment and credentials to reach 100% and earn council leader verification.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('profile')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#135E69] hover:bg-[#0e4850] dark:bg-[#135E69] dark:hover:bg-[#18A999] transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>Complete Profile</span>
                    <ArrowRight size={13} />
                  </button>
                </section>
              )}

              {/* Existing Activity & Shortcuts (Only Real Data from State) */}
              <section aria-labelledby="activity-shortcuts-heading" className="space-y-3">
                <h2 id="activity-shortcuts-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#B3CFE5]">
                  Your Activity & Shortcuts
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  {/* 1. My Events */}
                  <div
                    onClick={() => onNavigate('events')}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 flex flex-col justify-between hover:shadow-md hover:border-[#135E69]/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center">
                          <Calendar size={16} />
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD]">
                          {userEventsCount}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">My Events</h3>
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2">
                        {userEventsCount > 0
                          ? `Registered for ${userRegisteredEvents[0]?.title || 'upcoming summit'}.`
                          : 'Explore and register for upcoming poultry conferences.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2]">
                      <span>View Registrations</span>
                      <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>

                  {/* 2. My Enquiries */}
                  <div
                    onClick={() => onNavigate('emart')}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 flex flex-col justify-between hover:shadow-md hover:border-[#135E69]/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD]">
                          {userEnquiriesCount}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">My Enquiries</h3>
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2">
                        {userEnquiriesCount > 0
                          ? `Recent enquiry sent for "${enquiries[0]?.productTitle}".`
                          : 'Direct equipment inquiries sent to council suppliers.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2]">
                      <span>{userEnquiriesCount > 0 ? 'Review Enquiries' : 'Browse E-Mart'}</span>
                      <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>

                  {/* 3. Saved Items (Bookmarked / Liked Discussions) */}
                  <div
                    onClick={() => onNavigate('ask')}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 flex flex-col justify-between hover:shadow-md hover:border-[#135E69]/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center">
                          <Bookmark size={16} />
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD]">
                          {savedDiscussionsCount}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">Saved Discussions</h3>
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2">
                        {savedDiscussionsCount > 0
                          ? `${savedDiscussionsCount} bookmarked technical QA threads.`
                          : 'Save expert answers and veterinary advice.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2]">
                      <span>Browse Saved</span>
                      <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>

                  {/* 4. Recent Updates / Notifications */}
                  <div
                    onClick={() => onNavigate('notifications')}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 flex flex-col justify-between hover:shadow-md hover:border-[#135E69]/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center">
                          <Bell size={16} />
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#135E69]/30 dark:text-[#5ce0d2]">
                          {unreadNotificationsCount} Unread
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">Recent Updates</h3>
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2">
                        {notifications[0]?.title || 'Direct updates from PTIC advisory secretariat.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2]">
                      <span>Open Notifications</span>
                      <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Access Shortcut Cards */}
              <section aria-labelledby="quick-access-heading" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 id="quick-access-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                    Quick Access
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {exploreCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => onNavigate(card.route)}
                        className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 flex flex-col justify-between text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group h-full select-none"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105">
                            <Icon size={20} strokeWidth={2} />
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors">
                            {card.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1.5 leading-relaxed line-clamp-2">
                            {card.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 flex items-center text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] group-hover:translate-x-1 transition-transform">
                          <span>Open</span>
                          <ArrowRight size={14} className="ml-1 shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ========================================================================= */}
          {/* SHARED CONTENT SECTIONS (Consistent, cleanly ordered)                     */}
          {/* ========================================================================= */}

          {/* 1. Upcoming Events Section */}
          <section aria-labelledby="upcoming-events-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="upcoming-events-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                  Upcoming Events
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                  Conferences, technical workshops, and trade expos
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('events')}
                className="text-xs sm:text-sm font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline inline-flex items-center gap-1 cursor-pointer group"
              >
                <span>View All Events</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group h-full"
                >
                  {/* Event Flyer with Fixed Uniform Aspect Ratio */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-[#102640] shrink-0 border-b border-slate-100 dark:border-[#294966]">
                    <img
                      src={ev.flyerUrl || '/poultrytech-summit-2026-flyer.png'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {ev.isAttending && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#135E69] text-white shadow-xs">
                          Attending
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-[#F6FAFD] backdrop-blur-xs shadow-xs">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] mb-1.5">
                        <Calendar size={13} className="shrink-0" />
                        <span>{ev.date}</span>
                      </div>

                      {/* Event Title - Uniform height */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors">
                        {ev.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#B3CFE5] mt-2">
                        <MapPin size={13} className="shrink-0 text-slate-400 dark:text-[#728ca3]" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>

                    {/* Bottom Action Row with Pill Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#294966] flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-[#B3CFE5]">
                        {ev.attendeesCount} attending
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('events')}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#135E69] dark:text-white bg-[#135E69]/10 hover:bg-[#135E69] hover:text-white dark:bg-[#135E69] dark:hover:bg-[#18A999] transition-all cursor-pointer active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Featured Products Section (From E-Mart) */}
          <section aria-labelledby="featured-products-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="featured-products-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                  Featured Products
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                  Verified equipment, nutrients, and technologies from council suppliers
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('emart')}
                className="text-xs sm:text-sm font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline inline-flex items-center gap-1 cursor-pointer group"
              >
                <span>Browse E-Mart Catalog</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group h-full"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-[#102640] shrink-0 border-b border-slate-100 dark:border-[#294966]">
                    <img
                      src={prod.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#135E69] text-white shadow-xs">
                        {prod.category}
                      </span>
                    </div>
                    {prod.tag && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-[#F6FAFD] backdrop-blur-xs">
                          {prod.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Provider */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#B3CFE5] mb-1">
                        <Building2 size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
                        <span className="truncate">{prod.provider}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-1 leading-snug group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors">
                        {prod.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Price */}
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-[#135E69] dark:text-[#5ce0d2]">
                          {prod.price || 'Council Pricing'}
                        </span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#294966] flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {prod.inStock !== false ? 'In Stock' : 'On Request'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('emart')}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#135E69] dark:text-white bg-[#135E69]/10 hover:bg-[#135E69] hover:text-white dark:bg-[#135E69] dark:hover:bg-[#18A999] transition-all cursor-pointer active:scale-95"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Latest Discussions Section (From Ask Experts) */}
          <section aria-labelledby="latest-discussions-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="latest-discussions-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                  Latest Discussions
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                  Recent questions, farm management inquiries, and expert guidance
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('ask')}
                className="text-xs sm:text-sm font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline inline-flex items-center gap-1 cursor-pointer group"
              >
                <span>Join Community QA</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {latestDiscussions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('ask')}
                  className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#135E69]/50 transition-all cursor-pointer group h-full text-left"
                >
                  <div>
                    {/* Category & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] truncate">
                        {q.category}
                      </span>
                      {q.isResolved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Resolved
                        </span>
                      )}
                    </div>

                    {/* Question Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-2 leading-snug group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors">
                      {q.title}
                    </h3>

                    {/* Author & Location */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#294966] text-[10px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                        {q.author?.substring(0, 2).toUpperCase() || 'PT'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#B3CFE5] truncate">
                        <span className="font-semibold text-slate-700 dark:text-[#F6FAFD]">{q.author}</span>
                        {q.location && <span> · {q.location}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#294966] flex items-center justify-between text-xs text-slate-500 dark:text-[#B3CFE5]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare size={13} className="text-[#135E69] dark:text-[#5ce0d2]" />
                        {q.answersCount || (q.answers ? q.answers.length : 0)} answers
                      </span>
                      <span className="text-[11px]">
                        {q.timeAgo || 'Recent'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Why PTIC? (Council Pillars) */}
          <section aria-labelledby="why-ptic-heading" className="space-y-4">
            <h2 id="why-ptic-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              Why PTIC?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
              {whyPticCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 sm:p-5 flex flex-col items-start text-left shadow-2xs hover:border-[#135E69]/40 dark:hover:border-[#4A7FA7]/60 transition-all h-full"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#5ce0d2] flex items-center justify-center mb-3 shrink-0">
                      <Icon size={18} strokeWidth={2} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">
                      {card.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1 leading-snug">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Clean Footer */}
          <Footer onNavigate={onNavigate} />
        </>
      )}
    </div>
  );
};
