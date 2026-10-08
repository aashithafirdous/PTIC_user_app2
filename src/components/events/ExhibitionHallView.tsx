import React, { useState } from 'react';
import { MOCK_EXHIBITION_HALLS } from '../../data/exhibitionHallsData';
import { ExhibitionHall, ExhibitionStall } from '../../types';
import { 
  Building, 
  MapPin, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  Compass, 
  Info
} from 'lucide-react';
import { pushNav, slugify } from '../../lib/router';
import { useToast } from '../ui/Toast';

export interface ExhibitionHallViewProps {
  onBackToEvent: () => void;
  eventTitle?: string;
}

export const ExhibitionHallView: React.FC<ExhibitionHallViewProps> = ({ 
  onBackToEvent,
  eventTitle = 'Poultry Technology & Innovation Summit 2026'
}) => {
  const { showToast } = useToast();
  const [selectedHall, setSelectedHall] = useState<ExhibitionHall | null>(null);
  const [selectedStall, setSelectedStall] = useState<ExhibitionStall | null>(null);

  // When a hall is selected, default to first occupied stall
  const handleSelectHall = (hall: ExhibitionHall) => {
    setSelectedHall(hall);
    const firstOccupied = hall.stalls.find(s => s.status === 'occupied') || hall.stalls[0];
    setSelectedStall(firstOccupied || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStall = (stall: ExhibitionStall) => {
    setSelectedStall(stall);
  };

  const handleSendEnquiry = (stall: ExhibitionStall) => {
    if (stall.status === 'available') {
      showToast('Stall Reservation Enquiry', `Enquiry for booking ${stall.stallNumber} submitted to council secretariat.`, 'info');
      pushNav(`/inbox?member=u1`);
      return;
    }

    showToast('Connecting to Exhibitor', `Opening direct enquiry channel with ${stall.companyName}...`, 'info');
    // Open inbox with this company / stall
    const compId = stall.companyId || slugify(stall.companyName);
    pushNav(`/inbox?company=${compId}&stall=${stall.stallNumber}`);
  };

  const handleViewCompany = (stall: ExhibitionStall) => {
    if (stall.companyId) {
      pushNav(`/directory`);
    } else {
      pushNav(`/directory`);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. HALL LISTING VIEW
  // ---------------------------------------------------------------------------
  if (!selectedHall) {
    return (
      <div className="w-full space-y-6 text-left animate-fadeIn">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#294966]">
          <button
            type="button"
            onClick={onBackToEvent}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Event Details</span>
          </button>
          <span className="text-xs text-slate-400 font-medium">
            Exhibition Halls & Expo Pavilions
          </span>
        </div>

        {/* Hall Listing Header */}
        <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-6 shadow-xs space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#4A7FA7]/20 dark:text-[#B3CFE5] border border-[#135E69]/20">
              {eventTitle}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD]">
              4 Thematic Pavilions · 64 Total Stalls
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display">
            Exhibition Halls & Stalls Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#B3CFE5] max-w-3xl leading-relaxed">
            Select a pavilion hall below to explore interactive stall layouts, live technology demonstrations, feed nutrition booths, and connect directly with verified enterprise exhibitors.
          </p>
        </div>

        {/* Hall Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {MOCK_EXHIBITION_HALLS.map((hall) => (
            <div
              key={hall.id}
              className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs hover:shadow-subtle hover:border-[#135E69]/40 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Hall Image */}
              <div className="relative w-full aspect-[2.2/1] overflow-hidden bg-slate-900">
                <img
                  src={hall.imageUrl}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-[#135E69] text-white text-xs font-extrabold shadow-sm">
                    {hall.hallNumber}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    {hall.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold leading-tight font-display drop-shadow-sm">
                    {hall.name}
                  </h3>
                </div>
              </div>

              {/* Hall Information */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-left">
                <p className="text-xs text-slate-600 dark:text-[#B3CFE5] leading-relaxed">
                  {hall.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#B3CFE5]">
                    <Building size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
                    <span>{hall.stallsCount} Exhibition Stalls</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectHall(hall)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-[#135E69] hover:bg-[#0e4850] transition-all shadow-2xs cursor-pointer group-hover:scale-102"
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. HALL DETAILS VIEW (Interactive Stalls on Left | Stall Information on Right)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full space-y-5 text-left animate-fadeIn">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#294966]">
        <button
          type="button"
          onClick={() => setSelectedHall(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Hall Listing</span>
        </button>
        <span className="text-xs font-bold text-[#135E69] dark:text-[#5ce0d2]">
          {selectedHall.hallNumber} · {selectedHall.name}
        </span>
      </div>


      {/* Main 2-Column Exhibition Hall Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN (approx 60-65%): Interactive Exhibition / Stall Layout  */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-[#F6FAFD]">
                Exhibition Stalls Floor Map
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5]">
                Click any stall below to inspect exhibitor credentials, showcased products, and send enquiries
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              16 Exhibition Units
            </span>
          </div>

          {/* Blueprint Stall Layout Structure (North Aisle + South Aisle with Walkway) */}
          <div className="bg-slate-50 dark:bg-[#102640]/60 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[#294966] space-y-5">
            
            {/* North Row: Stall 01 to Stall 08 */}
            <div>
              <div className="flex items-center justify-between pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Row A · North Pavilion Stalls</span>
                <span>Power & High-Speed Optical Fiber Ready</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedHall.stalls.slice(0, 8).map((stall) => {
                  const isSelected = selectedStall?.id === stall.id;
                  const isOccupied = stall.status === 'occupied';
                  const isReserved = stall.status === 'reserved';

                  return (
                    <button
                      key={stall.id}
                      type="button"
                      onClick={() => handleSelectStall(stall)}
                      className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                        isSelected
                          ? 'border-[#135E69] ring-2 ring-[#135E69] bg-[#135E69]/10 shadow-sm scale-[1.02]'
                          : isOccupied
                          ? 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-[#153451] hover:border-emerald-400'
                          : isReserved
                          ? 'border-sky-200 dark:border-sky-900/50 bg-white dark:bg-[#153451] hover:border-sky-400'
                          : 'border-slate-200 dark:border-[#294966] bg-slate-100/60 dark:bg-[#153451]/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-[#F6FAFD] font-mono">
                          {stall.stallNumber}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          isOccupied ? 'bg-emerald-500' : isReserved ? 'bg-sky-500' : 'bg-slate-400'
                        }`} />
                      </div>

                      <div className="mt-2 min-w-0">
                        <p className={`text-[11px] font-bold truncate leading-tight ${
                          isSelected ? 'text-[#135E69] dark:text-[#5ce0d2]' : 'text-slate-800 dark:text-[#F6FAFD]'
                        }`}>
                          {stall.companyName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-[#B3CFE5] truncate mt-0.5">
                          {stall.status === 'available' ? 'Available' : stall.industry}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Central Walkway / Walkthrough Aisle */}
            <div className="py-2.5 px-4 rounded-xl bg-slate-200/70 dark:bg-[#153451]/80 border border-slate-300/60 dark:border-[#294966] flex items-center justify-between text-xs text-slate-600 dark:text-[#B3CFE5] font-semibold select-none">
              <span className="flex items-center gap-2">
                <Compass size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
                <span>CENTRAL VISITOR WALKTHROUGH AISLE (WIDTH: 15 FT)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">↔ MAIN EXIT TO FOYER</span>
            </div>

            {/* South Row: Stall 09 to Stall 16 */}
            <div>
              <div className="flex items-center justify-between pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Row B · South Pavilion Stalls</span>
                <span>Direct Access to Demonstration Bays</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedHall.stalls.slice(8, 16).map((stall) => {
                  const isSelected = selectedStall?.id === stall.id;
                  const isOccupied = stall.status === 'occupied';
                  const isReserved = stall.status === 'reserved';

                  return (
                    <button
                      key={stall.id}
                      type="button"
                      onClick={() => handleSelectStall(stall)}
                      className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                        isSelected
                          ? 'border-[#135E69] ring-2 ring-[#135E69] bg-[#135E69]/10 shadow-sm scale-[1.02]'
                          : isOccupied
                          ? 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-[#153451] hover:border-emerald-400'
                          : isReserved
                          ? 'border-sky-200 dark:border-sky-900/50 bg-white dark:bg-[#153451] hover:border-sky-400'
                          : 'border-slate-200 dark:border-[#294966] bg-slate-100/60 dark:bg-[#153451]/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-[#F6FAFD] font-mono">
                          {stall.stallNumber}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          isOccupied ? 'bg-emerald-500' : isReserved ? 'bg-sky-500' : 'bg-slate-400'
                        }`} />
                      </div>

                      <div className="mt-2 min-w-0">
                        <p className={`text-[11px] font-bold truncate leading-tight ${
                          isSelected ? 'text-[#135E69] dark:text-[#5ce0d2]' : 'text-slate-800 dark:text-[#F6FAFD]'
                        }`}>
                          {stall.companyName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-[#B3CFE5] truncate mt-0.5">
                          {stall.status === 'available' ? 'Available' : stall.industry}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN (approx 35-40%): Selected Stall Information Panel      */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-[76px] space-y-4">
          {selectedStall ? (
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 sm:p-6 shadow-xs space-y-5 text-left">
              
              {/* Stall Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#135E69] text-white font-mono shadow-2xs">
                    {selectedStall.stallNumber}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedStall.status === 'occupied' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : selectedStall.status === 'reserved'
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}>
                    {selectedStall.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  {selectedHall.hallNumber}
                </span>
              </div>

              {/* Company Logo & Identity */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#135E69] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ring-1 ring-slate-200 dark:ring-[#294966]">
                  {selectedStall.companyInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-[#F6FAFD] text-base leading-snug">
                    {selectedStall.companyName}
                  </h3>
                  <p className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] mt-0.5">
                    {selectedStall.industry}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-[#B3CFE5] mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="shrink-0 text-rose-500" />
                    <span>{selectedStall.location}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]/70">
                  Exhibitor Overview
                </span>
                <p className="text-xs text-slate-600 dark:text-[#B3CFE5] leading-relaxed">
                  {selectedStall.description}
                </p>
              </div>

              {/* Showcased Products / Services */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-[#294966]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#B3CFE5]/70">
                  Products Showcased at Booth
                </span>
                <div className="space-y-1.5">
                  {selectedStall.products.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-xs font-medium text-slate-800 dark:text-[#F6FAFD]">
                      <CheckCircle2 size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: View Company & Send Enquiry */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#294966] space-y-2">
                <button
                  type="button"
                  onClick={() => handleSendEnquiry(selectedStall)}
                  className="w-full py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#135E69] hover:bg-[#0e4850] transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Enquiry</span>
                </button>

                {selectedStall.status !== 'available' && (
                  <button
                    type="button"
                    onClick={() => handleViewCompany(selectedStall)}
                    className="w-full py-2 rounded-full font-semibold text-xs text-slate-700 dark:text-[#F6FAFD] bg-slate-100 dark:bg-[#102640] hover:bg-slate-200 dark:hover:bg-[#1A3D63] transition-colors border border-slate-200 dark:border-[#294966] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Company</span>
                    <ExternalLink size={13} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-8 text-center text-slate-400">
              <Info size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold">Select a stall on the layout</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Click any numbered stall to inspect company credentials.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
