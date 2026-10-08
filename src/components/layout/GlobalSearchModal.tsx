import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SearchInput } from '../ui/Input';
import { MOCK_STAKEHOLDERS, MOCK_EVENTS, MOCK_EMART_ITEMS, MOCK_QUESTIONS } from '../../data/mockData';
import { NavRoute } from '../../types';
import { useLanguage } from '../../lib/LanguageContext';
import { Users, Calendar, ShoppingBag, HelpCircle, ArrowRight } from 'lucide-react';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filteredStakeholders = query.trim()
    ? MOCK_STAKEHOLDERS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.organization.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredEvents = query.trim()
    ? MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.location.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredProducts = query.trim()
    ? MOCK_EMART_ITEMS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredQuestions = query.trim()
    ? MOCK_QUESTIONS.filter(q => q.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults = filteredStakeholders.length + filteredEvents.length + filteredProducts.length + filteredQuestions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('searchPTIC', 'Search PTIC Ecosystem')}
      description={t('searchPTICDesc', 'Find stakeholders, products, innovations, and upcoming events')}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t('searchPlaceholder', "Type to search e.g. 'Arun', 'IoT', 'PTSE', 'mortality'...")}
          autoFocus
        />

        {query.trim() === '' ? (
          <div className="py-6 text-center text-xs text-ptic-textMuted dark:text-[#B3CFE5]">
            {t('startTypingToSearch', 'Start typing to search across the PTIC council platform.')}
          </div>
        ) : totalResults === 0 ? (
          <div className="py-8 text-center text-xs text-ptic-textMuted dark:text-[#B3CFE5]">
            {t('noResultsFound', 'No results found for')} &ldquo;<span className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{query}</span>&rdquo;.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs">
            {/* Stakeholders */}
            {filteredStakeholders.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-ptic-textMuted dark:text-[#B3CFE5] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users size={13} className="text-ptic-secondary" /> {t('navPeople', 'People')}
                </p>
                <div className="space-y-1.5">
                  {filteredStakeholders.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { onClose(); onNavigate('directory'); }}
                      className="p-2.5 rounded-[10px] bg-slate-50 dark:bg-[#102640] hover:bg-slate-100 dark:hover:bg-[#1A3D63] border border-slate-200/60 dark:border-[#294966] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{s.name}</p>
                        <p className="text-ptic-textMuted dark:text-[#B3CFE5] text-[11px]">{s.role} · {s.organization}</p>
                      </div>
                      <ArrowRight size={14} className="text-ptic-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {filteredEvents.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-ptic-textMuted dark:text-[#B3CFE5] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} className="text-ptic-secondary" /> {t('navEvents', 'Events')}
                </p>
                <div className="space-y-1.5">
                  {filteredEvents.map(e => (
                    <div
                      key={e.id}
                      onClick={() => { onClose(); onNavigate('events'); }}
                      className="p-2.5 rounded-[10px] bg-slate-50 dark:bg-[#102640] hover:bg-slate-100 dark:hover:bg-[#1A3D63] border border-slate-200/60 dark:border-[#294966] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{e.title}</p>
                        <p className="text-ptic-textMuted dark:text-[#B3CFE5] text-[11px]">{e.date} · {e.location}</p>
                      </div>
                      <ArrowRight size={14} className="text-ptic-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-ptic-textMuted dark:text-[#B3CFE5] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShoppingBag size={13} className="text-ptic-secondary" /> {t('navEmart', 'E-Mart Products')}
                </p>
                <div className="space-y-1.5">
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { onClose(); onNavigate('emart'); }}
                      className="p-2.5 rounded-[10px] bg-slate-50 dark:bg-[#102640] hover:bg-slate-100 dark:hover:bg-[#1A3D63] border border-slate-200/60 dark:border-[#294966] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{p.title}</p>
                        <p className="text-ptic-textMuted dark:text-[#B3CFE5] text-[11px]">{p.provider}</p>
                      </div>
                      <ArrowRight size={14} className="text-ptic-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {filteredQuestions.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-ptic-textMuted dark:text-[#B3CFE5] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-ptic-secondary" /> {t('navAsk', 'Expert Discussions')}
                </p>
                <div className="space-y-1.5">
                  {filteredQuestions.map(q => (
                    <div
                      key={q.id}
                      onClick={() => { onClose(); onNavigate('ask'); }}
                      className="p-2.5 rounded-[10px] bg-slate-50 dark:bg-[#102640] hover:bg-slate-100 dark:hover:bg-[#1A3D63] border border-slate-200/60 dark:border-[#294966] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{q.title}</p>
                        <p className="text-ptic-textMuted dark:text-[#B3CFE5] text-[11px]">{q.author} · {q.timeAgo}</p>
                      </div>
                      <ArrowRight size={14} className="text-ptic-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
