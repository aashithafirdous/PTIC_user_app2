import React, { useState } from 'react';
import { PageHeader, SectionHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Input, SearchInput } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { 
  Bell, 
  Search, 
  ArrowRight, 
  Plus, 
  Copy, 
  Sparkles,
  Info
} from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const { showToast } = useToast();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [testSearch, setTestSearch] = useState('');
  const [showSkeletonDemo, setShowSkeletonDemo] = useState(false);

  const colors = [
    { name: 'PRIMARY DARK', hex: '#0A1931', role: 'Headings, Navigation text, Active states, Strong elements', textLight: true, ratio: '5–10%' },
    { name: 'PRIMARY BLUE', hex: '#1A3D63', role: 'Primary buttons, Key actions, Brand logo', textLight: true, ratio: 'Primary action' },
    { name: 'SECONDARY BLUE', hex: '#4A7FA7', role: 'Icons, Accent links, Secondary actions, Focus rings', textLight: true, ratio: '15–20%' },
    { name: 'SOFT BLUE', hex: '#B3CFE5', role: 'Active nav background, Soft highlights, Light borders', textLight: false, ratio: '15–20%' },
    { name: 'MAIN BACKGROUND', hex: '#F6FAFD', role: 'Overall page background, Airy canvas (70-80%)', textLight: false, ratio: '70–80%' },
    { name: 'WHITE', hex: '#FFFFFF', role: 'Cards, Modals, Inputs, Navigation surfaces', textLight: false, ratio: 'Dominant surface' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto text-left">
      <PageHeader
        title="PTIC Design System & Tokens"
        subtitle="Phase 1 production design tokens, reusable components, and accessibility guidelines"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Design System verified', 'All components comply with PTIC Phase 1 specs.', 'success')}
            leftIcon={<Sparkles size={14} />}
          >
            Verify System
          </Button>
        }
      />

      {/* 1. Official Color Palette */}
      <section className="space-y-4">
        <SectionHeader title="1. Official PTIC Color Palette & Balance" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c) => (
            <Card key={c.name} padding="sm" className="space-y-2">
              <div
                className="h-16 rounded-[10px] border border-ptic-border flex items-center justify-between px-4 transition-transform hover:scale-[1.01]"
                style={{ backgroundColor: c.hex }}
              >
                <span className={`font-mono text-xs font-semibold ${c.textLight ? 'text-white' : 'text-ptic-dark'}`}>
                  {c.hex}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${c.textLight ? 'bg-white/20 text-white' : 'bg-ptic-dark/10 text-ptic-dark'}`}>
                  {c.ratio}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-ptic-dark">{c.name}</p>
                <p className="text-[11px] text-ptic-textMuted mt-0.5">{c.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Typography (Poppins) */}
      <section className="space-y-4">
        <SectionHeader title="2. Typography — Google Font 'Poppins'" />
        <Card className="space-y-4">
          <div className="pb-3 border-b border-ptic-border">
            <span className="text-[10px] font-semibold text-ptic-secondary uppercase tracking-wider">H1 — Page Heading</span>
            <h1 className="text-2xl font-bold text-ptic-dark">
              Poultry Technology & Innovation Council
            </h1>
          </div>
          <div className="pb-3 border-b border-ptic-border">
            <span className="text-[10px] font-semibold text-ptic-secondary uppercase tracking-wider">H2 — Section Heading</span>
            <h2 className="text-lg font-semibold text-ptic-dark">
              Connecting 500+ Poultry Stakeholders Across Tamil Nadu
            </h2>
          </div>
          <div className="pb-3 border-b border-ptic-border">
            <span className="text-[10px] font-semibold text-ptic-secondary uppercase tracking-wider">Body Text — Regular</span>
            <p className="text-sm text-ptic-dark/80 max-w-2xl leading-relaxed">
              Phase 1 creates a light, calm, trustworthy, and modern web application shell. The UI uses spacious layouts, clean cards, subtle shadows, and deep navy headings without visual clutter.
            </p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-ptic-secondary uppercase tracking-wider">Caption / Microcopy</span>
            <p className="text-xs text-ptic-textMuted">
              Last updated: 23 September 2026 · Verified by PTIC Advisory Secretariat
            </p>
          </div>
        </Card>
      </section>

      {/* 3. Buttons & Interactive Controls */}
      <section className="space-y-4">
        <SectionHeader title="3. Reusable Buttons" />
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md">
              Primary Button (#1A3D63)
            </Button>
            <Button variant="secondary" size="md">
              Secondary Button
            </Button>
            <Button variant="ghost" size="md">
              Ghost Button
            </Button>
            <Button variant="soft" size="md">
              Soft Button (#B3CFE5)
            </Button>
          </div>

          <div className="pt-3 border-t border-ptic-border flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Small Primary
            </Button>
            <Button variant="secondary" size="md" rightIcon={<ArrowRight size={14} />}>
              Medium with Icon
            </Button>
            <Button variant="primary" size="lg">
              Large CTA Button
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled State
            </Button>
          </div>

          {/* Icon buttons */}
          <div className="pt-3 border-t border-ptic-border flex items-center gap-3">
            <span className="text-xs font-semibold text-ptic-dark mr-2">IconButton:</span>
            <IconButton icon={<Bell size={18} />} aria-label="Notifications" hasBadge />
            <IconButton icon={<Search size={18} />} aria-label="Search" variant="secondary" />
            <IconButton icon={<Info size={18} />} aria-label="Info" />
            <IconButton icon={<Copy size={18} />} aria-label="Copy" variant="primary" />
          </div>
        </Card>
      </section>

      {/* 4. Form Inputs & Search Component */}
      <section className="space-y-4">
        <SectionHeader title="4. Form Inputs & Search Component" />
        <Card className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Standard Text Input"
              placeholder="e.g. Dr. Arun Kumar"
              hint="White background with subtle #B3CFE5 border"
            />
            <Input
              label="Input with Icon"
              placeholder="Search council member..."
              leftIcon={<Search size={16} />}
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-ptic-dark block mb-1.5">
              Reusable SearchInput Component:
            </span>
            <SearchInput
              value={testSearch}
              onChange={setTestSearch}
              placeholder="[ 🔍 Search people, products, questions... ]"
            />
          </div>
        </Card>
      </section>

      {/* 5. Avatars & Badges */}
      <section className="space-y-4">
        <SectionHeader title="5. Avatars & Status Badges" />
        <Card className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Avatar initials="KR" size="sm" statusIndicator="online" />
              <span className="text-xs text-ptic-textMuted">Small (32px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar initials="AK" size="md" statusIndicator="busy" />
              <span className="text-xs text-ptic-textMuted">Medium (40px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar initials="PS" size="lg" statusIndicator="offline" />
              <span className="text-xs text-ptic-textMuted">Large (48px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar initials="PT" size="xl" />
              <span className="text-xs text-ptic-textMuted">Extra Large (64px)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-ptic-border flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-ptic-dark mr-2">Badges:</span>
            <Badge variant="soft">Farmer</Badge>
            <Badge variant="secondary">Technology Provider</Badge>
            <Badge variant="outline">Veterinarian</Badge>
            <Badge variant="solid">Council Member</Badge>
          </div>
        </Card>
      </section>

      {/* 6. Modals, Toasts & Dialogs */}
      <section className="space-y-4">
        <SectionHeader title="6. Modals & Toast Notifications" />
        <Card className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setDemoModalOpen(true)}
          >
            Open Reusable Modal
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Saved successfully', 'Profile details updated.', 'success')}
          >
            Trigger Success Toast
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => showToast('Connection request sent', 'Stakeholder will review your invitation.', 'info')}
          >
            Trigger Info Toast
          </Button>
        </Card>

        {/* Demo Modal */}
        <Modal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
          title="Reusable Modal Component"
          description="Clean white surface, 16px radius, dark navy heading, soft backdrop overlay"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setDemoModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setDemoModalOpen(false);
                  showToast('Modal action confirmed', undefined, 'success');
                }}
              >
                Confirm Action
              </Button>
            </>
          }
        >
          <div className="p-3.5 rounded-[12px] bg-ptic-bg border border-ptic-border text-xs text-ptic-dark">
            This modal demonstrates the standard dialog container for ask-expert queries, stakeholder views, and settings.
          </div>
        </Modal>
      </section>

      {/* 7. Skeleton Loaders, Empty & Error States */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="7. Skeletons, Empty & Error States" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSkeletonDemo(!showSkeletonDemo)}
          >
            Toggle Skeleton
          </Button>
        </div>

        {showSkeletonDemo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmptyState
              title="No connections yet"
              description="Explore People to connect with poultry veterinarians and tech providers."
              actionLabel="Explore People"
              onAction={() => showToast('Navigating to People', undefined, 'info')}
            />
            <ErrorState
              title="Something went wrong"
              message="Could not load the requested council data stream."
              onRetry={() => showToast('Retried successfully', undefined, 'success')}
            />
          </div>
        )}
      </section>
    </div>
  );
};
