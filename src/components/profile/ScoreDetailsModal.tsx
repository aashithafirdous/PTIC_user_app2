import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { ProfileScoreResult } from '../../data/profileData';

export interface ScoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  scoreResult: ProfileScoreResult;
  onEditCategory: (categoryName: string) => void;
}

export const ScoreDetailsModal: React.FC<ScoreDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = 'Understand your completion standing and verified council privileges',
  scoreResult,
  onEditCategory,
}) => {
  const { totalScore, status, categories } = scoreResult;

  // Status colors
  const statusColor = 
    totalScore >= 90 ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' :
    totalScore >= 70 ? 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' :
    'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={subtitle}
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-[#88B0D3] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#0f8f8c]" />
            <span>Scores update automatically upon saving entries</span>
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* Score Top Banner with Circular Gauge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#14253d] via-[#1b3658] to-[#0f8f8c] text-white flex items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              CURRENT PROFILE SCORE
            </span>
            <h4 className="text-2xl font-black tracking-tight text-white mt-0.5">
              {totalScore}% Strength
            </h4>
            <p className="text-xs text-slate-200 mt-1 max-w-xs leading-relaxed">
              {totalScore >= 90
                ? 'Your profile is comprehensive and verified for maximum network exposure across Tamil Nadu poultry clusters.'
                : 'Complete the remaining items below to achieve 100% verified council identity status.'}
            </p>
          </div>

          {/* Circular Indicator */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-700 ease-out"
                strokeDasharray={`${totalScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">
              {totalScore}%
            </span>
          </div>
        </div>

        {/* Completion Status Pill */}
        <div className={`p-2.5 px-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${statusColor}`}>
          <div className="flex items-center gap-2">
            <Award size={15} />
            <span>Profile Ranking: {status}</span>
          </div>
          <span>{categories.filter(c => c.isComplete).length} of {categories.length} Sections Completed</span>
        </div>

        {/* Categories Breakdown List */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#88B0D3]">
            Category Breakdown & Requirements
          </p>

          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between gap-3 hover:border-[#0f8f8c]/40 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {cat.isComplete ? (
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle size={16} className="text-amber-500 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-[#88B0D3]">
                        ({cat.score} / {cat.weight} pts)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#88B0D3] mt-0.5 leading-snug">
                      {cat.details}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onEditCategory(cat.name);
                  }}
                  className="shrink-0 text-xs py-1 px-2.5"
                  rightIcon={<ArrowRight size={12} />}
                >
                  {cat.isComplete ? 'Edit' : 'Complete'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
