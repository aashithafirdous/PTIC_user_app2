import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Building, Send, CheckCircle2, ShieldCheck, Share2, Check, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { EMartItem } from '../types';
import { useToast } from '../components/ui/Toast';
import { useLanguage } from '../lib/LanguageContext';
import { slugify, pushNav, parseCurrentLocation, resolveEMartItemBySlugOrId } from '../lib/router';
import { useApp } from '../context/AppContext';

export const EMartView: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { products: items, recordEnquiry, openShare } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<EMartItem | null>(null);

  // Gallery active thumbnail state for product details modal
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Sync active product with URL (/e-mart/products/:slug or /e-mart/:slug)
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentLocation();
      if (parsed.productSlug) {
        const found = resolveEMartItemBySlugOrId(parsed.productSlug, items);
        if (found) {
          setActiveItem(found);
          setActiveGalleryIndex(0);
          return;
        }
      }
      if (parsed.route === 'emart' && !parsed.productSlug) {
        setActiveItem(null);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('ptic-navigate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('ptic-navigate', handleUrlChange);
    };
  }, [items]);

  const handleOpenProduct = (item: EMartItem) => {
    setActiveItem(item);
    setActiveGalleryIndex(0);
    pushNav(`/e-mart/products/${slugify(item.title)}`);
  };

  const handleCloseProduct = () => {
    setActiveItem(null);
    pushNav('/e-mart');
  };

  const handleShareProduct = (item: EMartItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/e-mart/products/${slugify(item.title)}`;
    openShare({
      title: item.title,
      text: `${item.title} by ${item.provider} - ${item.price || 'Inquire on PTIC E-Mart'}`,
      url: shareUrl,
    });
  };

  const handleSendEnquiry = (item: EMartItem) => {
    recordEnquiry(item);
    showToast('Enquiry Transmitted to Inbox', `Direct company channel with ${item.provider} initiated.`, 'success');
    const compId = item.provider.toLowerCase().includes('kongu') ? 'b2' : slugify(item.provider);
    pushNav(`/inbox?company=${compId}&product=${item.id}`);
  };

  const categories = [
    { id: 'All', label: t('catAll') },
    { id: 'Technology & Hardware', label: t('emartTechHardware') },
    { id: 'Shed Equipment', label: t('emartShedEquipment') },
    { id: 'Nutrition & Feed', label: t('emartNutritionFeed') },
    { id: 'Farm Automation', label: t('emartFarmAutomation') },
  ];

  const getCategoryCount = (catId: string) => {
    if (catId === 'All') return items.length;
    return items.filter((it) => it.category === catId).length;
  };

  // Multiple category selection handler
  const handleCategoryToggle = (catId: string) => {
    if (catId === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    let updated = selectedCategories.filter((c) => c !== 'All');
    if (updated.includes(catId)) {
      updated = updated.filter((c) => c !== catId);
    } else {
      updated = [...updated, catId];
    }

    if (updated.length === 0) {
      updated = ['All'];
    }

    setSelectedCategories(updated);
  };

  const filtered = items.filter((item) => {
    const matchesCategory =
      selectedCategories.includes('All') ||
      selectedCategories.includes(item.category);
    const matchesStock = !inStockOnly || item.inStock;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.keyDetails && item.keyDetails.some((kd: string) => kd.toLowerCase().includes(query)));

    return matchesCategory && matchesStock && matchesSearch;
  });

  // 4 Gallery images helper for active item
  const getProductGallery = (item: EMartItem): string[] => {
    if (item.galleryImages && item.galleryImages.length >= 4) {
      return item.galleryImages.slice(0, 4);
    }
    const baseImg = item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
    return [
      baseImg,
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    ];
  };

  // ========================================================
  // DEDICATED FULL-PAGE PRODUCT DETAILS VIEW (NOT A POPUP)
  // Left: Large gallery | Right: Details & Enquiry | Top: Close
  // ========================================================
  if (activeItem) {
    const gallery = getProductGallery(activeItem);
    const currentImg = gallery[activeGalleryIndex] || gallery[0];

    return (
      <div className="w-full max-w-full px-0 sm:px-1 pt-1 pb-10 text-left animate-fadeIn">
        {/* Navigation Breadcrumb & Top-Right Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-[#294966]">
          <button
            type="button"
            onClick={handleCloseProduct}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#B3CFE5] hover:text-[#135E69] dark:hover:text-[#4A7FA7] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to E-Mart Marketplace</span>
          </button>

          {/* Top-Right: Share + ONLY Close icon */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleShareProduct(activeItem, e)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-[#B3CFE5] bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] hover:bg-slate-50 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer shadow-2xs"
              title="Share Product"
            >
              <Share2 size={13} className="text-[#135E69] dark:text-[#5ce0d2]" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={handleCloseProduct}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#153451] border border-slate-200 dark:border-[#294966] hover:bg-slate-100 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer"
              title="Close Product View"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FULL PAGE PRODUCT LAYOUT: LEFT (Image / Gallery) | RIGHT (Name, Price, Details, About, Send Enquiry) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: Large Product Image + Gallery */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#294966] bg-slate-900 shadow-xs">
              <img
                src={currentImg}
                alt={activeItem.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3.5 left-3.5">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#135E69]/90 text-white backdrop-blur-xs shadow-xs">
                  {activeItem.category}
                </span>
              </div>
            </div>

            {/* 4 Interactive Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((imgUrl, idx) => {
                const isSelected = activeGalleryIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#135E69] border-[#135E69] shadow-sm scale-102'
                        : 'border-slate-200 dark:border-[#294966] opacity-70 hover:opacity-100'
                    }`}
                    title={`View image ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Assurance Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center gap-3 text-xs text-slate-600 dark:text-[#B3CFE5]">
              <ShieldCheck size={20} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-[#F6FAFD]">Council Verified Marketplace Supplier</p>
                <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5]/80">Commercial equipment tested for South Indian climate conditions.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Structured Product Information */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Provider and Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-[#135E69] dark:text-[#5ce0d2] font-bold uppercase tracking-wider">
                <Building size={14} className="shrink-0" />
                <span>{activeItem.provider}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display leading-tight">
                {activeItem.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#135E69]/[0.06] dark:bg-[#18A999]/[0.10] border border-[#135E69]/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-[#B3CFE5] uppercase font-bold tracking-wider block">
                  ESTIMATED COMMERCIAL PRICE
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#135E69] dark:text-[#5ce0d2] mt-0.5 block font-sans">
                  {activeItem.price || 'Direct Council Inquiry'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSendEnquiry(activeItem)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-[#135E69] hover:bg-[#0e4850] transition-all shadow-subtle hover:shadow active:scale-95 cursor-pointer"
              >
                <span>Send Enquiry</span>
                <Send size={15} />
              </button>
            </div>

            {/* Product Details Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                Product Details
              </h3>
              <div className="bg-slate-50 dark:bg-[#102640] rounded-xl border border-slate-200/90 dark:border-[#294966] p-4 text-xs">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-3 gap-x-2">
                  <span className="font-semibold text-slate-500 dark:text-[#B3CFE5]">Brand</span>
                  <span className="col-span-2 sm:col-span-3 font-bold text-slate-900 dark:text-[#F6FAFD]">
                    {activeItem.brand || activeItem.provider}
                  </span>

                  <span className="font-semibold text-slate-500 dark:text-[#B3CFE5]">Category</span>
                  <span className="col-span-2 sm:col-span-3 font-medium text-slate-800 dark:text-[#F6FAFD]">
                    {activeItem.category}
                  </span>

                  <span className="font-semibold text-slate-500 dark:text-[#B3CFE5]">Colour</span>
                  <span className="col-span-2 sm:col-span-3 font-medium text-slate-800 dark:text-[#F6FAFD]">
                    {activeItem.color || 'Industrial Standard'}
                  </span>

                  <span className="font-semibold text-slate-500 dark:text-[#B3CFE5]">Material</span>
                  <span className="col-span-2 sm:col-span-3 font-medium text-slate-800 dark:text-[#F6FAFD]">
                    {activeItem.material || 'Council Certified Heavy Grade'}
                  </span>

                  <span className="font-semibold text-slate-500 dark:text-[#B3CFE5]">Availability</span>
                  <span className="col-span-2 sm:col-span-3 font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {activeItem.availability || (activeItem.inStock ? 'In Stock (Ready to Dispatch)' : 'Pre-order')}
                  </span>
                </div>
              </div>
            </div>

            {/* About the Item */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                About the Item
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed list-disc list-inside bg-white dark:bg-[#153451] p-4 rounded-xl border border-slate-200/80 dark:border-[#294966]">
                {(activeItem.aboutItem && activeItem.aboutItem.length > 0) ? (
                  activeItem.aboutItem.map((point: string, idx: number) => (
                    <li key={idx} className="pl-1">
                      {point}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="pl-1">{activeItem.description}</li>
                    <li className="pl-1">Engineered and tested for commercial poultry shed climate conditions.</li>
                    <li className="pl-1">Covered under official PTIC member verified equipment warranty.</li>
                    <li className="pl-1">Direct support and telemetry installation provided by {activeItem.provider}.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Enquiry Notice */}
            <p className="text-[11px] text-slate-400 dark:text-[#B3CFE5]/70">
              * Clicking "Send Enquiry" initiates a direct company conversation in your Inbox with product specifications attached.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-0 sm:px-1 py-1 sm:py-2 font-sans animate-fadeIn text-left">
      {/* Mobile-Only Filter Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-4 text-left">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#153451] text-slate-700 dark:text-[#F6FAFD] hover:bg-slate-50 dark:hover:bg-[#1A3D63] border border-slate-200 dark:border-[#294966] transition-colors shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
          <span>Filters</span>
          {(!selectedCategories.includes('All') || inStockOnly) && (
            <span className="w-2 h-2 rounded-full bg-[#135E69] dark:bg-[#5ce0d2]" />
          )}
        </button>
        <span className="text-xs text-slate-500 dark:text-[#B3CFE5] font-medium">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Main Layout Structure: Left Filter Sidebar (~22-25%) | Product Grid (~75-78%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT FILTER SIDEBAR (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 text-left sticky top-20">
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-5 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#135E69] dark:text-[#5ce0d2]" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                  Filters
                </h3>
              </div>
              {(!selectedCategories.includes('All') || inStockOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories(['All']);
                    setInStockOnly(false);
                    setSearch('');
                  }}
                  className="text-[11px] font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-[#F6FAFD] block">
                Category
              </label>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  const count = getCategoryCount(cat.id);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-colors cursor-pointer text-left ${
                        isChecked
                          ? 'bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] font-semibold'
                          : 'text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-50 dark:hover:bg-[#1A3D63]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-[#135E69] dark:bg-[#18A999] border-[#135E69] dark:border-[#18A999] text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#102640]'
                          }`}
                        >
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-2">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#294966] space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-[#F6FAFD] block">
                Availability
              </label>
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs transition-colors cursor-pointer text-left ${
                  inStockOnly
                    ? 'bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] font-semibold'
                    : 'text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-50 dark:hover:bg-[#1A3D63]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                      inStockOnly
                        ? 'bg-[#135E69] dark:bg-[#18A999] border-[#135E69] dark:border-[#18A999] text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#102640]'
                    }`}
                  >
                    {inStockOnly && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span>In Stock Only</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Product Catalog Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Header count row */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#294966]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                Poultry Equipment & Supply Marketplace
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                Council-certified equipment, nutrition formulations, sensors, and shed automation.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2]">
              {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          {/* ======================================================== */}
          {/* PRODUCT CARDS (IMPROVED ALIGNMENT & PILL BUTTONS)        */}
          {/* ======================================================== */}
          {filtered.length === 0 ? (
            <EmptyState
              title={t('emartNoProducts')}
              description={t('emartNoProductsDesc')}
              actionLabel="View All Offerings"
              onAction={() => {
                setSelectedCategories(['All']);
                setInStockOnly(false);
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenProduct(item)}
                  className="group flex flex-col justify-between text-left h-full overflow-hidden border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] rounded-2xl hover:border-[#135E69]/50 hover:shadow-card transition-all cursor-pointer"
                >
                  {/* Top Portion: Image & Info */}
                  <div className="flex-1 flex flex-col">
                    {/* PRODUCT IMAGE (Fixed aspect-ratio, clean container) */}
                    <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#135E69]/90 text-white backdrop-blur-xs shadow-xs">
                          {item.category}
                        </span>
                      </div>
                      {item.inStock && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs flex items-center gap-1">
                            <ShieldCheck size={11} /> In Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        {/* Supplier / Provider */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#B3CFE5]">
                          <Building size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0" />
                          <span className="font-medium truncate">{item.provider}</span>
                        </div>

                        {/* Product Title */}
                        <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-[#F6FAFD] group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] transition-colors line-clamp-1 leading-snug">
                          {item.title}
                        </h3>

                        {/* Short Description */}
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-[#B3CFE5] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Feature Chips */}
                      {item.keyDetails && item.keyDetails.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.keyDetails.slice(0, 2).map((kd: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] font-medium"
                            >
                              ✓ {kd}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* BOTTOM ACTIONS SECTION (STRICT ALIGNMENT & PILL BUTTONS) */}
                  {/* ======================================================== */}
                  <div className="p-4 sm:px-5 sm:py-3.5 border-t border-slate-100 dark:border-[#294966] bg-slate-50/60 dark:bg-[#102640]/50 flex items-center justify-between gap-3 shrink-0">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 dark:text-[#B3CFE5] uppercase font-bold block leading-none tracking-wider">
                        PRICE
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#135E69] dark:text-[#5ce0d2] mt-0.5 block truncate">
                        {item.price || 'Council Inquiry'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProduct(item);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendEnquiry(item);
                        }}
                      >
                        Enquire Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <Modal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filter E-Mart Products"
          description="Narrow offerings by category and live stock availability"
          footer={
            <div className="w-full flex justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategories(['All']);
                  setInStockOnly(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left py-2">
            <label className="text-xs font-bold text-slate-800 dark:text-[#F6FAFD] block">
              Categories
            </label>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isChecked = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-[#294966] text-xs"
                  >
                    <span>{cat.label}</span>
                    {isChecked && <Check size={14} className="text-[#135E69]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
