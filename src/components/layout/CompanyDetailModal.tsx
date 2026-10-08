import React, { useEffect } from 'react';
import { BusinessProfile } from '../../types';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Globe, 
  Mail, 
  ExternalLink, 
  Send
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useLanguage } from '../../lib/LanguageContext';

export interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: BusinessProfile | null;
  onBackToMember?: () => void;
  onOpenRepresentative?: (representativeId: string) => void;
  onDirectInquiry?: (company: BusinessProfile) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
  onBackToMember,
  onOpenRepresentative,
  onDirectInquiry,
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

  if (!isOpen || !company) return null;

  const handlePhoneCall = () => {
    window.open(`tel:${company.phone.replace(/[^0-9+]/g, '') || '+919842154321'}`, '_self');
    showToast('Calling Enterprise', `Connecting to ${company.name}...`, 'info');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello, I am contacting ${company.name} from PTIC People regarding business inquiry.`);
    const phoneNum = company.socials?.whatsapp?.replace(/[^0-9]/g, '') || '919842154321';
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  const handleBack = () => {
    if (onBackToMember) {
      onBackToMember();
    } else {
      onClose();
    }
  };

  const handleInquiry = () => {
    if (onDirectInquiry) {
      onDirectInquiry(company);
    } else {
      showToast('Direct Inquiry', `Inquiry line for ${company.name} is active.`, 'success');
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

      {/* Elegant High-End Business Profile Card */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#153451] rounded-[32px] border border-slate-200/90 dark:border-[#294966] shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 text-left my-auto">
        
        {/* Top Dark Header Bar */}
        <div className="bg-[#0B0F17] dark:bg-[#0A1931] text-white px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/10 dark:border-[#294966]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back"
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
              title="Back to Member Profile"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase">
              {t('businessProfile', 'BUSINESS PROFILE')}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            <ShieldCheck size={12} />
            <span>{t('verified', 'Verified')}</span>
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-4 max-h-[calc(90vh-3.5rem)] overflow-y-auto scrollbar-none space-y-4">
          
          {/* Company Title */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight leading-snug">
              {company.name}
            </h3>
            <p className="text-xs font-semibold text-[#0f8f8c] mt-0.5">
              {company.category} · {company.type}
            </p>
          </div>

          {/* Business Logo Banner */}
          <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/70 dark:from-[#0A1931] dark:to-[#153451] border border-slate-200 dark:border-[#294966] relative overflow-hidden flex items-center justify-center shadow-xs">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : null}

            {/* Branded Watermark Badge */}
            <div className="absolute inset-0 bg-[#0B0F17]/35 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-1 bg-white/90 dark:bg-[#153451]/90 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/80 dark:border-[#294966] shadow-md">
                <span className="text-[10px] font-black tracking-widest text-[#0f8f8c] uppercase">
                  {t('businessLogo', 'BUSINESS LOGO')}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                  {company.name}
                </span>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
              {t('brands', 'Brands')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-[#B3CFE5] font-medium">
              --
            </p>
          </div>

          {/* Business Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
              {t('businessDescription', 'Business Description')}
            </h4>
            <p className="text-xs text-slate-700 dark:text-[#B3CFE5] leading-relaxed font-normal">
              {company.description}
            </p>
          </div>

          {/* Key Services & Capabilities */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]">
              {t('servicesAndCapabilities', 'Services & Capabilities')}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {company.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-white dark:bg-[#102640] text-[#14253d] dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] shadow-2xs"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Enterprise Channels */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] text-xs space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]">
              {t('enterpriseChannels', 'Enterprise Channels')}
            </h4>
            {company.website && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/80 dark:border-[#294966]">
                <span className="text-slate-500 dark:text-[#B3CFE5] flex items-center gap-1.5">
                  <Globe size={13} className="text-[#0f8f8c]" /> {t('website', 'Website')}
                </span>
                <a
                  href={company.website}
                  className="font-semibold text-[#0a66c2] hover:underline flex items-center gap-1"
                >
                  <span>{company.website.replace('https://', '')}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            )}
            <div className="flex items-center justify-between py-1 border-b border-slate-200/80 dark:border-[#294966]">
              <span className="text-slate-500 dark:text-[#B3CFE5] flex items-center gap-1.5">
                <Mail size={13} className="text-[#0f8f8c]" /> {t('email', 'Email')}
              </span>
              <span className="font-semibold text-slate-800 dark:text-[#F6FAFD]">{company.email}</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 dark:text-[#B3CFE5] flex items-center gap-1.5">
                <Phone size={13} className="text-[#0f8f8c]" /> {t('phone', 'Phone')}
              </span>
              <span className="font-semibold text-slate-800 dark:text-[#F6FAFD]">{company.phone}</span>
            </div>
          </div>

          {/* Representative Bottom Card - Exactly as in user's design */}
          <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#102640] shadow-sm flex items-center justify-between gap-3">
            <div 
              onClick={() => {
                if (company.representativeId && onOpenRepresentative) {
                  onOpenRepresentative(company.representativeId);
                } else if (onBackToMember) {
                  onBackToMember();
                }
              }}
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
              title="Click to view representative profile"
            >
              <img
                src={company.representativeAvatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'}
                alt={company.representativeName || 'Representative'}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-[#294966] shrink-0 group-hover:ring-[#0f8f8c] transition-all"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD] group-hover:text-[#0f8f8c] transition-colors truncate">
                  {company.representativeName || 'Representative'}
                </h5>
                <p className="text-xs text-slate-500 dark:text-[#B3CFE5] truncate mt-0.5">
                  {company.representativeRole || company.location.split(',')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePhoneCall}
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="Call Representative"
              >
                <Phone size={15} />
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                title="WhatsApp Representative"
              >
                <MessageCircle size={15} />
              </button>
            </div>
          </div>

          {/* Direct Enterprise Inquiry Action */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleInquiry}
              className="w-full bg-[#0f8f8c] hover:bg-[#0c7a77] active:scale-[0.99] text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-[#0f8f8c]/20 transition-all text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={14} />
              <span>{t('directEnterpriseInquiry', 'Direct Enterprise Inquiry')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
