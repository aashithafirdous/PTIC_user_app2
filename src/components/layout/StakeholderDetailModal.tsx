import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Stakeholder } from '../../types';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Check, 
  MessageSquare, 
  ShieldCheck,
  Award
} from 'lucide-react';

export interface StakeholderDetailModalProps {
  stakeholder: Stakeholder | null;
  onClose: () => void;
  onOpenMessage?: (stakeholder: Stakeholder) => void;
}

export const StakeholderDetailModal: React.FC<StakeholderDetailModalProps> = ({
  stakeholder,
  onClose,
  onOpenMessage,
}) => {
  if (!stakeholder) return null;

  return (
    <Modal
      isOpen={!!stakeholder}
      onClose={onClose}
      title={stakeholder.name}
      description={`${stakeholder.role} · ${stakeholder.organization}`}
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <Check size={14} className="text-emerald-600" />
            <span>Verified Council Stakeholder</span>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const stk = stakeholder;
                onClose();
                if (onOpenMessage) {
                  onOpenMessage(stk);
                }
              }}
              leftIcon={<MessageSquare size={14} />}
            >
              Message
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-left max-h-[70vh] overflow-y-auto pr-1">
        {/* Profile Card Header */}
        <div className="p-4 rounded-[14px] bg-gradient-to-r from-ptic-bg via-white to-ptic-soft/20 border border-ptic-border flex items-start gap-3.5">
          <Avatar initials={stakeholder.initials} size="xl" statusIndicator="online" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-ptic-dark truncate">
                {stakeholder.name}
              </h3>
              <Badge variant="soft" size="sm">
                {stakeholder.category}
              </Badge>
            </div>
            <p className="text-xs text-ptic-secondary font-medium mt-0.5">
              {stakeholder.role}
            </p>
            <div className="flex items-center gap-3 text-xs text-ptic-textMuted mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Building size={12} className="text-ptic-secondary" />
                {stakeholder.organization}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-ptic-secondary" />
                {stakeholder.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bio / About */}
        <div className="p-3.5 rounded-[12px] bg-white border border-ptic-border space-y-1">
          <p className="text-xs font-bold text-ptic-secondary uppercase tracking-wider">
            About Stakeholder
          </p>
          <p className="text-xs text-ptic-dark/90 leading-relaxed">
            {stakeholder.bio}
          </p>
        </div>

        {/* Specialties */}
        <div className="p-3.5 rounded-[12px] bg-white border border-ptic-border space-y-2">
          <p className="text-xs font-bold text-ptic-secondary uppercase tracking-wider">
            Poultry Specialties & Domains
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stakeholder.specialties.map((item, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Council Network Contacts */}
        <div className="p-3.5 rounded-[12px] bg-ptic-bg border border-ptic-border space-y-2 text-xs">
          <p className="font-bold text-ptic-dark flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            Verified Council Communication Channels
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ptic-dark pt-1">
            <div className="p-2 rounded-[8px] bg-white border border-ptic-border flex items-center justify-between">
              <span className="text-ptic-textMuted flex items-center gap-1">
                <Phone size={12} className="text-ptic-secondary" /> Direct Call
              </span>
              <span className="font-medium text-emerald-700">Available</span>
            </div>
            <div className="p-2 rounded-[8px] bg-white border border-ptic-border flex items-center justify-between">
              <span className="text-ptic-textMuted flex items-center gap-1">
                <Mail size={12} className="text-ptic-secondary" /> Council Email
              </span>
              <span className="font-medium text-emerald-700">Verified</span>
            </div>
          </div>
        </div>

        {/* Connections summary */}
        <div className="flex items-center justify-between text-xs text-ptic-textMuted pt-2 border-t border-ptic-border">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-ptic-secondary" />
            <span>{stakeholder.connectionsCount} council connections across Tamil Nadu</span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
            <Award size={12} /> Active Council Member
          </span>
        </div>
      </div>
    </Modal>
  );
};
