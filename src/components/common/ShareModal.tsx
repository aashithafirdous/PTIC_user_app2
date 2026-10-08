import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Check, Copy, Mail } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!data) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = data.url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast('Link copied.', 'Direct link copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Link copied.', undefined, 'success');
    }
  };

  const shareText = encodeURIComponent(`${data.title}\n${data.text ? data.text + '\n' : ''}${data.url}`);
  const shareUrl = encodeURIComponent(data.url);
  const shareTitle = encodeURIComponent(data.title);

  const shareChannels = [
    {
      name: 'WhatsApp Web',
      icon: (
        <svg className="w-5 h-5 text-emerald-600 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.18-.535-1.745-.718-2.871-2.485-2.958-2.602-.088-.117-.706-.939-.706-1.792 0-.853.449-1.272.609-1.446.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25-.041.391.298.144.348.492 1.202.535 1.29.043.088.072.19.014.305-.058.117-.087.19-.174.29-.088.101-.185.226-.264.305-.088.087-.179.182-.077.357.101.174.45 0.742.966 1.202.664.59 1.224.773 1.398.86.174.088.275.073.377-.044.101-.117.435-.508.55-.682.117-.174.233-.145.392-.087.16.058 1.015.479 1.189.566.174.088.29.131.334.204.043.072.043.42-.101.825z" />
        </svg>
      ),
      href: `https://api.whatsapp.com/send?text=${shareText}`,
      bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300',
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      href: `mailto:?subject=${shareTitle}&body=${shareText}`,
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-800 dark:text-blue-300',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      bg: 'hover:bg-sky-50 dark:hover:bg-sky-950/30 text-sky-800 dark:text-sky-300',
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-5 h-5 text-slate-800 dark:text-slate-200 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
      bg: 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share"
      description="Share this link with stakeholders, associates, or on social channels."
      maxWidth="md"
    >
      <div className="space-y-5 text-left pt-1">
        {/* Item preview card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966]">
          <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-1">
            {data.title}
          </p>
          {data.text && (
            <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] line-clamp-2 mt-1">
              {data.text}
            </p>
          )}
          <span className="text-[10px] text-[#135E69] dark:text-[#5ce0d2] font-semibold truncate block mt-1.5 font-mono">
            {data.url}
          </span>
        </div>

        {/* Copy Link Direct Button */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-[#102640] rounded-full border border-slate-200 dark:border-[#294966]">
          <input
            type="text"
            readOnly
            value={data.url}
            className="w-full px-3 text-xs bg-transparent border-none text-slate-700 dark:text-[#F6FAFD] focus:outline-none font-mono truncate"
          />
          <Button
            variant={copied ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>

        {/* Direct Channels Grid */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-[#B3CFE5] uppercase tracking-wider block mb-2.5">
            Share directly to
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {shareChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                onClick={() => onClose()}
                className={`flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/90 dark:border-[#294966] transition-all cursor-pointer ${channel.bg}`}
              >
                {channel.icon}
                <span className="text-xs font-semibold">{channel.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
