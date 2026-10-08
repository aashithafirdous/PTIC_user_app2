import React, { useState } from 'react';
import { NavRoute, Stakeholder } from '../types';
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
import { 
  MOCK_STAKEHOLDERS, 
  MOCK_EVENTS, 
  MOCK_EMART_ITEMS 
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
  Megaphone 
} from 'lucide-react';

export interface HomeViewProps {
  onNavigate: (route: NavRoute) => void;
  onSelectStakeholder?: (stakeholder: Stakeholder) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectStakeholder }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const searchResults = {
    stakeholders: trimmedQuery
      ? MOCK_STAKEHOLDERS.filter(
          (s) =>
            s.name.toLowerCase().includes(trimmedQuery) ||
            s.role.toLowerCase().includes(trimmedQuery) ||
            s.organization.toLowerCase().includes(trimmedQuery) ||
            s.location.toLowerCase().includes(trimmedQuery) ||
            s.category.toLowerCase().includes(trimmedQuery)
        )
      : [],
    events: trimmedQuery
      ? MOCK_EVENTS.filter(
          (e) =>
            e.title.toLowerCase().includes(trimmedQuery) ||
            e.location.toLowerCase().includes(trimmedQuery) ||
            e.category.toLowerCase().includes(trimmedQuery) ||
            e.description.toLowerCase().includes(trimmedQuery)
        )
      : [],
    products: trimmedQuery
      ? MOCK_EMART_ITEMS.filter(
          (p) =>
            p.title.toLowerCase().includes(trimmedQuery) ||
            p.provider.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery) ||
            p.description.toLowerCase().includes(trimmedQuery)
        )
      : [],
  };

  const totalResults =
    searchResults.stakeholders.length +
    searchResults.events.length +
    searchResults.products.length;

  // 1. Quick Access cards: exactly 4 cards, equal height & width
  const quickAccessCards = [
    {
      id: 'people',
      title: 'People',
      description: 'Connect with farmers, professionals and industry stakeholders.',
      icon: Users,
      route: 'directory' as NavRoute,
    },
    {
      id: 'ask',
      title: 'Ask Experts',
      description: 'Get guidance from poultry industry experts.',
      icon: HelpCircle,
      route: 'ask' as NavRoute,
    },
    {
      id: 'emart',
      title: 'E-Mart',
      description: 'Discover trusted poultry products and solutions.',
      icon: ShoppingBag,
      route: 'emart' as NavRoute,
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Explore upcoming conferences, workshops and industry events.',
      icon: Calendar,
      route: 'events' as NavRoute,
    },
  ];

  // 2. Upcoming events: exactly 3 cards for desktop 1-row layout
  const upcomingEvents = MOCK_EVENTS.slice(0, 3);

  // 3. Why PTIC: exactly 4 compact value cards
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

  return (
    <div className="w-full max-w-full px-0 sm:px-1 space-y-8 sm:space-y-10 lg:space-y-12 text-left">
      {/* Search Query Filter State */}
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
              {t('search', 'Search')} <strong className="text-slate-900 dark:text-[#F6FAFD]">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &ldquo;<span className="text-[#135E69] dark:text-[#4A7FA7] font-medium">{searchQuery}</span>&rdquo;
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

      {/* When Search Query is active */}
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
                            <MapPin size={12} className="text-[#135E69] dark:text-[#4A7FA7]" />
                            <span>{stk.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#294966] flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-[#B3CFE5]">{stk.connectionsCount} {t('dirConnections', 'links')}</span>
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
                                <CalendarDays size={13} className="text-[#135E69] dark:text-[#4A7FA7]" />
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
          {/* 1. HERO SECTION                                                           */}
          {/* Compact, controlled, balanced left/right composition, rounded corners      */}
          {/* ========================================================================= */}
          <section
            aria-label="PTIC Hero Section"
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F0F7F9] dark:bg-[#102640] border border-[#D5E7EB] dark:border-[#294966] p-6 sm:p-8 lg:p-9 shadow-xs transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
              {/* Left Side: PTIC Headline, Supporting Sentence & Primary Pill CTA */}
              <div className="flex-1 text-left space-y-3 sm:space-y-4 z-10 w-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#B3CFE5]">
                  Poultry Technology & Innovation Council
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight leading-tight">
                  Building a Stronger Poultry Industry
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-[#B3CFE5] max-w-xl leading-relaxed">
                  Connect with people, discover solutions, learn from experts and stay updated.
                </p>

                <div className="pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('directory')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#135E69] hover:bg-[#0e4850] dark:bg-[#135E69] dark:hover:bg-[#18A999] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer group active:scale-95"
                  >
                    <span>Explore PTIC</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>

              {/* Right Side: Poultry Industry Visual */}
              <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-end z-10">
                <div className="relative overflow-hidden rounded-2xl shadow-sm border border-white/80 dark:border-[#294966]">
                  <img
                    src="/ptic_hero_farmer.jpg"
                    alt="Poultry Industry Professional"
                    className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[360px] lg:max-w-[440px] h-48 sm:h-56 md:h-64 object-cover object-center transition-transform duration-300 hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 2. QUICK ACCESS SECTION ("Explore PTIC")                                  */}
          {/* Exactly 4 clean cards, equal height & width, 4 in 1 row on desktop         */}
          {/* ========================================================================= */}
          <section aria-labelledby="quick-access-heading" className="space-y-4">
            <h2 id="quick-access-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              Explore PTIC
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
              {quickAccessCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => onNavigate(card.route)}
                    className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 flex flex-col justify-between text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group h-full select-none"
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#B3CFE5] flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105">
                        <Icon size={20} strokeWidth={2} />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight group-hover:text-[#135E69] dark:group-hover:text-[#4A7FA7] transition-colors">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-1.5 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>

                    {/* Small Action Indicator */}
                    <div className="mt-4 pt-2 flex items-center text-xs font-semibold text-[#135E69] dark:text-[#4A7FA7] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight size={14} className="ml-1 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 3. UPCOMING EVENTS SECTION                                                */}
          {/* 3 cards in 1 row on desktop, identical dimensions & aspect ratio          */}
          {/* ========================================================================= */}
          <section aria-labelledby="upcoming-events-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="upcoming-events-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                Upcoming Events
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('events')}
                className="text-xs sm:text-sm font-semibold text-[#135E69] dark:text-[#4A7FA7] hover:underline inline-flex items-center gap-1 cursor-pointer group"
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
                  {/* Event Image with Fixed Uniform Aspect Ratio */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-[#102640] shrink-0 border-b border-slate-100 dark:border-[#294966]">
                    <img
                      src={ev.flyerUrl || '/poultrytech-summit-2026-flyer.png'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-[#F6FAFD] backdrop-blur-xs shadow-xs">
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#135E69] dark:text-[#4A7FA7] mb-1.5">
                        <Calendar size={13} className="shrink-0" />
                        <span>{ev.date}</span>
                      </div>

                      {/* Event Name - Clamped to 2 lines for uniform height */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-[#135E69] dark:group-hover:text-[#4A7FA7] transition-colors">
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

          {/* ========================================================================= */}
          {/* 4. WHY PTIC SECTION                                                       */}
          {/* 4 compact cards: icon, short title, one-line explanation                  */}
          {/* ========================================================================= */}
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
                    <div className="w-9 h-9 rounded-xl bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#B3CFE5] flex items-center justify-center mb-3 shrink-0">
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

          {/* ========================================================================= */}
          {/* 5. FOOTER SECTION                                                         */}
          {/* Clean minimal footer with logo, Quick Links, Support, and Social icons     */}
          {/* ========================================================================= */}
          <Footer onNavigate={onNavigate} />
        </>
      )}
    </div>
  );
};
