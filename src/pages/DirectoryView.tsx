import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SearchInput } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_STAKEHOLDERS } from '../data/mockData';
import { NavRoute, Stakeholder } from '../types';
import {
  Building,
  Check,
  ChevronRight,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { slugify, resolveStakeholderBySlugOrId, pushNav } from '../lib/router';
import { MemberDetailView } from '../components/directory/MemberDetailView';

export interface DirectoryViewProps {
  onNavigate: (route: NavRoute) => void;
  onOpenMessage?: (stakeholder: Stakeholder) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ onNavigate, onOpenMessage }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMemberType, setSelectedMemberType] = useState<'All Members' | 'Company'>('All Members');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Selected stakeholder for member profile view within existing layout
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  // Synchronize selected stakeholder with URL (/directory/people/:slug or /directory/:slug)
  useEffect(() => {
    const syncFromUrl = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const segments = pathname.split('/').filter(Boolean);
      let slug: string | undefined;

      if (segments[0] === 'directory') {
        if (segments[1] === 'people' && segments[2]) {
          slug = segments[2];
        } else if (segments[1] && segments[1] !== 'people') {
          slug = segments[1];
        }
      } else if (segments[0] === 'people' && segments[1]) {
        slug = segments[1];
      }

      if (slug) {
        const found = resolveStakeholderBySlugOrId(slug);
        if (found) {
          setSelectedStakeholder(found);
          return;
        }
      }

      if (segments.length <= 1 || (segments.length === 2 && segments[1] === 'people')) {
        setSelectedStakeholder(null);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('ptic-navigate', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('ptic-navigate', syncFromUrl);
    };
  }, []);

  const handleSelectStakeholder = (stk: Stakeholder) => {
    setSelectedStakeholder(stk);
    pushNav(`/directory/people/${slugify(stk.name)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStakeholder = () => {
    setSelectedStakeholder(null);
    pushNav('/directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentMembers = useMemo(() => [
    { ...MOCK_STAKEHOLDERS[11], joinedAgo: '2h ago' },
    { ...MOCK_STAKEHOLDERS[10], joinedAgo: '5h ago' },
    { ...MOCK_STAKEHOLDERS[9], joinedAgo: '1d ago' },
    { ...MOCK_STAKEHOLDERS[8], joinedAgo: '2d ago' },
    { ...MOCK_STAKEHOLDERS[5], joinedAgo: '3d ago' },
  ], []);

  const categories = [
    { id: 'All', label: t('catAll') },
    { id: 'Farmers', label: t('catFarmers') },
    { id: 'Veterinarians', label: t('catVeterinarians') },
    { id: 'Poultry Industry', label: t('catPoultryIndustry') },
    { id: 'Experts', label: t('catExperts') },
    { id: 'Technology Providers', label: t('catTechProviders') },
  ];

  const filtered = useMemo(() => {
    return MOCK_STAKEHOLDERS.filter((s) => {
      let matchesMemberType = true;
      if (selectedMemberType === 'Company') {
        matchesMemberType =
          s.category === 'Integrator' ||
          s.category === 'Technology Provider' ||
          s.category === 'Poultry Industry' ||
          s.organization.toLowerCase().includes('ltd') ||
          s.organization.toLowerCase().includes('farms') ||
          s.organization.toLowerCase().includes('solutions') ||
          s.organization.toLowerCase().includes('services') ||
          s.organization.toLowerCase().includes('integrations') ||
          s.role.toLowerCase().includes('director') ||
          s.role.toLowerCase().includes('ceo') ||
          s.role.toLowerCase().includes('lead');
      }

      let matchesCategory = false;
      if (selectedCategory === 'All') matchesCategory = true;
      else if (selectedCategory === 'Farmers') matchesCategory = s.category === 'Farmer' || s.role.toLowerCase().includes('farmer');
      else if (selectedCategory === 'Veterinarians') matchesCategory = s.category === 'Veterinarian' || s.role.toLowerCase().includes('veterinarian');
      else if (selectedCategory === 'Poultry Industry') matchesCategory = s.category === 'Integrator' || s.category === 'Technology Provider' || s.organization.toLowerCase().includes('poultry') || s.role.toLowerCase().includes('director');
      else if (selectedCategory === 'Experts') matchesCategory = s.category === 'Researcher' || s.category === 'Veterinarian' || s.role.toLowerCase().includes('scientist');
      else if (selectedCategory === 'Technology Providers') matchesCategory = s.category === 'Technology Provider';
      else matchesCategory = s.category === selectedCategory;

      const matchesQuery =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.organization.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase()) ||
        s.specialties.some(sp => sp.toLowerCase().includes(search.toLowerCase()));

      return matchesMemberType && matchesCategory && matchesQuery;
    });
  }, [search, selectedCategory, selectedMemberType]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedMemberType('All Members');
  };

  // ----------------------------------------------------------------------------------
  // MEMBER PROFILE VIEW (Redesigned Member Detail Page conforming to Mentor Reference)
  // ----------------------------------------------------------------------------------
  if (selectedStakeholder) {
    return (
      <MemberDetailView
        stakeholder={selectedStakeholder}
        onBack={handleCloseStakeholder}
        onNavigate={onNavigate}
        onOpenMessage={onOpenMessage}
      />
    );
  }

  // ----------------------------------------------------------------------------------
  // PEOPLE LIST VIEW (Default grid of members: 75% Grid | 25% Sidebar)
  // ----------------------------------------------------------------------------------
  return (
    <div className="w-full max-w-full px-0 sm:px-1 space-y-6 text-left animate-fadeIn">
      {/* Main 2-Column Section (approx 75% left | 25% right) */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Search, Filters & Member Cards Grid (75% width: 9 of 12 cols on xl, 8 on lg) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Search & Filter Dropdown Row */}
          <div className="flex items-center gap-2.5 w-full">
            <div className="flex-1 min-w-0">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t('dirSearchPlaceholder')}
              />
            </div>

            {/* Filter Button with Dropdown */}
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`h-[42px] px-3.5 rounded-[12px] border flex items-center gap-2 text-xs font-semibold transition-all select-none cursor-pointer ${selectedMemberType === 'Company'
                    ? 'bg-sky-50 text-[#0f8f8c] border-[#0f8f8c]/40 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                title={t('dirFilterMembers')}
              >
                <Filter size={15} className={selectedMemberType === 'Company' ? 'text-[#0f8f8c]' : 'text-slate-500'} />
                <span className="hidden sm:inline">
                  {selectedMemberType === 'Company' ? t('dirCompany') : t('dirAllMembers')}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-150 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 text-left">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('dirFilterMembers')}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMemberType('All Members');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${selectedMemberType === 'All Members'
                        ? 'bg-sky-50 text-[#0f8f8c] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>1) {t('dirAllMembers')}</span>
                    {selectedMemberType === 'All Members' && (
                      <Check size={14} className="text-[#0f8f8c]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMemberType('Company');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${selectedMemberType === 'Company'
                        ? 'bg-sky-50 text-[#0f8f8c] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>2) {t('dirCompany')}</span>
                    {selectedMemberType === 'Company' && (
                      <Check size={14} className="text-[#0f8f8c]" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-left">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap select-none cursor-pointer ${isSelected
                      ? 'bg-[#0f8f8c] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid of Member Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 text-left">
              <EmptyState
                title={t('dirEmptyTitle')}
                description={t('dirEmptyDesc')}
                actionLabel={t('dirClearFilters')}
                onAction={clearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
              {filtered.map((stk) => (
                <div
                  key={stk.id}
                  onClick={() => handleSelectStakeholder(stk)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-card hover:border-[#0f8f8c]/50 p-4 sm:p-5 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={stk.avatarUrl}
                      initials={stk.initials}
                      size="lg"
                      className="w-14 h-14 rounded-full ring-2 ring-slate-100 object-cover shadow-xs"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-[#0f8f8c] transition-colors truncate leading-snug">
                      {stk.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal leading-tight mt-1 line-clamp-1">
                      {stk.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5 line-clamp-1">
                      {stk.organization} · {stk.location.split(',')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Connections & Recently Joined (approx 25% width: 3 of 12 cols on xl, 4 on lg) */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-5 text-left sticky top-20">
          {/* Widget 1: Connections Count Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 text-center">
            <div className="flex items-center justify-center -space-x-2 mb-3">
              <Avatar
                src={MOCK_STAKEHOLDERS[0]?.avatarUrl}
                initials={MOCK_STAKEHOLDERS[0]?.initials}
                size="sm"
                className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-xs"
              />
              <Avatar
                src={MOCK_STAKEHOLDERS[1]?.avatarUrl}
                initials={MOCK_STAKEHOLDERS[1]?.initials}
                size="sm"
                className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-xs"
              />
              <Avatar
                src={MOCK_STAKEHOLDERS[2]?.avatarUrl}
                initials={MOCK_STAKEHOLDERS[2]?.initials}
                size="sm"
                className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-xs"
              />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              767
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              {t('dirConnections')}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
              {t('dirConnectionsSub')}
            </p>
          </div>

          {/* Widget 2: Recently Joined Members */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t('dirRecentlyJoined')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {t('dirLatestRegistered')}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40">
                {t('councilBadge', 'Council Member')}
              </span>
            </div>

            <div className="pt-2 divide-y divide-slate-100/80">
              {recentMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelectStakeholder(member)}
                  className="flex w-full items-center gap-3 py-2.5 px-1.5 text-left transition-all hover:bg-slate-50/80 rounded-lg group cursor-pointer"
                >
                  <Avatar
                    src={member.avatarUrl}
                    initials={member.initials}
                    size="md"
                    className="w-10 h-10 rounded-full shrink-0 ring-1 ring-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0f8f8c] transition-colors">
                        {member.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                        {member.joinedAgo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                      <Building size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{member.organization}</span>
                    </p>
                  </div>
                  <ChevronRight size={13} className="text-slate-300 group-hover:text-[#0f8f8c] shrink-0 transition-colors ml-1" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DirectoryView;
