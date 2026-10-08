import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  ExperienceItem, 
  EducationItem, 
  CertificationItem, 
  PersonalProfileData 
} from '../../data/profileData';
import { 
  Plus, 
  X, 
  Check, 
  Lock, 
  Search, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../ui/Toast';

// ============================================================
// 1. EDIT OVERVIEW & EXPERTISE MODAL
// ============================================================

export interface EditOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBio: string;
  initialDomains: string[];
  initialSummary: string;
  initialSpecialties: string[];
  onSave: (data: { bio: string; domains: string[]; summary: string; specialties: string[] }) => void;
}

const STANDARD_PTIC_CATEGORIES = [
  'Farm Automation',
  'IoT & Sensors',
  'Broiler Production',
  'Climate Control',
  'Biosecurity',
  'Feed Optimization',
  'Vaccine Protocols',
  'Tunnel Ventilation',
  'Litter Management',
  'Disease Diagnostics',
  'Ammonia Monitoring',
  'Energy Efficiency',
  'Water Line Sanitation',
  'DOC Nursery Brooding',
  'Contract Farming'
];

export const EditOverviewModal: React.FC<EditOverviewModalProps> = ({
  isOpen,
  onClose,
  initialBio,
  initialDomains,
  initialSummary,
  initialSpecialties,
  onSave,
}) => {
  const { showToast } = useToast();
  const [bio, setBio] = useState(initialBio);
  const [domainsInput, setDomainsInput] = useState(initialDomains.join(', '));
  const [summary, setSummary] = useState(initialSummary);
  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    setBio(initialBio);
    setDomainsInput(initialDomains.join(', '));
    setSummary(initialSummary);
    setSpecialties(initialSpecialties);
  }, [initialBio, initialDomains, initialSummary, initialSpecialties, isOpen]);

  const handleAddSpecialty = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (specialties.includes(trimmed)) {
      showToast('Already Added', `"${trimmed}" is already in your skills list.`, 'info');
      return;
    }
    setSpecialties([...specialties, trimmed]);
    setSearchQuery('');
    setCustomSkill('');
  };

  const handleRemoveSpecialty = (skillToRemove: string) => {
    setSpecialties(specialties.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      bio: bio.trim(),
      domains: domainsInput.split(',').map((d) => d.trim()).filter(Boolean),
      summary: summary.trim(),
      specialties,
    });
    showToast('Overview Updated', 'Your About Me and technical expertise have been saved.', 'success');
    onClose();
  };

  const filteredCategories = STANDARD_PTIC_CATEGORIES.filter(
    (cat) =>
      !specialties.includes(cat) &&
      cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Overview & Expertise"
      description="Refine your stakeholder bio, technical poultry domains, and searchable expertise chips"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left max-h-[72vh] overflow-y-auto pr-1">
        {/* About Me Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            About Me / Stakeholder Bio *
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell fellow council members about your farm operations, experience, and interests..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
            required
          />
        </div>

        {/* Professional Summary */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Professional Summary
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief executive summary of your tenure and poultry milestones..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Key Domains */}
        <Input
          label="Key Operational Domains (comma-separated)"
          placeholder="e.g. Broiler Production, Climate Automation, Biosecurity"
          value={domainsInput}
          onChange={(e) => setDomainsInput(e.target.value)}
          hint="Key themes highlighted on your public stakeholder profile"
        />

        {/* Expertise Multi-Select with Search & Add/Remove */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-[#294966]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Poultry Skills & Expertise ({specialties.length})
            </label>
            <span className="text-[11px] text-slate-400">Searchable by council members</span>
          </div>

          {/* Active Chips */}
          <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
            {specialties.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No expertise added yet. Pick from below or type custom skill.</span>
            ) : (
              specialties.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#0f8f8c]/10 dark:bg-[#0f8f8c]/20 text-[#0f8f8c] dark:text-[#4A7FA7] border border-[#0f8f8c]/25"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(item)}
                    className="hover:text-rose-500 rounded-full p-0.5 cursor-pointer"
                    title={`Remove ${item}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Search or Quick Add Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search PTIC categories or type custom skill..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCustomSkill(e.target.value);
                }}
                className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#0f8f8c] focus:outline-none"
              />
            </div>
            {customSkill.trim() && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleAddSpecialty(customSkill)}
                leftIcon={<Plus size={13} />}
              >
                Add
              </Button>
            )}
          </div>

          {/* Quick Category Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-[#88B0D3]">
              Suggested PTIC Categories (Click to add):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {filteredCategories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleAddSpecialty(cat)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#153451] hover:bg-slate-100 dark:hover:bg-[#1A3D63] border border-slate-200 dark:border-[#294966] text-slate-700 dark:text-[#B3CFE5] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={10} className="text-[#0f8f8c]" />
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 2. EDIT PERSONAL INFORMATION MODAL
// ============================================================

export interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PersonalProfileData;
  onSave: (updated: Partial<PersonalProfileData>) => void;
}

export const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState(profile.name);
  const [dob, setDob] = useState(profile.dateOfBirth);
  const [gender, setGender] = useState(profile.gender);
  const [languages, setLanguages] = useState(profile.languages.join(', '));
  const [location, setLocation] = useState(profile.location);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [visibility, setVisibility] = useState(profile.visibility);

  useEffect(() => {
    setName(profile.name);
    setDob(profile.dateOfBirth);
    setGender(profile.gender);
    setLanguages(profile.languages.join(', '));
    setLocation(profile.location);
    setPhone(profile.phone);
    setEmail(profile.email);
    setVisibility(profile.visibility);
  }, [profile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      dateOfBirth: dob,
      gender,
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      location: location.trim(),
      phone: phone.trim(),
      email: email.trim(),
      visibility,
      initials: name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    });
    showToast('Personal Information Updated', 'Identity and contact preferences saved.', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Information"
      description="Update your personal identity, contact channels, and granular privacy visibility settings"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-[#88B0D3] flex items-center gap-1.5">
            <Lock size={13} className="text-amber-500" />
            <span>Sensitive records respect your visibility choice</span>
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left max-h-[72vh] overflow-y-auto pr-1">
        {/* Full Name & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Legal Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="District / Location *"
            placeholder="Namakkal, Tamil Nadu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Date of Birth & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white dark:bg-[#153451] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD] flex items-center justify-between">
              <span>DOB Visibility</span>
              <span className="text-[10px] text-slate-400 font-normal">Who can view?</span>
            </label>
            <select
              value={visibility.dob}
              onChange={(e) => setVisibility({ ...visibility, dob: e.target.value as any })}
              className="w-full bg-white dark:bg-[#153451] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Private">Private (Only You & Council Admin)</option>
              <option value="Members Only">Members Only (Verified Council)</option>
              <option value="Public">Public (Directory Visitors)</option>
            </select>
          </div>
        </div>

        {/* Gender & Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <Input
            label="Languages Spoken (comma separated)"
            placeholder="e.g. English, தமிழ்"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>

        {/* Phone & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
          <Input
            label="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Phone Visibility
            </label>
            <select
              value={visibility.phone}
              onChange={(e) => setVisibility({ ...visibility, phone: e.target.value as any })}
              className="w-full bg-white dark:bg-[#153451] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Members Only">Members Only (Verified Council)</option>
              <option value="Public">Public (Any Directory User)</option>
              <option value="Private">Private (Hidden from Profile)</option>
            </select>
          </div>
        </div>

        {/* Email & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
          <Input
            label="Council / Business Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Email Visibility
            </label>
            <select
              value={visibility.email}
              onChange={(e) => setVisibility({ ...visibility, email: e.target.value as any })}
              className="w-full bg-white dark:bg-[#153451] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              <option value="Members Only">Members Only (Verified Council)</option>
              <option value="Public">Public (Visible to All)</option>
              <option value="Private">Private (Hidden)</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 3. EDIT PROFESSIONAL INFORMATION MODAL
// ============================================================

export interface EditProfessionalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PersonalProfileData;
  onSave: (updated: Partial<PersonalProfileData>) => void;
}

const PTIC_INDUSTRIES = [
  'Commercial Broiler & Layer Production',
  'Poultry Technology & Automation',
  'Veterinary Services & Flock Health',
  'Feed Milling & Animal Nutrition',
  'Hatchery & Breeder Management',
  'Poultry Processing & Value-Add Retail',
  'Council Policy & Academic Research'
];

const STAKEHOLDER_TYPES = [
  'Commercial Poultry Farmer',
  'Poultry Farm Owner',
  'Integrator / Contract Producer',
  'Senior Poultry Veterinarian',
  'Technology Provider',
  'Feed Miller / Nutritionist',
  'Hatchery Operator',
  'Academic Researcher'
];

const STANDARD_AREAS = [
  'Broiler Growing',
  'Tunnel Ventilation',
  'Biosecurity Protocols',
  'Feed Milling',
  'Water Sanitation',
  'Disease Diagnostics',
  'Flock Vaccination',
  'Litter Composting',
  'Solar Energy Adoption'
];

export const EditProfessionalInfoModal: React.FC<EditProfessionalInfoModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const { showToast } = useToast();
  const [role, setRole] = useState(profile.role);
  const [company, setCompany] = useState(profile.organization);
  const [years, setYears] = useState(String(profile.yearsExperience));
  const [industry, setIndustry] = useState(profile.industry);
  const [stakeholderType, setStakeholderType] = useState(profile.stakeholderType);
  const [areaOfWork, setAreaOfWork] = useState<string[]>(profile.areaOfWork);
  const [summary, setSummary] = useState(profile.professionalSummary);

  useEffect(() => {
    setRole(profile.role);
    setCompany(profile.organization);
    setYears(String(profile.yearsExperience));
    setIndustry(profile.industry);
    setStakeholderType(profile.stakeholderType);
    setAreaOfWork(profile.areaOfWork);
    setSummary(profile.professionalSummary);
  }, [profile, isOpen]);

  const handleToggleArea = (area: string) => {
    if (areaOfWork.includes(area)) {
      setAreaOfWork(areaOfWork.filter((a) => a !== area));
    } else {
      setAreaOfWork([...areaOfWork, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      role: role.trim(),
      organization: company.trim(),
      yearsExperience: parseInt(years, 10) || 0,
      industry,
      stakeholderType,
      areaOfWork,
      professionalSummary: summary.trim(),
    });
    showToast('Professional Details Saved', 'Your industry credentials have been updated.', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Professional Information"
      description="Update your designation, enterprise affiliation, poultry sector, and areas of work"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Designation / Position *"
            placeholder="e.g. Poultry Farm Owner"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Input
            label="Company / Enterprise Name *"
            placeholder="e.g. Rajan Poultry Farms"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Years of Experience *"
            type="number"
            min="0"
            max="60"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
              Stakeholder Type *
            </label>
            <select
              value={stakeholderType}
              onChange={(e) => setStakeholderType(e.target.value)}
              className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            >
              {STAKEHOLDER_TYPES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Industry Sector *
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
          >
            {PTIC_INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Multi-Select Area of Work */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Area of Work (Multi-Select)
          </label>
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
            {STANDARD_AREAS.map((area) => {
              const selected = areaOfWork.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleToggleArea(area)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selected
                      ? 'bg-[#0f8f8c] text-white shadow-xs'
                      : 'bg-white dark:bg-[#153451] text-slate-700 dark:text-[#B3CFE5] border border-slate-200 dark:border-[#294966] hover:border-slate-300'
                  }`}
                >
                  {selected && <Check size={12} strokeWidth={2.5} />}
                  <span>{area}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Professional Summary */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Professional Summary
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Describe your primary technical focus, bird capacity, and operational scale..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 4. ADD / EDIT EXPERIENCE MODAL
// ============================================================

export interface AddEditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceToEdit?: ExperienceItem | null;
  onSave: (item: ExperienceItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditExperienceModal: React.FC<AddEditExperienceModalProps> = ({
  isOpen,
  onClose,
  experienceToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (experienceToEdit) {
      setTitle(experienceToEdit.title);
      setCompany(experienceToEdit.company);
      setStartDate(experienceToEdit.startDate);
      setEndDate(experienceToEdit.endDate);
      setIsCurrent(experienceToEdit.isCurrent);
      setDescription(experienceToEdit.description);
    } else {
      setTitle('');
      setCompany('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
    }
  }, [experienceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const item: ExperienceItem = {
      id: experienceToEdit?.id || `exp-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      startDate: startDate.trim() || '2020',
      endDate: isCurrent ? 'Present' : (endDate.trim() || '2024'),
      isCurrent,
      description: description.trim(),
    };

    onSave(item);
    showToast(
      experienceToEdit ? 'Experience Updated' : 'Experience Added',
      `${item.title} at ${item.company}`,
      'success'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={experienceToEdit ? 'Edit Experience' : 'Add Experience'}
      description="Record a milestone in your poultry management, veterinary, or technical career"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {experienceToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(experienceToEdit.id);
                showToast('Experience Deleted', experienceToEdit.title, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Experience
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="Job Title / Role *"
          placeholder="e.g. Operations Manager, Lead Grower"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Company / Farm Enterprise *"
          placeholder="e.g. Rajan Poultry Farms"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Date *"
            placeholder="e.g. 2018 or Jan 2018"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            placeholder={isCurrent ? 'Present' : 'e.g. 2022'}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isCurrent}
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-[#F6FAFD] cursor-pointer">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => {
              setIsCurrent(e.target.checked);
              if (e.target.checked) setEndDate('Present');
            }}
            className="rounded border-slate-300 text-[#0f8f8c] focus:ring-[#0f8f8c]"
          />
          <span>I currently work in this position</span>
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Role Description & Key Accomplishments
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe flock capacities managed, automated systems installed, mortality rates achieved..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none leading-relaxed"
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 5. ADD / EDIT EDUCATION MODAL
// ============================================================

export interface AddEditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  educationToEdit?: EducationItem | null;
  onSave: (item: EducationItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditEducationModal: React.FC<AddEditEducationModalProps> = ({
  isOpen,
  onClose,
  educationToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (educationToEdit) {
      setInstitution(educationToEdit.institution);
      setDegree(educationToEdit.degree);
      setFieldOfStudy(educationToEdit.fieldOfStudy);
      setStartYear(educationToEdit.startYear);
      setEndYear(educationToEdit.endYear);
      setDescription(educationToEdit.description);
    } else {
      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setDescription('');
    }
  }, [educationToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    const item: EducationItem = {
      id: educationToEdit?.id || `edu-${Date.now()}`,
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      startYear: startYear.trim(),
      endYear: endYear.trim(),
      description: description.trim(),
    };

    onSave(item);
    showToast(educationToEdit ? 'Education Updated' : 'Education Added', item.institution, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={educationToEdit ? 'Edit Education' : 'Add Education'}
      description="Add an academic degree, diploma, or institutional training"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {educationToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(educationToEdit.id);
                showToast('Education Removed', educationToEdit.institution, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Education
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="College / University / Institution *"
          placeholder="e.g. TANUVAS or Agricultural University"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Degree / Diploma *"
            placeholder="e.g. Diploma in Poultry Management"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />
          <Input
            label="Field of Study"
            placeholder="e.g. Poultry Science, Animal Husbandry"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Year"
            placeholder="e.g. 2005"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <Input
            label="End Year (or Expected)"
            placeholder="e.g. 2008"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Description / Highlights
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Relevant coursework, research projects, practical hatchery training..."
            className="w-full bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs focus:border-[#0f8f8c] focus:outline-none"
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 6. ADD / EDIT CERTIFICATION MODAL
// ============================================================

export interface AddEditCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificationToEdit?: CertificationItem | null;
  onSave: (item: CertificationItem) => void;
  onDelete?: (id: string) => void;
}

export const AddEditCertificationModal: React.FC<AddEditCertificationModalProps> = ({
  isOpen,
  onClose,
  certificationToEdit,
  onSave,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credId, setCredId] = useState('');
  const [credUrl, setCredUrl] = useState('');

  useEffect(() => {
    if (certificationToEdit) {
      setName(certificationToEdit.name);
      setOrg(certificationToEdit.issuingOrganization);
      setIssueDate(certificationToEdit.issueDate);
      setExpiryDate(certificationToEdit.expiryDate);
      setCredId(certificationToEdit.credentialId);
      setCredUrl(certificationToEdit.credentialUrl);
    } else {
      setName('');
      setOrg('');
      setIssueDate('');
      setExpiryDate('');
      setCredId('');
      setCredUrl('');
    }
  }, [certificationToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !org.trim()) return;

    const item: CertificationItem = {
      id: certificationToEdit?.id || `cert-${Date.now()}`,
      name: name.trim(),
      issuingOrganization: org.trim(),
      issueDate: issueDate.trim() || '2023',
      expiryDate: expiryDate.trim() || 'Lifetime',
      credentialId: credId.trim() || `PTIC-${Date.now().toString().slice(-4)}`,
      credentialUrl: credUrl.trim() || 'https://ptic-council.org',
    };

    onSave(item);
    showToast(certificationToEdit ? 'Certification Updated' : 'Certification Added', item.name, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certificationToEdit ? 'Edit Certification' : 'Add Certification'}
      description="Attach verified council credentials, biosecurity training, or technical licenses"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {certificationToEdit && onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onDelete(certificationToEdit.id);
                showToast('Certification Deleted', certificationToEdit.name, 'info');
                onClose();
              }}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Delete
            </Button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
              Save Certification
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left max-h-[72vh] overflow-y-auto pr-1">
        <Input
          label="Certification Name *"
          placeholder="e.g. Certified Biosecurity Practitioner (Poultry)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Issuing Organization *"
          placeholder="e.g. PTIC Council, TANUVAS, WIPA"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Issue Date"
            placeholder="e.g. 2021-03 or Mar 2021"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <Input
            label="Expiry Date"
            placeholder="e.g. 2026-03 or Lifetime"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Credential ID"
            placeholder="e.g. PTIC-BIO-2021-049"
            value={credId}
            onChange={(e) => setCredId(e.target.value)}
          />
          <Input
            label="Credential URL"
            placeholder="https://ptic-council.org/credentials/..."
            value={credUrl}
            onChange={(e) => setCredUrl(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 7. EDIT PARTICIPATION INTERESTS MODAL
// ============================================================

export interface EditParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  participationInterests: string[];
  areasOfContribution: string[];
  communityInterests: string[];
  onSave: (data: {
    participationInterests: string[];
    areasOfContribution: string[];
    communityInterests: string[];
  }) => void;
}

export const EditParticipationModal: React.FC<EditParticipationModalProps> = ({
  isOpen,
  onClose,
  participationInterests: initPI,
  areasOfContribution: initAC,
  communityInterests: initCI,
  onSave,
}) => {
  const { showToast } = useToast();
  const [piList, setPiList] = useState<string[]>(initPI);
  const [acList, setAcList] = useState<string[]>(initAC);
  const [ciList, setCiList] = useState<string[]>(initCI);

  const [newPI, setNewPI] = useState('');
  const [newAC, setNewAC] = useState('');
  const [newCI, setNewCI] = useState('');

  useEffect(() => {
    setPiList(initPI);
    setAcList(initAC);
    setCiList(initCI);
  }, [initPI, initAC, initCI, isOpen]);

  const handleAdd = (list: string[], setList: (val: string[]) => void, input: string, setInput: (v: string) => void) => {
    const val = input.trim();
    if (!val) return;
    if (!list.includes(val)) setList([...list, val]);
    setInput('');
  };

  const handleRemove = (list: string[], setList: (val: string[]) => void, item: string) => {
    setList(list.filter((x) => x !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      participationInterests: piList,
      areasOfContribution: acList,
      communityInterests: ciList,
    });
    showToast('Participation Interests Saved', 'Your community focus topics have been updated.', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Participation & Community Interests"
      description="Declare your event interests, mentorship topics, and poultry community areas of contribution"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-end gap-2.5">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Check size={14} />}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left max-h-[72vh] overflow-y-auto pr-1">
        {/* Participation Interests */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Participation Interests (Webinars, Summits, Workshops)
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
            {piList.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#0f8f8c]/10 text-[#0f8f8c] border border-[#0f8f8c]/20">
                <span>{item}</span>
                <button type="button" onClick={() => handleRemove(piList, setPiList, item)} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Technical Webinars, Poultry Expos..."
              value={newPI}
              onChange={(e) => setNewPI(e.target.value)}
              className="flex-1 bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => handleAdd(piList, setPiList, newPI, setNewPI)}>
              Add
            </Button>
          </div>
        </div>

        {/* Areas of Contribution */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Areas of Council Contribution (Mentorship, Case Studies)
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
            {acList.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>{item}</span>
                <button type="button" onClick={() => handleRemove(acList, setAcList, item)} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Field Mentorship, Biosecurity Audits..."
              value={newAC}
              onChange={(e) => setNewAC(e.target.value)}
              className="flex-1 bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => handleAdd(acList, setAcList, newAC, setNewAC)}>
              Add
            </Button>
          </div>
        </div>

        {/* Community Interests */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD]">
            Community & Research Topics
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966]">
            {ciList.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span>{item}</span>
                <button type="button" onClick={() => handleRemove(ciList, setCiList, item)} className="hover:text-rose-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Solar Energy in Poultry Sheds..."
              value={newCI}
              onChange={(e) => setNewCI(e.target.value)}
              className="flex-1 bg-white dark:bg-[#102640] text-slate-900 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966] rounded-xl px-3 py-2 text-xs focus:border-[#0f8f8c]"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => handleAdd(ciList, setCiList, newCI, setNewCI)}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// ============================================================
// 8. VERIFICATION GUIDANCE PROMPT MODAL
// ============================================================

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: PersonalProfileData['verification'];
  onSimulateVerifyAll: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  verification,
  onSimulateVerifyAll,
}) => {
  const { showToast } = useToast();

  const handleComplete = () => {
    onSimulateVerifyAll();
    showToast('Verification Confirmed', 'All stakeholder and chapter identity checks completed.', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Council Verification Standards"
      description="Verification badges are governed by PTIC administrative audits and government ID records"
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            System Controlled · Audited by TN Chapter
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleComplete} leftIcon={<ShieldCheck size={14} />}>
              Complete Verification
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-left text-xs">
        <p className="text-slate-600 dark:text-[#B3CFE5] leading-relaxed">
          PTIC Member Council enforces strict anti-impersonation and bio-security registration guidelines. All 5 credentials below are verified:
        </p>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className={verification.email ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">Email Verification</span>
                <p className="text-[11px] text-slate-400">Verified OTP delivery to official mailbox</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className={verification.mobile ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">Mobile Verification</span>
                <p className="text-[11px] text-slate-400">Linked to WhatsApp Council broadcast channel</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className={verification.identity ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">Identity Verified</span>
                <p className="text-[11px] text-slate-400">Aadhaar / National Poultry ID registry match</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className={verification.professionalDetails ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">Professional Details Verified</span>
                <p className="text-[11px] text-slate-400">Confirmed broiler shed operational capacity</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className={verification.organization ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">Organization Verified</span>
                <p className="text-[11px] text-slate-400">Tamil Nadu Poultry Council Namakkal Chapter standing</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
