import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Upload, Trash2, RefreshCw, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  currentImage?: string;
  aspectRatio?: 'square' | 'cover' | 'product';
  onSave: (imageUrl: string) => void;
  sampleImages?: { label: string; url: string }[];
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  description = 'Upload from your device or select an optimized poultry asset',
  currentImage = '',
  aspectRatio = 'square',
  onSave,
  sampleImages = [],
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>(currentImage);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'samples'>('upload');

  useEffect(() => {
    setImageUrl(currentImage);
    setInputUrl(currentImage.startsWith('http') ? currentImage : '');
  }, [currentImage, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Unsupported Format', 'Please upload a JPG, PNG, or WebP image.', 'info');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image under 5MB.', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      showToast('Image Loaded', 'Preview generated. Click Save Changes to confirm.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setImageUrl(inputUrl.trim());
    showToast('Image Linked', 'Preview updated from URL.', 'info');
  };

  const handleRemove = () => {
    setImageUrl('');
    setInputUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Image Cleared', 'Default graphic will be displayed.', 'info');
  };

  const handleSave = () => {
    onSave(imageUrl);
    onClose();
  };

  const renderAspectContainer = () => {
    if (aspectRatio === 'cover') {
      return (
        <div className="w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] relative flex items-center justify-center shadow-inner group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Cover Preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#88B0D3] p-4 text-center">
              <ImageIcon size={32} className="mb-2 opacity-60" />
              <span className="text-xs font-medium">No cover image selected</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Fixed 16:6 landscape ratio</span>
            </div>
          )}
          {imageUrl && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
              Cover Preview
            </div>
          )}
        </div>
      );
    }

    if (aspectRatio === 'product') {
      return (
        <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] relative flex items-center justify-center shadow-inner group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Product Preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#88B0D3] p-4 text-center">
              <ImageIcon size={32} className="mb-2 opacity-60" />
              <span className="text-xs font-medium">No product photo selected</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Fixed 4:3 catalog ratio</span>
            </div>
          )}
          {imageUrl && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
              Catalog Preview
            </div>
          )}
        </div>
      );
    }

    // Default 'square' for avatar & business logo
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#102640] border-2 border-dashed border-slate-300 dark:border-[#294966] relative flex items-center justify-center shadow-md ring-4 ring-slate-100 dark:ring-[#1A3D63]/40 group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#88B0D3] text-center p-2">
              <ImageIcon size={28} className="mb-1 opacity-60" />
              <span className="text-[11px] font-medium">No Image</span>
              <span className="text-[9px] text-slate-400">1:1 Square</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {imageUrl ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              leftIcon={<Trash2 size={13} className="text-rose-500" />}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
            >
              Remove
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Check size={14} />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* Aspect Ratio Preview Surface */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-[#B3CFE5] block mb-1.5">
            Image Preview (Object-Fit Preserved)
          </label>
          {renderAspectContainer()}
        </div>

        {/* Tab Selector: Upload Local File vs Direct URL vs Presets */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-[#102640] p-1 border border-slate-200/80 dark:border-[#294966]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#1A3D63] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900'
            }`}
          >
            <Upload size={13} />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white dark:bg-[#1A3D63] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900'
            }`}
          >
            <LinkIcon size={13} />
            <span>Image URL</span>
          </button>
          {sampleImages.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-white dark:bg-[#1A3D63] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900'
              }`}
            >
              <ImageIcon size={13} />
              <span>Presets</span>
            </button>
          )}
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-[#294966] hover:border-[#0f8f8c] dark:hover:border-[#4A7FA7] rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-[#102640]/50"
            >
              <Upload size={24} className="mx-auto text-[#0f8f8c] dark:text-[#4A7FA7] mb-1.5" />
              <p className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
                Click to browse photo from computer
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#88B0D3] mt-0.5">
                Supports JPG, JPEG, PNG, WebP (Max 5MB)
              </p>
            </div>
            {imageUrl && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<RefreshCw size={12} />}
                >
                  Replace with Another File
                </Button>
              </div>
            )}
          </div>
        )}

        {/* URL Mode */}
        {activeTab === 'url' && (
          <form onSubmit={handleApplyUrl} className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#B3CFE5]">
                Direct Web Image Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c] focus:outline-none"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply URL
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#88B0D3]">
                Paste any high-resolution image hosted on the web or cloud CDN.
              </p>
            </div>
          </form>
        )}

        {/* Preset Samples Mode */}
        {activeTab === 'samples' && sampleImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-[#B3CFE5]">
              Choose from Council Verified Poultry Stock Assets:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(s.url);
                    showToast('Preset Selected', s.label, 'info');
                  }}
                  className={`rounded-xl border p-1 text-left transition-all cursor-pointer overflow-hidden ${
                    imageUrl === s.url
                      ? 'border-[#0f8f8c] ring-2 ring-[#0f8f8c]/20 bg-[#0f8f8c]/5'
                      : 'border-slate-200 dark:border-[#294966] hover:border-slate-300'
                  }`}
                >
                  <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-[#102640] mb-1">
                    <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-[#F6FAFD] truncate px-1">
                    {s.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
