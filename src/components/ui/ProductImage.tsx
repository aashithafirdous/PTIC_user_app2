import React, { useState, useEffect } from 'react';
import { ShoppingBag, Cpu, Wrench, ShieldCheck, Layers, Package } from 'lucide-react';

export interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  tag?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-[16/9]'
  badgeElement?: React.ReactNode;
  tagElement?: React.ReactNode;
}

// Category fallback icon mapping
const getCategoryIcon = (category?: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('tech') || cat.includes('hardware') || cat.includes('iot')) {
    return <Cpu size={28} className="text-[#135E69]/70" />;
  }
  if (cat.includes('equipment') || cat.includes('fogger') || cat.includes('shed')) {
    return <Wrench size={28} className="text-[#135E69]/70" />;
  }
  if (cat.includes('nutrition') || cat.includes('feed') || cat.includes('probiotic')) {
    return <ShieldCheck size={28} className="text-[#135E69]/70" />;
  }
  if (cat.includes('automation')) {
    return <Layers size={28} className="text-[#135E69]/70" />;
  }
  return <Package size={28} className="text-[#135E69]/70" />;
};

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-[16/9]',
  badgeElement,
  tagElement,
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setLoadState('loading');
    } else {
      setLoadState('error');
    }
  }, [src]);

  const handleError = () => {
    setLoadState('error');
  };

  const handleLoad = () => {
    setLoadState('loaded');
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} bg-slate-100 overflow-hidden border-b border-ptic-border select-none ${containerClassName}`}
    >
      {/* 1. Subtle light loading skeleton/placeholder */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse">
          <div className="flex flex-col items-center gap-1.5 opacity-40">
            <ShoppingBag size={24} className="text-slate-400" />
            <div className="h-2 w-16 bg-slate-200 rounded-full" />
          </div>
        </div>
      )}

      {/* 2. Error Fallback: Clean PTIC placeholder without broken icons or exposed alt text */}
      {loadState === 'error' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-[#f4f7f8] to-[#e6ecee] p-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex items-center justify-center mb-2 text-[#135E69]">
            {getCategoryIcon(category)}
          </div>
          <span className="text-[11px] font-semibold text-slate-600 line-clamp-1">
            {category || 'PTIC Verified Equipment'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            Official Council Catalog
          </span>
        </div>
      ) : (
        /* 3. Real Product Image: Strict 100% width/height, object-fit: cover, object-position: center */
        <img
          src={currentSrc}
          alt="" /* Left blank intentionally when loading to prevent raw alt text flash if network delays */
          aria-label={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            loadState === 'loading' ? 'opacity-0' : 'opacity-100'
          } ${className}`}
        />
      )}

      {/* Optional Overlay Badges (Category & Tag) */}
      {badgeElement && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          {badgeElement}
        </div>
      )}
      {tagElement && (
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          {tagElement}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
