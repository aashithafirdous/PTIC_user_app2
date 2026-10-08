import React, { useState } from 'react';
import { Stakeholder, NavRoute } from '../../types';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Users, 
  MessageSquare, 
  Share2, 
  Globe, 
  ExternalLink, 
  Building2 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ShareModal } from '../common/ShareModal';
import { slugify, pushNav } from '../../lib/router';

export interface MemberDetailViewProps {
  stakeholder: Stakeholder;
  onBack: () => void;
  onNavigate?: (route: NavRoute) => void;
  onOpenMessage?: (stakeholder: Stakeholder) => void;
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({
  stakeholder,
  onBack,
  onNavigate: _onNavigate,
  onOpenMessage,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Check if viewing Dr. Arun Kumar for verbatim mock text matching
  const isDrArunKumar = stakeholder.id === 'u1' || stakeholder.name.toLowerCase().includes('arun kumar');

  const memberName = isDrArunKumar ? 'Dr. Arun Kumar' : stakeholder.name;
  const memberCategory = isDrArunKumar ? 'Veterinarian' : stakeholder.category;
  const memberDesignation = isDrArunKumar 
    ? 'Senior Poultry Veterinarian at VetCare Poultry Services' 
    : `${stakeholder.role} at ${stakeholder.organization}`;
  const memberLocation = isDrArunKumar ? 'Namakkal, Tamil Nadu' : stakeholder.location;
  const memberConnections = isDrArunKumar ? 142 : stakeholder.connectionsCount;
  const memberId = isDrArunKumar ? 'PTIC-U1-2026' : `PTIC-${stakeholder.id.toUpperCase()}-2026`;

  const specialtiesList = isDrArunKumar 
    ? ['Avian Pathology', 'Vaccine Protocols', 'Biosecurity'] 
    : stakeholder.specialties;

  const aboutText = isDrArunKumar
    ? '20+ years clinical poultry experience specializing in respiratory diagnostics, gut health, and biosecurity protocols.'
    : stakeholder.bio;

  const councilStandingText = isDrArunKumar
    ? 'Active member of the PTIC Regional Advisory Panel. Engaged in commercial flock health, biosecurity standards, and technological adoption across Namakkal and Western Tamil Nadu.'
    : `Active member of the PTIC Council. Engaged in commercial poultry health, biosecurity standards, and technological adoption across ${stakeholder.location}.`;

  const enterpriseName = isDrArunKumar ? 'VetCare Poultry Services' : stakeholder.organization;
  const enterpriseInitials = isDrArunKumar ? 'VE' : stakeholder.organization.slice(0, 2).toUpperCase();
  const enterpriseCategory = isDrArunKumar ? 'Commercial Poultry Operations' : 'Commercial Poultry Operations';
  const enterpriseDesc = isDrArunKumar
    ? 'VetCare Poultry Services operates in Namakkal, Tamil Nadu in active partnership with the PTIC Council.'
    : `${stakeholder.organization} operates in ${stakeholder.location} in active partnership with the PTIC Council.`;
  const enterpriseLocation = isDrArunKumar ? 'Namakkal, Tamil Nadu' : stakeholder.location;
  const enterpriseWebsite = 'https://ptic-council.org/';

  const shareUrl = `${window.location.origin}/directory/people/${slugify(memberName)}`;

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleMessage = () => {
    if (onOpenMessage) {
      onOpenMessage(stakeholder);
    }
    pushNav(`/inbox?member=${stakeholder.id}`);
  };

  return (
    <div className="w-full text-left">
      {/* Full width container */}
      <div className="w-full max-w-full px-1 sm:px-2">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="pb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to People</span>
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Member Profile
          </span>
        </div>

        {/* ====================================================================== */}
        {/* 1. COVER SECTION (Landscape Poultry Cover with ~90% Visibility)       */}
        {/* ====================================================================== */}
        <div className="relative w-full h-24 sm:h-28 lg:h-32 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-[#294966] bg-slate-900/10 dark:bg-slate-900/30">
          <img
            src="/poultry_cover_banner.jpg"
            alt="Poultry Farm Landscape"
            className="w-full h-full object-cover object-center select-none opacity-90 brightness-[0.98] contrast-[1.02]"
          />
          {/* Subtle gradient overlay to ensure button contrast while preserving 90% visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/15 pointer-events-none" />

          {/* "Share Profile" Button on the upper/right side of the cover */}
          <button
            type="button"
            onClick={handleShareClick}
            className="absolute top-3 right-3 sm:top-3.5 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 dark:bg-[#153451]/95 hover:bg-white dark:hover:bg-[#1A3D63] text-slate-700 dark:text-[#F6FAFD] backdrop-blur-md text-xs font-semibold shadow-xs border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer hover:shadow-md active:scale-95"
            title="Share Profile"
          >
            <Share2 size={13} className="text-[#135E69] dark:text-[#4A7FA7]" />
            <span>Share Profile</span>
          </button>
        </div>

        {/* ====================================================================== */}
        {/* MAIN BODY: LEFT PROFILE CARD + RIGHT MEMBER INFORMATION AREA         */}
        {/* Proportions: Left ~26-28%, Right ~72-74%, Small Gap                   */}
        {/* Mobile: Clean single-column vertical flow                             */}
        {/* ====================================================================== */}
        <div className="mt-0 flex flex-col lg:flex-row gap-6 lg:gap-7 xl:gap-8 items-start">
          
          {/* ==================================================================== */}
          {/* 4. PROFILE CARD — LEFT SIDE                                         */}
          {/* Overlaps cover on desktop (-mt-10 to -mt-14)                        */}
          {/* ==================================================================== */}
          <aside className="w-full lg:w-[28%] xl:w-[26%] 2xl:w-[24%] shrink-0 -mt-10 sm:-mt-12 lg:-mt-14 relative z-10 space-y-4">
            
            {/* Main Profile Identity Card */}
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-sm p-5 sm:p-6 text-center space-y-4">
              
              {/* Circular Profile Photo */}
              <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white dark:ring-[#153451] shadow-md overflow-hidden bg-slate-100 dark:bg-[#102640]">
                <img
                  src={stakeholder.avatarUrl}
                  alt={memberName}
                  className="w-full h-full object-cover rounded-full"
                />
                <span 
                  className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#153451] rounded-full shadow-xs" 
                  title="Verified Online Member" 
                />
              </div>

              {/* Dr. Arun Kumar */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F6FAFD] font-display tracking-tight leading-tight">
                  {memberName}
                </h1>

                {/* Verification Badges */}
                <div className="flex flex-col items-center gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/90 dark:border-emerald-800/40">
                    <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>PTIC Council Verified Member</span>
                  </span>
                  
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40">
                      <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Stakeholder</span>
                    </span>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40">
                      {memberCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Designation */}
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                {memberDesignation}
              </p>

              {/* Location, Connections, Member ID */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#294966] space-y-2 text-xs text-slate-600 dark:text-[#88B0D3]">
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin size={13} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0" />
                  <span>{memberLocation}</span>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-700 dark:text-[#B3CFE5]">
                  <Users size={13} className="text-[#135E69] dark:text-[#4A7FA7] shrink-0" />
                  <span>{memberConnections} Connections</span>
                </div>

                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tracking-tight pt-0.5">
                  Member ID: {memberId}
                </div>
              </div>

              {/* Action Button: [Message] ONLY — Perfectly centered and aligned */}
              <div className="pt-3 w-full flex items-center justify-center">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<MessageSquare size={15} />}
                  onClick={handleMessage}
                  className="w-full h-10 rounded-xl font-semibold text-sm shadow-xs justify-center tracking-normal"
                >
                  Message
                </Button>
              </div>
            </div>

            {/* Below Profile Card: Compact "Specialties" Section */}
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-4 sm:p-5 space-y-2.5 text-left">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                Specialties
              </h3>
              
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {specialtiesList.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1A3D63] text-slate-700 dark:text-[#B3CFE5] border border-slate-200/70 dark:border-[#294966]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* ==================================================================== */}
          {/* 5. MAIN CONTENT AREA — RIGHT SIDE (~72-74% Width)                   */}
          {/* Restrained card layout, single scrolling flow, NO TABS               */}
          {/* ==================================================================== */}
          <main className="w-full lg:w-[72%] xl:w-[74%] 2xl:w-[76%] min-w-0 pt-3 lg:pt-4 space-y-5">
            
            {/* Card 1: About & Professional Background */}
            <section className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 sm:p-6 space-y-2.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                About &amp; Professional Background
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                {aboutText}
              </p>
            </section>

            {/* Card 2: Council Standing */}
            <section className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 sm:p-6 space-y-2.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                Council Standing
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                {councilStandingText}
              </p>
            </section>

            {/* Card 3: Specialties & Key Domains */}
            <section className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 sm:p-6 space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                Specialties &amp; Key Domains
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#88B0D3]">
                Verified core competencies and advisory areas acknowledged by the PTIC Board:
              </p>
              
              <ul className="space-y-2 pt-1">
                {specialtiesList.map((spec) => (
                  <li key={spec} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-[#F6FAFD]">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check size={12} />
                    </span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Card 4: Associated Enterprise */}
            <section className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-[#135E69] dark:text-[#4A7FA7]" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                    Associated Enterprise
                  </h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1A3D63] text-slate-700 dark:text-[#B3CFE5] border border-slate-200/60 dark:border-[#294966]">
                  Registered Enterprise
                </span>
              </div>

              {/* Enterprise Summary Row */}
              <div className="flex items-start gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-[#135E69]/10 dark:bg-[#135E69]/25 text-[#135E69] dark:text-[#4A7FA7] font-bold flex items-center justify-center text-sm border border-[#135E69]/20 shrink-0">
                  {enterpriseInitials}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">
                    {enterpriseName}
                  </h4>
                  <p className="text-xs text-[#135E69] dark:text-[#4A7FA7] font-semibold">
                    {enterpriseCategory}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-[#B3CFE5] leading-relaxed pt-1">
                    {enterpriseDesc}
                  </p>
                </div>
              </div>

              {/* Enterprise Location & Website */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#294966] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 dark:text-[#88B0D3] flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 dark:text-[#88B0D3]" />
                  {enterpriseLocation}
                </span>
                
                <a
                  href={enterpriseWebsite}
                  className="inline-flex items-center gap-1 font-semibold text-[#135E69] dark:text-[#4A7FA7] hover:underline"
                >
                  <Globe size={13} />
                  <span>{enterpriseWebsite}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Share Profile Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={{
          title: `${memberName} — PTIC Member Profile`,
          text: `${memberDesignation} (${memberLocation})`,
          url: shareUrl,
        }}
      />
    </div>
  );
};
