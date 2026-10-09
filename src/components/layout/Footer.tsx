import React from 'react';
import { NavRoute } from '../../types';
import { useLanguage } from '../../lib/LanguageContext';
import { useToast } from '../ui/Toast';

export interface FooterProps {
  onNavigate?: (route: NavRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleSupportClick = (item: string) => {
    showToast(item, `${item} document and council policies are available to members.`, 'info');
  };

  return (
    <footer className="w-full mt-12 sm:mt-16 pt-10 pb-8 border-t border-slate-200/90 dark:border-[#294966] bg-transparent text-slate-600 dark:text-[#B3CFE5] select-none transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8">
          {/* Column 1: Brand & Tagline (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3.5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#135E69] text-white font-extrabold text-sm tracking-wider font-sans shadow-xs">
                PTIC
              </div>
              <div className="text-left">
                <span className="font-display text-sm font-black text-slate-900 dark:text-[#F6FAFD] tracking-tight block leading-tight">
                  Poultry Technology & Innovation Council
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#B3CFE5]/80 font-medium">
                  {t('namakkalChapter', 'Namakkal Chapter')} · India
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B3CFE5] leading-relaxed max-w-md">
              Empowering poultry farmers, researchers, and industry stakeholders with accessible technology, scientific knowledge, and sustainable poultry practices.
            </p>
          </div>

          {/* Column 2: Quick Links (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F6FAFD]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('directory')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  People
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('events')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('emart')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  E-Mart
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('ask')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Ask Experts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F6FAFD]">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleSupportClick('Help Center')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSupportClick('Community Guidelines')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSupportClick('Privacy Policy')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSupportClick('Terms')}
                  className="hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer text-left"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Icons & Connect (2 cols on lg) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F6FAFD]">
              Connect
            </h4>
            <p className="text-xs text-slate-500 dark:text-[#B3CFE5]/80">
              Join the poultry community conversations and stay updated.
            </p>
            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-1">
              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => showToast('LinkedIn', 'Connecting to PTIC LinkedIn Official Chapter.', 'info')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#294966] bg-white dark:bg-[#153451] hover:bg-[#135E69] hover:text-white dark:hover:bg-[#4A7FA7] flex items-center justify-center transition-all cursor-pointer group"
                aria-label="PTIC LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={() => showToast('X (Twitter)', 'Connecting to PTIC Official Feed.', 'info')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#294966] bg-white dark:bg-[#153451] hover:bg-[#135E69] hover:text-white dark:hover:bg-[#4A7FA7] flex items-center justify-center transition-all cursor-pointer group"
                aria-label="PTIC X"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* YouTube */}
              <button
                type="button"
                onClick={() => showToast('YouTube', 'Accessing PTIC Webinar archive & tutorials.', 'info')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#294966] bg-white dark:bg-[#153451] hover:bg-[#135E69] hover:text-white dark:hover:bg-[#4A7FA7] flex items-center justify-center transition-all cursor-pointer group"
                aria-label="PTIC YouTube"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26.24 26.24 0 0 0 2 12a26.24 26.24 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.24 26.24 0 0 0 22 12a26.24 26.24 0 0 0-.42-4.81zM9.75 15.02V8.98l5.5 3.02z" />
                </svg>
              </button>

              {/* Mail */}
              <button
                type="button"
                onClick={() => showToast('Email Secretariat', 'secretariat@ptic.org.in', 'info')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#294966] bg-white dark:bg-[#153451] hover:bg-[#135E69] hover:text-white dark:hover:bg-[#4A7FA7] flex items-center justify-center transition-all cursor-pointer group"
                aria-label="Email PTIC Secretariat"
                title="Email PTIC"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-[#294966] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-[#B3CFE5]/80">
          <p>© 2026 Poultry Technology & Innovation Council (PTIC). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Namakkal · Chennai · Coimbatore</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Council Network Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
