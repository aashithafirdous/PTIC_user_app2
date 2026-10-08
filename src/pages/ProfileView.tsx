import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { 
  INITIAL_PERSONAL_PROFILE, 
  INITIAL_BUSINESS_PROFILES,
  MOCK_CONNECTIONS_LIST,
  PersonalProfileData,
  FullBusinessProfileData,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ProductItem,
  BusinessLocationItem,
  TeamMemberItem,
  ConnectedMember,
  calculatePersonalProfileScore,
  calculateBusinessProfileScore
} from '../data/profileData';
import {
  MapPin,
  Building,
  Users,
  Plus,
  Briefcase,
  User,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Camera,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  Trash2,
  Clock,
  Activity,
  Check,
  ShoppingBag,
  Share2,
  Star,
  ArrowRight,
  Calendar,
  Globe,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useApp } from '../context/AppContext';
import { NavRoute } from '../types';
import { pushNav, slugify } from '../lib/router';

// Modular Modals
import { ImageUploadModal } from '../components/profile/ImageUploadModal';
import { ScoreDetailsModal } from '../components/profile/ScoreDetailsModal';
import { 
  EditOverviewModal, 
  EditPersonalInfoModal, 
  EditProfessionalInfoModal, 
  AddEditExperienceModal, 
  AddEditEducationModal, 
  AddEditCertificationModal, 
  EditParticipationModal, 
  VerificationModal 
} from '../components/profile/PersonalModals';
import { 
  EditBusinessHeaderModal, 
  EditBusinessAboutModal, 
  AddEditProductModal, 
  AddEditLocationModal, 
  AddEditTeamMemberModal, 
  AddEditBusinessCertModal 
} from '../components/profile/BusinessModals';

export interface ProfileViewProps {
  onNavigate?: (route: NavRoute) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export type PersonalNavTab =
  | 'professional' 
  | 'experience' 
  | 'education' 
  | 'expertise' 
  | 'participation' 
  | 'connections';

export type BusinessNavTab = 
  | 'overview' 
  | 'products' 
  | 'details' 
  | 'team' 
  | 'certifications' 
  | 'achievements' 
  | 'locations' 
  | 'participation';

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, isModal = false, onClose }) => {
  const { showToast } = useToast();
  const { syncBusinessProducts, openShare } = useApp();

  // Top-level View Mode: Personal vs Business
  const [profileType, setProfileType] = useState<'personal' | 'business'>('personal');

  // Sub-Navigation Tabs
  const [personalTab, setPersonalTab] = useState<PersonalNavTab>('professional');
  const [businessTab, setBusinessTab] = useState<BusinessNavTab>('overview');

  // Master Profile State
  const [personalProfile, setPersonalProfile] = useState<PersonalProfileData>(INITIAL_PERSONAL_PROFILE);
  const [businessProfiles, setBusinessProfiles] = useState<FullBusinessProfileData[]>(INITIAL_BUSINESS_PROFILES);
  const [activeBusinessId, setActiveBusinessId] = useState<string>(INITIAL_BUSINESS_PROFILES[0].id);
  const [connections, setConnections] = useState<ConnectedMember[]>(MOCK_CONNECTIONS_LIST);
  const [connectionsSearch, setConnectionsSearch] = useState('');

  // Active Business Reference
  const activeBusiness = useMemo(() => {
    return businessProfiles.find((b) => b.id === activeBusinessId) || businessProfiles[0];
  }, [businessProfiles, activeBusinessId]);

  // Initial and reactive sync of active business products to E-Mart
  useEffect(() => {
    if (activeBusiness && activeBusiness.products) {
      syncBusinessProducts(activeBusiness.products);
    }
  }, [activeBusiness, syncBusinessProducts]);

  // Scores Calculated Dynamically
  const personalScoreResult = useMemo(() => {
    return calculatePersonalProfileScore(personalProfile);
  }, [personalProfile]);

  const businessScoreResult = useMemo(() => {
    return calculateBusinessProfileScore(activeBusiness);
  }, [activeBusiness]);

  // ============================================================
  // MODAL CONTROLS STATE
  // ============================================================
  const [imageModalConfig, setImageModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    aspectRatio: 'square' | 'cover' | 'product';
    currentImage: string;
    onSave: (url: string) => void;
    samples?: { label: string; url: string }[];
  }>({
    isOpen: false,
    title: '',
    aspectRatio: 'square',
    currentImage: '',
    onSave: () => {},
  });

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isBizScoreModalOpen, setIsBizScoreModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isProfInfoModalOpen, setIsProfInfoModalOpen] = useState(false);
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Experience Modal
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  // Education Modal
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  // Certification Modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);

  // Business Modals
  const [isBizHeaderModalOpen, setIsBizHeaderModalOpen] = useState(false);
  const [isBizAboutModalOpen, setIsBizAboutModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<BusinessLocationItem | null>(null);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMemberItem | null>(null);
  const [isBizCertModalOpen, setIsBizCertModalOpen] = useState(false);
  const [editingBizCert, setEditingBizCert] = useState<CertificationItem | null>(null);

  // ============================================================
  // HANDLERS FOR PERSONAL PROFILE
  // ============================================================
  const handleUpdatePersonalProfile = (updates: Partial<PersonalProfileData>) => {
    setPersonalProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleOpenPhotoUpload = () => {
    setImageModalConfig({
      isOpen: true,
      title: 'Change Profile Photo',
      aspectRatio: 'square',
      currentImage: personalProfile.avatarUrl,
      samples: [
        { label: 'Farmer Portrait 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        { label: 'Farmer Portrait 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
        { label: 'Professional Pose', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      ],
      onSave: (newUrl) => {
        handleUpdatePersonalProfile({ avatarUrl: newUrl });
        showToast('Profile Photo Updated', 'Your circular profile portrait has been updated.', 'success');
      }
    });
  };

  const handleOpenCoverUpload = () => {
    setImageModalConfig({
      isOpen: true,
      title: 'Change Profile Cover Banner',
      aspectRatio: 'cover',
      currentImage: personalProfile.coverUrl,
      samples: [
        { label: 'Broiler Shed Interior', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80' },
        { label: 'Green Agricultural Farm', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80' },
        { label: 'Namakkal Countryside', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      ],
      onSave: (newUrl) => {
        handleUpdatePersonalProfile({ coverUrl: newUrl });
        showToast('Cover Banner Updated', 'Profile cover image updated with fixed aspect ratio.', 'success');
      }
    });
  };

  const handleSaveExperience = (item: ExperienceItem) => {
    setPersonalProfile((prev) => {
      const exists = prev.experiences.some((e) => e.id === item.id);
      const updated = exists
        ? prev.experiences.map((e) => (e.id === item.id ? item : e))
        : [item, ...prev.experiences];
      return { ...prev, experiences: updated };
    });
    showToast('Experience Saved', 'Career timeline updated successfully.', 'success');
  };

  const handleDeleteExperience = (id: string) => {
    setPersonalProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
    showToast('Experience Removed', 'Milestone removed from profile.', 'info');
  };

  const handleSaveEducation = (item: EducationItem) => {
    setPersonalProfile((prev) => {
      const exists = prev.educations.some((e) => e.id === item.id);
      const updated = exists
        ? prev.educations.map((e) => (e.id === item.id ? item : e))
        : [...prev.educations, item];
      return { ...prev, educations: updated };
    });
    showToast('Education Saved', 'Academic qualification recorded.', 'success');
  };

  const handleDeleteEducation = (id: string) => {
    setPersonalProfile((prev) => ({
      ...prev,
      educations: prev.educations.filter((e) => e.id !== id),
    }));
    showToast('Education Removed', 'Qualification removed.', 'info');
  };

  const handleSaveCertification = (item: CertificationItem) => {
    setPersonalProfile((prev) => {
      const exists = prev.certifications.some((c) => c.id === item.id);
      const updated = exists
        ? prev.certifications.map((c) => (c.id === item.id ? item : c))
        : [...prev.certifications, item];
      return { ...prev, certifications: updated };
    });
    showToast('Certification Recorded', 'Accreditation saved to profile.', 'success');
  };

  const handleDeleteCertification = (id: string) => {
    setPersonalProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
    showToast('Certification Removed', 'Accreditation removed.', 'info');
  };

  const handleRemoveConnection = (member: ConnectedMember) => {
    setConnections((prev) => prev.filter((c) => c.id !== member.id));
    setPersonalProfile((prev) => ({
      ...prev,
      participationStats: {
        ...prev.participationStats,
        connectionsCount: Math.max(0, prev.participationStats.connectionsCount - 1),
      }
    }));
    showToast('Connection Removed', `Removed ${member.name} from your council network.`, 'info');
  };

  // ============================================================
  // HANDLERS FOR BUSINESS PROFILE
  // ============================================================
  const handleUpdateActiveBusiness = (updates: Partial<FullBusinessProfileData>) => {
    setBusinessProfiles((prev) =>
      prev.map((b) => (b.id === activeBusiness.id ? { ...b, ...updates } : b))
    );
  };

  const handleOpenBizLogoUpload = () => {
    setImageModalConfig({
      isOpen: true,
      title: 'Change Business Logo',
      aspectRatio: 'square',
      currentImage: activeBusiness.logoUrl,
      samples: [
        { label: 'Farm Emblem 1', url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=200&q=80' },
        { label: 'Tech Emblem 2', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80' },
      ],
      onSave: (newUrl) => {
        handleUpdateActiveBusiness({ logoUrl: newUrl });
        showToast('Business Logo Updated', activeBusiness.name, 'success');
      }
    });
  };

  const handleOpenBizCoverUpload = () => {
    setImageModalConfig({
      isOpen: true,
      title: 'Change Business Banner Cover',
      aspectRatio: 'cover',
      currentImage: activeBusiness.coverUrl,
      samples: [
        { label: 'Commercial Farm Panoramic', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80' },
        { label: 'High Tech Automation', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      ],
      onSave: (newUrl) => {
        handleUpdateActiveBusiness({ coverUrl: newUrl });
        showToast('Business Cover Updated', activeBusiness.name, 'success');
      }
    });
  };

  const handleSaveProduct = (item: ProductItem) => {
    const updatedProducts = activeBusiness.products.some((p) => p.id === item.id)
      ? activeBusiness.products.map((p) => (p.id === item.id ? item : p))
      : [item, ...activeBusiness.products];
    handleUpdateActiveBusiness({ products: updatedProducts });
    syncBusinessProducts(updatedProducts);
    showToast('Product Saved', `"${item.name}" synced with E-Mart catalog.`, 'success');
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = activeBusiness.products.filter((p) => p.id !== id);
    handleUpdateActiveBusiness({
      products: updatedProducts,
    });
    syncBusinessProducts(updatedProducts);
    showToast('Product Removed', 'Offering removed from catalog and E-Mart.', 'info');
  };

  const handleSaveLocation = (item: BusinessLocationItem) => {
    let updated = activeBusiness.locations;
    if (item.isPrimary) {
      updated = updated.map((l) => ({ ...l, isPrimary: false }));
    }
    const exists = updated.some((l) => l.id === item.id);
    const result = exists
      ? updated.map((l) => (l.id === item.id ? item : l))
      : [...updated, item];
    handleUpdateActiveBusiness({ locations: result });
    showToast('Location Saved', item.name, 'success');
  };

  const handleDeleteLocation = (id: string) => {
    handleUpdateActiveBusiness({
      locations: activeBusiness.locations.filter((l) => l.id !== id),
    });
    showToast('Location Removed', 'Operating site removed.', 'info');
  };

  const handleSaveTeamMember = (item: TeamMemberItem) => {
    const exists = activeBusiness.teamMembers.some((m) => m.id === item.id);
    const updated = exists
      ? activeBusiness.teamMembers.map((m) => (m.id === item.id ? item : m))
      : [...activeBusiness.teamMembers, item];
    handleUpdateActiveBusiness({ teamMembers: updated });
    showToast('Team Member Saved', item.name, 'success');
  };

  const handleDeleteTeamMember = (id: string) => {
    handleUpdateActiveBusiness({
      teamMembers: activeBusiness.teamMembers.filter((m) => m.id !== id),
    });
    showToast('Team Member Removed', 'Personnel record removed.', 'info');
  };

  const handleSaveBizCert = (item: CertificationItem) => {
    const exists = activeBusiness.certifications.some((c) => c.id === item.id);
    const updated = exists
      ? activeBusiness.certifications.map((c) => (c.id === item.id ? item : c))
      : [...activeBusiness.certifications, item];
    handleUpdateActiveBusiness({ certifications: updated });
    showToast('Accreditation Saved', item.name, 'success');
  };

  const handleDeleteBizCert = (id: string) => {
    handleUpdateActiveBusiness({
      certifications: activeBusiness.certifications.filter((c) => c.id !== id),
    });
    showToast('Accreditation Removed', 'Statutory certificate removed.', 'info');
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/profile`;
    openShare({
      title: `${personalProfile.name} — PTIC Stakeholder Profile`,
      text: `${personalProfile.role} at ${personalProfile.organization}. Verified PTIC poultry professional in ${personalProfile.location}.`,
      url: shareUrl,
    });
  };

  // Filtered Connections
  const filteredConnections = useMemo(() => {
    if (!connectionsSearch.trim()) return connections;
    const query = connectionsSearch.toLowerCase();
    return connections.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.organization.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
    );
  }, [connections, connectionsSearch]);

  // Personal Tabs Config (NO Overview Tab!)
  const personalNavTabs: Array<{ id: PersonalNavTab; label: string; count?: number }> = [
    { id: 'professional', label: 'Professional Details' },
    { id: 'experience', label: 'Experience', count: personalProfile.experiences.length },
    { id: 'education', label: 'Education & Certifications', count: personalProfile.educations.length + personalProfile.certifications.length },
    { id: 'expertise', label: 'Expertise', count: personalProfile.specialties.length },
    { id: 'participation', label: 'PTIC Participation' },
    { id: 'connections', label: 'Connections', count: personalProfile.participationStats.connectionsCount },
  ];

  // Business Tabs Config (Overview Tab KEPT!)
  const businessNavTabs: Array<{ id: BusinessNavTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products & Services', count: activeBusiness.products.length },
    { id: 'details', label: 'Business Details' },
    { id: 'team', label: 'Team', count: activeBusiness.teamMembers.length },
    { id: 'certifications', label: 'Certifications', count: activeBusiness.certifications.length },
    { id: 'achievements', label: 'Achievements' },
    { id: 'locations', label: 'Locations', count: activeBusiness.locations.length },
    { id: 'participation', label: 'PTIC Participation' },
  ];

  return (
    <div className={`w-full max-w-full text-left font-sans select-none animate-fadeIn ${isModal ? 'p-1' : 'p-0 sm:p-2'}`}>
      
      {/* ============================================================ */}
      {/* 1. TOP SEGMENTED SWITCH: PERSONAL ↔ BUSINESS PROFILE         */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap sm:flex-nowrap">
        <div className="bg-slate-100/90 dark:bg-[#0A1931] p-1 rounded-full inline-flex border border-slate-200/90 dark:border-[#294966] shadow-2xs">
          <button
            type="button"
            onClick={() => setProfileType('personal')}
            className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              profileType === 'personal'
                ? 'bg-white dark:bg-[#1A3D63] text-slate-900 dark:text-[#F6FAFD] shadow-xs'
                : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User size={13} className={profileType === 'personal' ? 'text-[#135E69] dark:text-[#5ce0d2]' : ''} />
            <span>Personal Profile</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              profileType === 'personal'
                ? 'bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2]'
                : 'bg-slate-200/80 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]'
            }`}>
              {personalScoreResult.totalScore}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setProfileType('business')}
            className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              profileType === 'business'
                ? 'bg-white dark:bg-[#1A3D63] text-slate-900 dark:text-[#F6FAFD] shadow-xs'
                : 'text-slate-600 dark:text-[#B3CFE5] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase size={13} className={profileType === 'business' ? 'text-[#135E69] dark:text-[#5ce0d2]' : ''} />
            <span>Business Profile ({businessProfiles.length})</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              profileType === 'business'
                ? 'bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2]'
                : 'bg-slate-200/80 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]'
            }`}>
              {businessScoreResult.totalScore}%
            </span>
          </button>
        </div>

        {/* Modal Close Button if invoked as modal */}
        {isModal && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Close Profile
          </Button>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. 2-COLUMN DASHBOARD LAYOUT (~74% LEFT / ~26% RIGHT)        */}
      {/* Both columns start at the exact same vertical position!      */}
      {/* ============================================================ */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* ============================================================
            LEFT MAIN CONTENT COLUMN (~74% width)
            ============================================================ */}
        <div className="flex-1 min-w-0 w-full space-y-4">

          {/* ---------------------------------------------------------- */}
          {/* A. COMPACT PROFILE HEADER CARD (Spans ONLY Left Column!)   */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs overflow-hidden">
            {/* Compact Fixed Aspect-Ratio Cover Banner */}
            <div className="h-32 sm:h-36 md:h-38 w-full relative bg-gradient-to-r from-[#135E69] via-[#102640] to-[#1e3a5f] overflow-hidden group">
              {profileType === 'personal' ? (
                personalProfile.coverUrl ? (
                  <img
                    src={personalProfile.coverUrl}
                    alt="Profile Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#135E69] via-[#102640] to-[#1e3a5f]" />
                )
              ) : (
                activeBusiness.coverUrl ? (
                  <img
                    src={activeBusiness.coverUrl}
                    alt={activeBusiness.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#102640] via-[#135E69] to-[#1e3a5f]" />
                )
              )}

              {/* Cover Top-Right Badges & Change Cover Button */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>
                    {profileType === 'personal'
                      ? 'Tamil Nadu Poultry Chapter · Namakkal'
                      : 'PTIC Registered Enterprise #CORP-2026'}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={profileType === 'personal' ? handleOpenCoverUpload : handleOpenBizCoverUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-subtle"
                  title="Change Cover Banner"
                >
                  <Camera size={12} />
                  <span className="hidden sm:inline">Change Cover</span>
                </button>
              </div>
            </div>

            {/* Profile Identity & Self-Profile Actions Row */}
            <div className="px-4 sm:px-6 pb-4 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-11 sm:-mt-13 mb-3">
                {/* Circular Avatar with Active Dot */}
                <div className="relative inline-block shrink-0 group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white dark:ring-[#153451] shadow-md overflow-hidden bg-white dark:bg-[#102640] shrink-0 flex items-center justify-center relative">
                    {profileType === 'personal' ? (
                      personalProfile.avatarUrl ? (
                        <img
                          src={personalProfile.avatarUrl}
                          alt={personalProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-slate-800 dark:text-[#F6FAFD]">
                          {personalProfile.initials}
                        </span>
                      )
                    ) : (
                      activeBusiness.logoUrl ? (
                        <img
                          src={activeBusiness.logoUrl}
                          alt={activeBusiness.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-[#135E69]">
                          {activeBusiness.initials}
                        </span>
                      )
                    )}

                    {/* Change Photo Overlay */}
                    <div
                      onClick={profileType === 'personal' ? handleOpenPhotoUpload : handleOpenBizLogoUpload}
                      className="absolute inset-0 bg-black/55 backdrop-blur-xs text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 text-center"
                    >
                      <Camera size={15} className="mb-0.5" />
                      <span className="text-[10px] font-bold">
                        {profileType === 'personal' ? 'Change Photo' : 'Change Logo'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Camera Badge */}
                  <button
                    type="button"
                    onClick={profileType === 'personal' ? handleOpenPhotoUpload : handleOpenBizLogoUpload}
                    className="sm:hidden absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#135E69] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#153451] cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera size={11} />
                  </button>

                  {/* Verified Active Dot */}
                  <span
                    className="hidden sm:block absolute bottom-1 right-2 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#153451] rounded-full shadow-xs"
                    title="Verified Active Member"
                  />
                </div>

                {/* Self-Profile Action Buttons: ONLY Edit Profile + Share! NO Call/DM/Inquiry */}
                <div className="flex items-center gap-2 self-start sm:self-end pt-1 sm:pt-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShareProfile}
                    leftIcon={<Share2 size={13} />}
                    className="rounded-full text-xs"
                  >
                    Share
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (profileType === 'personal') {
                        setIsPersonalInfoModalOpen(true);
                      } else {
                        setIsBizHeaderModalOpen(true);
                      }
                    }}
                    leftIcon={<Edit3 size={13} />}
                    className="rounded-full text-xs shadow-xs"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Name, Verification Badges & Role */}
              <div className="space-y-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight font-display">
                    {profileType === 'personal' ? personalProfile.name : activeBusiness.name}
                  </h1>

                  {/* PTIC Verified Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shadow-2xs">
                    <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{profileType === 'personal' ? 'PTIC Verified #KR-2026' : 'PTIC Verified Enterprise'}</span>
                  </span>

                  {/* Role / Sector Badge */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] border border-[#135E69]/20">
                    {profileType === 'personal' ? personalProfile.category : activeBusiness.category}
                  </span>

                  {/* Active Status Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] border border-slate-200/80 dark:border-[#294966]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Status</span>
                  </span>
                </div>

                {/* Title & Organization / Tagline */}
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-[#B3CFE5]">
                  {profileType === 'personal' ? (
                    <>
                      {personalProfile.role} at{' '}
                      <span className="font-bold text-slate-900 dark:text-[#F6FAFD]">
                        {personalProfile.organization}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-600 dark:text-[#B3CFE5]">{activeBusiness.tagline}</span>
                  )}
                </p>

                {/* Compact Metadata Row */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-[#88B0D3] pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
                    {profileType === 'personal' ? personalProfile.location : activeBusiness.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
                    <span className="font-semibold text-slate-700 dark:text-[#B3CFE5]">
                      {profileType === 'personal'
                        ? `${personalProfile.participationStats.connectionsCount} Connections`
                        : `${activeBusiness.products.length} Products Listed`}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-500 dark:text-[#88B0D3]">
                    Member ID: {profileType === 'personal' ? 'PTIC-KR-2026' : 'PTIC-CORP-2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* B. TAB NAVIGATION ROW                                      */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-2 shadow-xs overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max" role="tablist">
              {profileType === 'personal' ? (
                personalNavTabs.map((tab) => {
                  const isActive = personalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPersonalTab(tab.id)}
                      role="tab"
                      aria-selected={isActive}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#135E69] text-white shadow-xs'
                          : 'text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-100 dark:hover:bg-[#102640] hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                businessNavTabs.map((tab) => {
                  const isActive = businessTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBusinessTab(tab.id)}
                      role="tab"
                      aria-selected={isActive}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#135E69] text-white shadow-xs'
                          : 'text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-100 dark:hover:bg-[#102640] hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* C. MAIN TAB CONTENT (PERSONAL PROFILE)                     */}
          {/* ---------------------------------------------------------- */}
          {profileType === 'personal' && (
            <>
              {/* SECTION 1: ABOUT ME (Shown on Professional Details & Expertise) */}
              {(personalTab === 'professional' || personalTab === 'expertise') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3.5 text-left">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        About Me
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOverviewModalOpen(true)}
                      leftIcon={<Edit3 size={12} />}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                    {personalProfile.bio}
                  </p>

                  {personalProfile.professionalSummary && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-xs text-slate-600 dark:text-[#B3CFE5] space-y-1">
                      <div className="font-semibold text-slate-800 dark:text-[#F6FAFD]">Professional Focus</div>
                      <p className="leading-relaxed">{personalProfile.professionalSummary}</p>
                    </div>
                  )}

                  {/* Key Domains */}
                  {personalProfile.keyDomains.length > 0 && (
                    <div className="space-y-1.5 pt-0.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#88B0D3] uppercase tracking-wider block">
                        Key Domains:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {personalProfile.keyDomains.map((domain, idx) => (
                          <span key={idx} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] border border-slate-200/80 dark:border-[#294966]">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Expertise Chips */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#88B0D3] uppercase tracking-wider">
                        Technical Expertise ({personalProfile.specialties.length})
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsOverviewModalOpen(true)}
                        leftIcon={<Plus size={12} />}
                        className="text-xs"
                      >
                        Add Expertise
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {personalProfile.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#135E69]/10 dark:bg-[#18A999]/20 text-[#135E69] dark:text-[#5ce0d2] border border-[#135E69]/20"
                        >
                          <Check size={12} className="text-[#135E69] dark:text-[#5ce0d2]" />
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: PERSONAL INFORMATION + PROFESSIONAL INFORMATION (Balanced 2-Column Cards) */}
              {(personalTab === 'professional') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left items-stretch">
                  {/* Card 1: Personal Information */}
                  <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#294966]">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                            Personal Information
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPersonalInfoModalOpen(true)}
                          leftIcon={<Edit3 size={12} />}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-[#294966] text-xs">
                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Calendar size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Date of Birth</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="font-bold text-slate-900 dark:text-[#F6FAFD]">{personalProfile.dateOfBirth}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]">
                              {personalProfile.visibility.dob}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <User size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Gender</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="font-bold text-slate-900 dark:text-[#F6FAFD]">{personalProfile.gender}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]">
                              {personalProfile.visibility.gender}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Globe size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Languages</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-[#F6FAFD] text-right truncate">
                            {personalProfile.languages.join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <MapPin size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Location</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-[#F6FAFD] text-right">
                            {personalProfile.location}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Phone size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Phone</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="font-bold text-slate-900 dark:text-[#F6FAFD]">{personalProfile.phone}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {personalProfile.visibility.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Mail size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Council Email</span>
                          </div>
                          <div className="flex items-center gap-2 text-right min-w-0">
                            <span className="font-bold text-slate-900 dark:text-[#F6FAFD] truncate">{personalProfile.email}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Professional Details */}
                  <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#294966]">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                            Professional Details
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsProfInfoModalOpen(true)}
                          leftIcon={<Edit3 size={12} />}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-[#294966] text-xs">
                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Award size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Designation</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-[#F6FAFD] text-right truncate">
                            {personalProfile.role}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Building size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Company</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-[#F6FAFD] text-right truncate">
                            {personalProfile.organization}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Clock size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Experience</span>
                          </div>
                          <span className="font-bold text-[#135E69] dark:text-[#5ce0d2] text-right">
                            {personalProfile.yearsExperience} Years
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Briefcase size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Industry Sector</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-[#F6FAFD] text-right truncate">
                            {personalProfile.industry}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <ShieldCheck size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Stakeholder Type</span>
                          </div>
                          <span className="font-bold text-[#135E69] dark:text-[#5ce0d2] text-right">
                            {personalProfile.stakeholderType}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 text-slate-500 dark:text-[#B3CFE5] font-medium min-w-[130px]">
                            <Activity size={14} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                            <span>Area of Work</span>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-[#F6FAFD] text-right truncate">
                            {personalProfile.areaOfWork.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: CAREER EXPERIENCE TIMELINE (Shown on Professional Details & Experience Tab) */}
              {(personalTab === 'professional' || personalTab === 'experience') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Experience ({personalProfile.experiences.length})
                      </h3>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingExperience(null);
                        setIsExperienceModalOpen(true);
                      }}
                      leftIcon={<Plus size={12} />}
                      className="text-xs"
                    >
                      Add Experience
                    </Button>
                  </div>

                  {/* Clean Vertical Timeline */}
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#294966]">
                    {personalProfile.experiences.map((exp) => (
                      <div key={exp.id} className="relative group text-left space-y-1">
                        {/* Timeline Node Dot */}
                        <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#153451] shadow-xs ${
                          exp.isCurrent ? 'bg-[#135E69] ring-4 ring-[#135E69]/20' : 'bg-slate-400'
                        }`} />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD]">
                                {exp.title}
                              </h4>
                              {exp.isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  Current Role
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2]">{exp.company}</p>
                            <span className="text-[11px] text-slate-400">
                              {exp.startDate} — {exp.endDate}
                            </span>
                          </div>

                          {/* Actions: Edit & Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingExperience(exp);
                                setIsExperienceModalOpen(true);
                              }}
                              className="p-1 rounded-md text-slate-500 hover:text-[#135E69] hover:bg-slate-100 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer"
                              title="Edit experience"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete experience"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-600 dark:text-[#B3CFE5] leading-relaxed pt-0.5">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: EDUCATION & CERTIFICATIONS (When tab selected) */}
              {(personalTab === 'education') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-6 text-left">
                  {/* Education Sub-Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                          Education ({personalProfile.educations.length})
                        </h3>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingEducation(null);
                          setIsEducationModalOpen(true);
                        }}
                        leftIcon={<Plus size={12} />}
                        className="text-xs"
                      >
                        Add Education
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {personalProfile.educations.map((edu) => (
                        <div
                          key={edu.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                              {edu.degree}
                            </h4>
                            <p className="text-xs text-[#135E69] dark:text-[#5ce0d2] font-medium">{edu.institution}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-[11px] text-slate-500 dark:text-[#88B0D3]">Field: {edu.fieldOfStudy}</p>
                            )}
                            <p className="text-[11px] text-slate-400">
                              {edu.startYear} — {edu.endYear}
                            </p>
                            {edu.description && (
                              <p className="text-xs text-slate-600 dark:text-[#B3CFE5] pt-1 leading-snug">
                                {edu.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEducation(edu);
                                setIsEducationModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#135E69] cursor-pointer"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEducation(edu.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Sub-Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                          Certifications & Accreditations ({personalProfile.certifications.length})
                        </h3>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingCert(null);
                          setIsCertModalOpen(true);
                        }}
                        leftIcon={<Plus size={12} />}
                        className="text-xs"
                      >
                        Add Certification
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {personalProfile.certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                              {cert.name}
                            </h4>
                            <p className="text-xs text-[#135E69] dark:text-[#5ce0d2] font-medium">{cert.issuingOrganization}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                              <span>Issued: {cert.issueDate}</span>
                              <span>•</span>
                              <span>Expires: {cert.expiryDate}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-600 dark:text-[#B3CFE5]">ID: {cert.credentialId}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                className="p-1 rounded text-slate-500 hover:text-[#135E69]"
                                title="View Certificate"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCert(cert);
                                setIsCertModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#135E69] cursor-pointer"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: PTIC PARTICIPATION (When tab selected) */}
              {personalTab === 'participation' && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-5 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                          PTIC Participation & Community Engagement
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Active involvement in Tamil Nadu Poultry Chapter initiatives
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsParticipationModalOpen(true)}
                      leftIcon={<Edit3 size={12} />}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Summary Metric Stats 4-Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-[#F6FAFD] block">
                        {personalProfile.participationStats.eventsAttended}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#88B0D3] mt-0.5 block">Events Attended</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-[#F6FAFD] block">
                        {personalProfile.participationStats.eventsRegistered}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#88B0D3] mt-0.5 block">Events Registered</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-[#F6FAFD] block">
                        {personalProfile.participationStats.questionsAsked}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#88B0D3] mt-0.5 block">Questions Asked</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-[#135E69] dark:text-[#5ce0d2] block">
                        {personalProfile.participationStats.expertAnswers}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#88B0D3] mt-0.5 block">Expert Answers</span>
                    </div>
                  </div>

                  {/* Participation Interests */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#294966]">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#88B0D3] uppercase tracking-wider block">
                      Participation & Event Focus Areas
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {personalProfile.participationInterests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#135E69]/10 dark:bg-[#18A999]/20 text-[#135E69] dark:text-[#5ce0d2] border border-[#135E69]/20"
                        >
                          <Check size={12} />
                          <span>{interest}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Areas of Contribution */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#294966]">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#88B0D3] uppercase tracking-wider block">
                      Council Contribution Areas
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {personalProfile.areasOfContribution.map((area, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] border border-slate-200/80 dark:border-[#294966]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Community Interests */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#294966]">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#88B0D3] uppercase tracking-wider block">
                      Community & Innovation Focus
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {personalProfile.communityInterests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: CONNECTIONS LIST (When Connections Tab Selected) */}
              {personalTab === 'connections' && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Council Connections ({personalProfile.participationStats.connectionsCount})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Verified Network</span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search member connections by name, enterprise, role or location..."
                      value={connectionsSearch}
                      onChange={(e) => setConnectionsSearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-full pl-9 pr-4 py-2 text-xs focus:border-[#135E69] focus:outline-none"
                    />
                  </div>

                  {/* Connections Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {filteredConnections.map((conn) => (
                      <div
                        key={conn.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between gap-3 group hover:border-[#135E69]/40 transition-colors cursor-pointer"
                        onClick={() => {
                          pushNav('/directory/people/' + slugify(conn.name));
                          onNavigate?.('directory');
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                            <img src={conn.avatarUrl} alt={conn.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] truncate">
                              {conn.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-[#88B0D3] truncate">
                              {conn.role} · {conn.organization}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {conn.location}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveConnection(conn);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-all shrink-0 cursor-pointer"
                          title="Remove connection"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {/* D. MAIN TAB CONTENT (BUSINESS PROFILE)                     */}
          {/* ---------------------------------------------------------- */}
          {profileType === 'business' && (
            <>
              {/* Active Enterprise Switcher Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-[#153451] p-3 rounded-2xl border border-slate-200/90 dark:border-[#294966]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#88B0D3]">
                    Active Enterprise:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {businessProfiles.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setActiveBusinessId(b.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeBusiness.id === b.id
                            ? 'bg-[#135E69] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] hover:bg-slate-200'
                        }`}
                      >
                        <Building size={12} />
                        <span>{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsBizHeaderModalOpen(true)}
                  leftIcon={<Edit3 size={12} />}
                  className="text-xs"
                >
                  Edit Enterprise
                </Button>
              </div>

              {/* PRODUCTS & SERVICES GRID (In Overview or Products Tab) */}
              {(businessTab === 'overview' || businessTab === 'products') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                          Products & Solutions ({activeBusiness.products.length})
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Automatically synchronized with PTIC E-Mart marketplace
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductModalOpen(true);
                      }}
                      leftIcon={<Plus size={12} />}
                      className="text-xs"
                    >
                      Add Product
                    </Button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
                    {activeBusiness.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex flex-col justify-between space-y-3 group hover:border-[#135E69]/40 transition-all text-left"
                      >
                        <div>
                          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 mb-2.5 relative">
                            <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#135E69] text-white shadow-xs">
                              {prod.category}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD] line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] line-clamp-2 mt-1">
                            {prod.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 dark:border-[#294966] flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Price</span>
                            <span className="text-xs font-black text-[#135E69] dark:text-[#5ce0d2] mt-0.5 block">{prod.price}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1 rounded-full text-slate-500 hover:text-[#135E69] hover:bg-slate-200/60 dark:hover:bg-[#1A3D63] cursor-pointer"
                              title="Edit product"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BUSINESS DETAILS & MISSION */}
              {(businessTab === 'overview' || businessTab === 'details') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Business Overview & Vision
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBizAboutModalOpen(true)}
                      leftIcon={<Edit3 size={12} />}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                    {activeBusiness.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-[#F6FAFD]">Mission</div>
                      <p className="text-slate-600 dark:text-[#B3CFE5] leading-relaxed">{activeBusiness.mission}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-[#F6FAFD]">Vision</div>
                      <p className="text-slate-600 dark:text-[#B3CFE5] leading-relaxed">{activeBusiness.vision}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* OPERATING LOCATIONS */}
              {(businessTab === 'overview' || businessTab === 'locations') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Operating Locations & Sheds ({activeBusiness.locations.length})
                      </h3>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingLocation(null);
                        setIsLocationModalOpen(true);
                      }}
                      leftIcon={<Plus size={12} />}
                      className="text-xs"
                    >
                      Add Location
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {activeBusiness.locations.map((loc) => (
                      <div
                        key={loc.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                              {loc.name}
                            </span>
                            {loc.isPrimary && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#135E69] text-white">
                                Primary HQ
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-[#B3CFE5] mt-1">{loc.address}</p>
                          <p className="text-[11px] text-slate-400">{loc.city}, {loc.state} - {loc.pincode}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-[#294966]">
                          <span className="text-[10px] text-slate-500 font-medium">{loc.type}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLocation(loc);
                                setIsLocationModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#135E69] cursor-pointer"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLocation(loc.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TEAM MEMBERS */}
              {(businessTab === 'overview' || businessTab === 'team') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Key Personnel & Management ({activeBusiness.teamMembers.length})
                      </h3>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingTeamMember(null);
                        setIsTeamMemberModalOpen(true);
                      }}
                      leftIcon={<Plus size={12} />}
                      className="text-xs"
                    >
                      Add Team Member
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {activeBusiness.teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] truncate">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-[#135E69] dark:text-[#5ce0d2] font-medium truncate">
                              {member.designation}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTeamMember(member);
                              setIsTeamMemberModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-[#135E69] cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BUSINESS ACCREDITATIONS & CERTIFICATIONS */}
              {(businessTab === 'overview' || businessTab === 'certifications' || businessTab === 'achievements') && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        Accreditations & Certifications ({activeBusiness.certifications.length})
                      </h3>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingBizCert(null);
                        setIsBizCertModalOpen(true);
                      }}
                      leftIcon={<Plus size={12} />}
                      className="text-xs"
                    >
                      Add Certification
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {activeBusiness.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD]">
                              {cert.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-[#B3CFE5] mt-1">{cert.issuingOrganization}</p>
                          <p className="text-[11px] text-slate-400">Issued: {cert.issueDate} · Expires: {cert.expiryDate}</p>
                          {cert.credentialId && (
                            <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {cert.credentialId}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-[#294966]">
                          {cert.credentialUrl ? (
                            <a
                              href={cert.credentialUrl}
                              className="text-[11px] font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline flex items-center gap-1"
                            >
                              <span>Verify Credential</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : <span />}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBizCert(cert);
                                setIsBizCertModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-[#135E69] cursor-pointer"
                              title="Edit Certification"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBizCert(cert.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BUSINESS PTIC PARTICIPATION TAB */}
              {businessTab === 'participation' && (
                <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#294966]">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-[#135E69] dark:text-[#5ce0d2]" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                        PTIC Enterprise Engagement & Marketplace Participation
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Council Enterprise Partner</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-[#135E69] dark:text-[#5ce0d2] block">{activeBusiness.products.length}</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-1 block">E-Mart Offerings</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-emerald-600 block">18</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Buyer Enquiries</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-[#F6FAFD] block">5</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Expos Attended</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-center">
                      <span className="text-xl font-black text-slate-900 dark:text-[#F6FAFD] block">340</span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Enterprise Views</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-100 dark:border-[#294966] text-xs text-slate-600 dark:text-[#B3CFE5] space-y-1">
                    <div className="font-bold text-slate-800 dark:text-[#F6FAFD]">Council Marketplace Partnership</div>
                    <p className="leading-relaxed">
                      {activeBusiness.name} actively supplies verified equipment and feed formulations to registered PTIC poultry growers across Tamil Nadu with verified audit compliance.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* ============================================================
            RIGHT SIDEBAR COLUMN (~26% width) - 4 INDEPENDENT CARDS
            Starts at the exact same vertical position as Profile Header!
            ============================================================ */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-4 lg:sticky lg:top-20 text-left">
          
          {/* SIDEBAR CARD 1: PROFILE COMPLETION CARD */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3.5 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
                <span>{profileType === 'personal' ? 'Profile Completion' : 'Enterprise Score'}</span>
              </h3>
              <button
                type="button"
                onClick={() => profileType === 'personal' ? setIsScoreModalOpen(true) : setIsBizScoreModalOpen(true)}
                className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline cursor-pointer"
              >
                View Details
              </button>
            </div>

            {/* Circular Percentage Progress Indicator */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-[#102640]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#135E69] dark:text-[#5ce0d2] transition-all duration-700 ease-out"
                    strokeDasharray={`${profileType === 'personal' ? personalScoreResult.totalScore : businessScoreResult.totalScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900 dark:text-[#F6FAFD]">
                  {profileType === 'personal' ? personalScoreResult.totalScore : businessScoreResult.totalScore}%
                </span>
              </div>

              <div>
                <div className="text-sm font-black text-slate-900 dark:text-[#F6FAFD] leading-tight">
                  {profileType === 'personal' ? `${personalScoreResult.totalScore}% Completed` : `${businessScoreResult.totalScore} / 100`}
                </div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {profileType === 'personal' ? `${personalScoreResult.status} Profile` : `${businessScoreResult.status} Enterprise`}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  High council search visibility
                </p>
              </div>
            </div>

            {/* Checklist of Categories & Values */}
            <div className="space-y-1.5 pt-1 text-xs">
              {(profileType === 'personal' ? personalScoreResult.categories : businessScoreResult.categories).map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-slate-600 dark:text-[#B3CFE5] py-0.5">
                  <span className="flex items-center gap-1.5 truncate pr-2 font-medium">
                    <CheckCircle2 size={12} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-[#F6FAFD] shrink-0">
                    {cat.score}/{cat.weight}
                  </span>
                </div>
              ))}
            </div>

            {/* Complete Profile Pill Button */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => profileType === 'personal' ? setIsScoreModalOpen(true) : setIsBizScoreModalOpen(true)}
              className="w-full text-xs"
              rightIcon={<ArrowRight size={13} />}
            >
              Complete Profile
            </Button>
          </div>

          {/* SIDEBAR CARD 2: PTIC ACTIVITY CARD */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-[#135E69] dark:text-[#5ce0d2]" />
                <span>{profileType === 'personal' ? 'PTIC Activity' : 'Marketplace Activity'}</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">View All</span>
            </div>

            <div className="space-y-1 text-xs">
              {profileType === 'personal' ? (
                <>
                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <Calendar size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">
                      {personalProfile.participationStats.eventsAttended}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Events Attended</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <Clock size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">
                      {personalProfile.participationStats.eventsRegistered}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Events Registered</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <Users size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">
                      {personalProfile.participationStats.connectionsCount}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Connections</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <HelpCircle size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">
                      {personalProfile.participationStats.questionsAsked}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Questions Asked</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <CheckCircle2 size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-[#135E69] dark:text-[#5ce0d2] w-7 text-right shrink-0">
                      {personalProfile.participationStats.expertAnswers}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Expert Answers</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5">
                    <Award size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">
                      {personalProfile.participationStats.contributionsCount}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Contributions</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <ShoppingBag size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-[#135E69] dark:text-[#5ce0d2] w-7 text-right shrink-0">
                      {activeBusiness.products.length}
                    </span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Products Listed</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <Mail size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-emerald-600 w-7 text-right shrink-0">18</span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Enquiries Received</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <Calendar size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">5</span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Expos Participated</span>
                  </div>

                  <div className="flex items-center gap-3 py-1.5">
                    <Activity size={13} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0 w-4" />
                    <span className="font-black text-slate-900 dark:text-[#F6FAFD] w-7 text-right shrink-0">340</span>
                    <span className="text-slate-600 dark:text-[#B3CFE5] font-medium">Profile Views</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SIDEBAR CARD 3: CONTRIBUTION LEVEL */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Star size={15} className="text-amber-500 fill-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider">
                Contribution Level
              </h3>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Active Member
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#B3CFE5] leading-relaxed pt-0.5">
              Consistently participating in PTIC conclaves, regional shed audits, and community Q&A forums.
            </p>
          </div>

          {/* SIDEBAR CARD 4: VERIFICATION STATUS */}
          <div className="bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] shadow-xs p-5 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#294966]">
              <h3 className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>{profileType === 'personal' ? 'Verification Status' : 'Business Trust Status'}</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {profileType === 'personal' ? (
                <>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Email Verified</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Mobile Verified</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Identity Verified</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Aadhaar Linked</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Professional Details</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Audited</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Organization Verified</span>
                    </span>
                    <span className="text-[11px] text-slate-400">TN Chapter</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>GSTIN Verified</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">33AABCR***</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>TNPCB Consent</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1 border-b border-slate-100 dark:border-[#294966] last:border-b-0">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Council Certification</span>
                    </span>
                    <span className="text-[11px] text-slate-400">#CORP-2026</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-[#B3CFE5] py-1">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>ISO Quality System</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Certified</span>
                  </div>
                </>
              )}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsVerificationModalOpen(true)}
              className="w-full text-xs mt-1"
            >
              Audit Details & Badges
            </Button>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MODAL EDITORS (PRESERVED 100% OF FUNCTIONALITY)           */}
      {/* ============================================================ */}
      <ImageUploadModal
        isOpen={imageModalConfig.isOpen}
        onClose={() => setImageModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={imageModalConfig.title}
        aspectRatio={imageModalConfig.aspectRatio}
        currentImage={imageModalConfig.currentImage}
        onSave={imageModalConfig.onSave}
        sampleImages={imageModalConfig.samples}
      />

      <ScoreDetailsModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        title="Council Member Profile Score"
        scoreResult={personalScoreResult}
        onEditCategory={(categoryName) => {
          setIsScoreModalOpen(false);
          if (categoryName.includes('Basic') || categoryName.includes('Identity')) {
            setIsPersonalInfoModalOpen(true);
          } else if (categoryName.includes('Professional')) {
            setIsProfInfoModalOpen(true);
          } else if (categoryName.includes('Experience')) {
            setEditingExperience(null);
            setIsExperienceModalOpen(true);
          } else if (categoryName.includes('Education')) {
            setEditingEducation(null);
            setIsEducationModalOpen(true);
          } else if (categoryName.includes('Certifications')) {
            setEditingCert(null);
            setIsCertModalOpen(true);
          } else if (categoryName.includes('Participation') || categoryName.includes('PTIC')) {
            setIsParticipationModalOpen(true);
          } else {
            setIsOverviewModalOpen(true);
          }
        }}
      />

      <ScoreDetailsModal
        isOpen={isBizScoreModalOpen}
        onClose={() => setIsBizScoreModalOpen(false)}
        title="Enterprise Profile Score"
        scoreResult={businessScoreResult}
        onEditCategory={(categoryName) => {
          setIsBizScoreModalOpen(false);
          if (categoryName.includes('Products') || categoryName.includes('Catalog')) {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          } else if (categoryName.includes('Location')) {
            setEditingLocation(null);
            setIsLocationModalOpen(true);
          } else if (categoryName.includes('Team')) {
            setEditingTeamMember(null);
            setIsTeamMemberModalOpen(true);
          } else if (categoryName.includes('Cert')) {
            setEditingBizCert(null);
            setIsBizCertModalOpen(true);
          } else {
            setIsBizHeaderModalOpen(true);
          }
        }}
      />

      <EditOverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        initialBio={personalProfile.bio}
        initialSummary={personalProfile.professionalSummary}
        initialDomains={personalProfile.keyDomains}
        initialSpecialties={personalProfile.specialties}
        onSave={(data) => {
          handleUpdatePersonalProfile({
            bio: data.bio,
            professionalSummary: data.summary,
            keyDomains: data.domains,
            specialties: data.specialties,
          });
          showToast('Overview Saved', 'Profile overview and expertise chips updated.', 'success');
        }}
      />

      <EditPersonalInfoModal
        isOpen={isPersonalInfoModalOpen}
        onClose={() => setIsPersonalInfoModalOpen(false)}
        profile={personalProfile}
        onSave={(updated) => {
          handleUpdatePersonalProfile(updated);
        }}
      />

      <EditProfessionalInfoModal
        isOpen={isProfInfoModalOpen}
        onClose={() => setIsProfInfoModalOpen(false)}
        profile={personalProfile}
        onSave={(updated) => {
          handleUpdatePersonalProfile(updated);
        }}
      />

      <AddEditExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        experienceToEdit={editingExperience}
        onSave={handleSaveExperience}
        onDelete={handleDeleteExperience}
      />

      <AddEditEducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        educationToEdit={editingEducation}
        onSave={handleSaveEducation}
        onDelete={handleDeleteEducation}
      />

      <AddEditCertificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificationToEdit={editingCert}
        onSave={handleSaveCertification}
        onDelete={handleDeleteCertification}
      />

      <EditParticipationModal
        isOpen={isParticipationModalOpen}
        onClose={() => setIsParticipationModalOpen(false)}
        participationInterests={personalProfile.participationInterests}
        areasOfContribution={personalProfile.areasOfContribution}
        communityInterests={personalProfile.communityInterests}
        onSave={(data) => {
          handleUpdatePersonalProfile({
            participationInterests: data.participationInterests,
            areasOfContribution: data.areasOfContribution,
            communityInterests: data.communityInterests,
          });
          showToast('Participation Details Saved', 'Community interest focus updated.', 'success');
        }}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verification={personalProfile.verification}
        onSimulateVerifyAll={() => {
          handleUpdatePersonalProfile({
            verification: {
              email: true,
              mobile: true,
              identity: true,
              professionalDetails: true,
              organization: true,
            },
          });
        }}
      />

      {/* Business Modals */}
      <EditBusinessHeaderModal
        isOpen={isBizHeaderModalOpen}
        onClose={() => setIsBizHeaderModalOpen(false)}
        business={activeBusiness}
        onSave={(updated) => {
          handleUpdateActiveBusiness(updated);
        }}
      />

      <EditBusinessAboutModal
        isOpen={isBizAboutModalOpen}
        onClose={() => setIsBizAboutModalOpen(false)}
        business={activeBusiness}
        onSave={(data) => {
          handleUpdateActiveBusiness({
            description: data.description,
            mission: data.mission,
            vision: data.vision,
            keyDomains: data.keyDomains,
            businessCategories: data.businessCategories,
          });
        }}
      />

      <AddEditProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />

      <AddEditLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        locationToEdit={editingLocation}
        onSave={handleSaveLocation}
        onDelete={handleDeleteLocation}
      />

      <AddEditTeamMemberModal
        isOpen={isTeamMemberModalOpen}
        onClose={() => setIsTeamMemberModalOpen(false)}
        memberToEdit={editingTeamMember}
        onSave={handleSaveTeamMember}
        onDelete={handleDeleteTeamMember}
      />

      <AddEditBusinessCertModal
        isOpen={isBizCertModalOpen}
        onClose={() => setIsBizCertModalOpen(false)}
        certToEdit={editingBizCert}
        onSave={handleSaveBizCert}
        onDelete={handleDeleteBizCert}
      />
    </div>
  );
};
