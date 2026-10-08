import React, { useEffect } from 'react';
import { Stakeholder, BusinessProfile } from '../../types';
import { MOCK_COMPANIES } from '../../data/mockData';
import { 
  ChevronLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronRight,
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useLanguage } from '../../lib/LanguageContext';

export interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholder: Stakeholder | null;
  onDirectInquiry?: (stakeholder: Stakeholder) => void;
  onOpenCompany?: (company: BusinessProfile) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  stakeholder,
  onDirectInquiry,
  onOpenCompany,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !stakeholder) return null;

  // Resolve matching company profile
  const matchedCompany: BusinessProfile = MOCK_COMPANIES.find((c: BusinessProfile) => 
    c.name.toLowerCase() === stakeholder.organization.toLowerCase() ||
    c.name.toLowerCase().includes(stakeholder.organization.toLowerCase()) ||
    stakeholder.organization.toLowerCase().includes(c.name.toLowerCase())
  ) || {
    id: 'c-default',
    name: stakeholder.organization,
    initials: stakeholder.organization.slice(0, 2).toUpperCase(),
    category: 'Commercial Poultry',
    type: 'Registered Enterprise',
    services: stakeholder.specialties.slice(0, 3),
    description: `${stakeholder.organization} operates in ${stakeholder.location} in active partnership with the PTIC Council.`,
    location: stakeholder.location,
    website: 'https://ptic-council.org',
    phone: '+91 98421 •••••',
    email: `${stakeholder.name.toLowerCase().replace(/[^a-z]/g, '')}@ptic-council.org`,
  };

  const councilEmail = `${stakeholder.name.toLowerCase().replace(/[^a-z]/g, '')}@ptic-council.org`;

  const handleDownloadContact = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${stakeholder.name}
ORG:${stakeholder.organization}
TITLE:${stakeholder.role}
EMAIL:${councilEmail}
TEL;TYPE=CELL:+919842154321
ADR;TYPE=WORK:;;${stakeholder.location};;;;
NOTE:${stakeholder.bio}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${stakeholder.name.replace(/\s+/g, '_')}_Contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      'Contact Downloaded',
      `Saved ${stakeholder.name}'s contact card to device.`,
      'success'
    );
  };

  const handlePhoneClick = () => {
    window.open('tel:+919842154321', '_self');
    showToast('Calling Stakeholder', 'Opening phone dialer...', 'info');
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(`Hello ${stakeholder.name}, I am reaching out from PTIC People regarding ${stakeholder.organization}.`);
    window.open(`https://wa.me/919842154321?text=${text}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${councilEmail}?subject=PTIC Council Inquiry`, '_self');
  };

  const handleInquiryClick = () => {
    if (onDirectInquiry) {
      onDirectInquiry(stakeholder);
    } else {
      showToast('Direct Inquiry', `Inquiry sent to ${stakeholder.name}.`, 'success');
    }
  };

  const handleCompanyClick = () => {
    if (onOpenCompany) {
      onOpenCompany(matchedCompany);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn bg-slate-950/75 backdrop-blur-md"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Elegant High-End Mobile-First Profile Card */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#153451] rounded-[32px] border border-slate-200/90 dark:border-[#294966] shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 text-left my-auto">
        
        {/* Top Dark Header Bar */}
        <div className="bg-[#0B0F17] dark:bg-[#0A1931] text-white px-5 pt-4 pb-3 flex items-center justify-between relative border-b border-white/10 dark:border-[#294966]">
          <div className="flex items-center gap-3">
            {/* Round Back Icon */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase">
              {t('navProfile', 'PROFILE')}
            </span>
          </div>

          {/* Reference Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300">
            <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck size={11} />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">{t('reference', 'REFERENCE')}</div>
              <div className="text-[10px] font-semibold text-white">PTIC #2026</div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-4 max-h-[calc(90vh-3.5rem)] overflow-y-auto scrollbar-none space-y-4">
          
          {/* Centered Credential Pill */}
          <div className="flex justify-center -mt-1">
            <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-[#102640] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border border-slate-700/80 dark:border-[#294966]">
              <span className="bg-[#0f8f8c] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                PTIC
              </span>
              <span className="text-[11px] font-medium text-slate-200 dark:text-[#B3CFE5]">
                20+ Years
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-[11px] font-medium text-slate-200 dark:text-[#B3CFE5]">
                {stakeholder.location.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Large Portrait Photo Card */}
          <div className="relative mx-auto w-full max-w-[270px] aspect-[4/5] rounded-[22px] overflow-hidden shadow-xl ring-1 ring-slate-200/80 dark:ring-[#294966] bg-slate-100 dark:bg-[#102640]">
            <img
              src={stakeholder.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'}
              alt={stakeholder.name}
              className="w-full h-full object-cover"
            />
            {/* Green Verified Circle Badge in top right corner of photo */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg ring-2 ring-white">
              <Check size={16} strokeWidth={3} />
            </div>
          </div>

          {/* Stakeholder Identity */}
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              {stakeholder.name}
            </h3>
            <p className="text-xs font-semibold text-[#0f8f8c]">
              {stakeholder.role}
            </p>

            {/* Clean Organization Pill - WITHOUT "Details →" */}
            <div className="pt-1 flex justify-center">
              <div className="inline-block px-4 py-1 rounded-lg border border-slate-300/90 dark:border-[#294966] text-slate-700 dark:text-[#B3CFE5] bg-slate-50/80 dark:bg-[#102640] text-xs font-bold tracking-tight">
                {stakeholder.organization}
              </div>
            </div>
          </div>

          {/* Profile Score Bar */}
          <div className="rounded-xl bg-gradient-to-r from-[#14253d] via-[#1c385c] to-[#0f8f8c] px-4 py-3 text-white flex items-center justify-between shadow-md">
            <span className="text-xs font-extrabold tracking-widest uppercase text-slate-200">
              {t('profileScore', 'PROFILE SCORE')}
            </span>
            <span className="text-base font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
              98%
            </span>
          </div>

          {/* Floating Action Buttons Capsule */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-[#102640] rounded-full border border-slate-200/90 dark:border-[#294966] shadow-md p-1.5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePhoneClick}
                className="w-10 h-10 rounded-full bg-slate-900 dark:bg-[#1A3D63] hover:bg-[#0f8f8c] dark:hover:bg-[#0f8f8c] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="Phone call"
              >
                <Phone size={16} />
              </button>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-10 h-10 rounded-full bg-slate-900 dark:bg-[#1A3D63] hover:bg-[#25D366] dark:hover:bg-[#25D366] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="WhatsApp message"
              >
                <MessageCircle size={16} />
              </button>
              <button
                type="button"
                onClick={handleEmailClick}
                className="w-10 h-10 rounded-full bg-slate-900 dark:bg-[#1A3D63] hover:bg-[#0f8f8c] dark:hover:bg-[#0f8f8c] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="Email message"
              >
                <Mail size={16} />
              </button>
              <button
                type="button"
                onClick={handleInquiryClick}
                className="w-10 h-10 rounded-full bg-slate-900 dark:bg-[#1A3D63] hover:bg-[#0f8f8c] dark:hover:bg-[#0f8f8c] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="Direct inquiry"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* About Stakeholder */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]">
              {t('aboutStakeholder', 'About Stakeholder')}
            </h4>
            <p className="text-xs text-slate-700 dark:text-[#F6FAFD] leading-relaxed font-normal">
              {stakeholder.bio}
            </p>
          </div>

          {/* Specialties & Domains */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]">
              {t('specialtiesAndDomains', 'Specialties & Domains')}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stakeholder.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-white dark:bg-[#102640] text-[#14253d] dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] shadow-2xs"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* ========================================================
              BUSINESS LOGO CARD
              "if i click business logo show business details"
              ======================================================== */}
          <div className="pt-1">
            {/* Clickable Business Logo Card */}
            <div
              onClick={handleCompanyClick}
              className="rounded-2xl border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#102640] p-3 shadow-sm hover:shadow-md hover:border-[#0f8f8c] transition-all cursor-pointer group"
              title="Click business logo to view business details"
            >
              {/* Business Logo Banner */}
              <div className="w-full h-36 rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/70 dark:from-[#0A1931] dark:to-[#153451] border border-slate-200 dark:border-[#294966] relative overflow-hidden flex items-center justify-center">
                {matchedCompany.logoUrl ? (
                  <img
                    src={matchedCompany.logoUrl}
                    alt={matchedCompany.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : null}

                {/* Elegant Watermark Overlay Badge with "BUSINESS LOGO" */}
                <div className="absolute inset-0 bg-[#0B0F17]/35 group-hover:bg-[#0B0F17]/20 transition-colors flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-1 bg-white/90 dark:bg-[#153451]/90 backdrop-blur-md px-5 py-2 rounded-xl border border-white/80 dark:border-[#294966] shadow-md">
                    <span className="text-[10px] font-black tracking-widest text-[#0f8f8c] uppercase">
                      {t('businessLogo', 'BUSINESS LOGO')}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                      {matchedCompany.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Strip with Company Info & Arrow */}
              <div className="pt-3 px-1 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD] group-hover:text-[#0f8f8c] transition-colors truncate">
                    {matchedCompany.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#153451] text-slate-600 dark:text-[#B3CFE5] border border-slate-200 dark:border-[#294966]">
                      {t('services', 'Services')}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-[#B3CFE5] truncate">
                      {matchedCompany.location.split(',')[0]}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#153451] text-slate-600 dark:text-[#B3CFE5] flex items-center justify-center group-hover:bg-[#0f8f8c] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action: Download Contact */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadContact}
              className="w-full bg-[#0f8f8c] hover:bg-[#0c7a77] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#0f8f8c]/25 transition-all text-sm text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('downloadContact', 'Download Contact')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
