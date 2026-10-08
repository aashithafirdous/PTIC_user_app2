import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CURRENT_USER } from '../../data/mockData';
import { useToast } from '../ui/Toast';
import { useLanguage, Language } from '../../lib/LanguageContext';
import { useTheme, Theme } from '../../lib/ThemeContext';
import { 
  Bell, 
  HelpCircle, 
  User, 
  Info, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Lock,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Languages
} from 'lucide-react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  // Active Tab: 'personal' | 'notifications' | 'privacy' | 'appearance' | 'support' | 'about'
  const [activeTab, setActiveTab] = useState<'personal' | 'notifications' | 'privacy' | 'appearance' | 'support' | 'about'>('personal');

  // Personal Info State
  const [name, setName] = useState(CURRENT_USER.name);
  const [role, setRole] = useState(CURRENT_USER.role);
  const [org, setOrg] = useState(CURRENT_USER.organization);
  const [location, setLocation] = useState(CURRENT_USER.location);
  const [phone, setPhone] = useState('+91 98421 54321');
  const [email, setEmail] = useState('karthik.rajan@rajanpoultry.in');

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [expertReplies, setExpertReplies] = useState(true);

  // Privacy Settings State
  const [publicDirectory, setPublicDirectory] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [allowDirectConnect, setAllowDirectConnect] = useState(true);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeLabel = newTheme === 'dark' ? 'Dark' : newTheme === 'light' ? 'Light' : 'System Default';
    showToast(
      language === 'தமிழ்' ? `தீம் மாற்றப்பட்டது: ${themeLabel}` : `Theme switched to ${themeLabel}`,
      language === 'தமிழ்' ? 'பயன்பாட்டுத் தோற்றம் உடனடியாக புதுப்பிக்கப்பட்டது.' : 'Application appearance updated immediately.',
      'info'
    );
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    showToast(
      newLang === 'தமிழ்' ? 'மொழி மாற்றப்பட்டது: தமிழ் (Tamil)' : 'Language switched to English',
      newLang === 'தமிழ்' ? 'அனைத்து இடைமுக லேபிள்களும் தமிழில் புதுப்பிக்கப்பட்டுள்ளன.' : 'All interface labels updated to English.',
      'success'
    );
  };

  const handleSave = () => {
    onClose();
    showToast(
      language === 'தமிழ்' ? 'அமைப்புகள் சேமிக்கப்பட்டன' : 'Settings saved',
      language === 'தமிழ்' ? 'உங்கள் விருப்பங்கள், மொழி மற்றும் தீம் சேமிக்கப்பட்டுள்ளன.' : 'Your preferences, language, and theme have been saved.',
      'success'
    );
  };

  const navTabs = [
    { id: 'personal', label: t('personalInfo', 'Personal Information'), icon: User },
    { id: 'notifications', label: t('notificationPrefs', 'Notification Preferences'), icon: Bell },
    { id: 'privacy', label: t('privacySettings', 'Privacy Settings'), icon: Lock },
    { id: 'appearance', label: t('appearance', 'Appearance & Language'), icon: Palette },
    { id: 'support', label: t('helpSupport', 'Help & Support'), icon: HelpCircle },
    { id: 'about', label: t('aboutPtic', 'About PTIC'), icon: Info },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings', 'Application Settings')}
      description={language === 'தமிழ்' ? 'உங்கள் சான்றுகள், அறிவிப்புகள், தனியுரிமை விதிகள் மற்றும் கவுன்சில் ஆதரவை நிர்வகிக்கவும்' : 'Manage your credentials, notification channels, privacy rules, and council support'}
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {t('savePreferences', 'Save Preferences')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col sm:flex-row gap-4 text-left max-h-[72vh] overflow-y-auto pr-1">
        {/* Settings Navigation Sidebar */}
        <div className="sm:w-52 shrink-0 flex flex-row sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0 border-b sm:border-b-0 sm:border-r border-ptic-border sm:pr-3">
          {navTabs.map((tItem) => {
            const Icon = tItem.icon;
            const isActive = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                type="button"
                onClick={() => setActiveTab(tItem.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all select-none text-left cursor-pointer ${
                  isActive
                    ? 'bg-ptic-soft/45 text-ptic-dark shadow-subtle ring-1 ring-ptic-primary/30'
                    : 'text-ptic-dark/70 hover:bg-ptic-bg hover:text-ptic-dark'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-ptic-primary shrink-0' : 'text-ptic-secondary shrink-0'} />
                <span className="truncate">{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 1. Personal Information */}
          {activeTab === 'personal' && (
            <div className="space-y-3.5 animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary border-b border-ptic-border pb-1">
                {language === 'தமிழ்' ? 'தனிப்பட்ட & கவுன்சில் சான்றுகள்' : 'Personal & Council Credentials'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={language === 'தமிழ்' ? 'முழு பெயர்' : 'Full Name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label={language === 'தமிழ்' ? 'பதவி / பங்கு' : 'Designation / Role'}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  label={language === 'தமிழ்' ? 'நிறுவனம் / பண்ணையின் பெயர்' : 'Enterprise / Farm Name'}
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />
                <Input
                  label={language === 'தமிழ்' ? 'இருப்பிடம்' : 'Location'}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  label={language === 'தமிழ்' ? 'தொலைபேசி எண்' : 'Phone'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label={language === 'தமிழ்' ? 'கவுன்சில் மின்னஞ்சல்' : 'Council Email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 2. Notification Preferences */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary border-b border-ptic-border pb-1">
                {language === 'தமிழ்' ? 'அறிவிப்பு வழிகள் & முன்னுரிமை' : 'Communication & Outbreak Channels'}
              </p>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'மின்னஞ்சல் எச்சரிக்கைகள்' : 'Official Council Email Advisories'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'வாராந்திர ஆலோசனை அறிக்கைகள் மற்றும் அறிவிப்புகள்' : 'Weekly disease surveillance & biosecurity bulletins'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'உடனடி SMS / WhatsApp எச்சரிக்கைகள்' : 'Instant SMS / WhatsApp Alerts'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'அதிக முன்னுரிமை வெப்ப அழுத்தம் மற்றும் நோய் எச்சரிக்கைகள்' : 'High-priority heat stress warnings & outbreak notifications'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'நிகழ்வு நினைவூட்டல்கள்' : 'Event Reminders'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'பதிவு செய்த நிகழ்வுகளுக்கு 24 மணி நேரத்திற்கு முன்பான எச்சரிக்கைகள்' : 'Alerts 24 hours prior to registered seminars & workshops'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={eventReminders}
                  onChange={(e) => setEventReminders(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'நிபுணர் பதில்கள்' : 'Ask Expert Responses'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'உங்கள் கேள்விக்கு மருத்துவர் பதிலளிக்கும் போது உடனடி அறிவிப்பு' : 'Instant notification when a veterinarian answers your question'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={expertReplies}
                  onChange={(e) => setExpertReplies(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>
            </div>
          )}

          {/* 3. Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary border-b border-ptic-border pb-1">
                {language === 'தமிழ்' ? 'தனியுரிமை, பார்வை & அணுகல் கட்டுப்பாடுகள்' : 'Privacy, Visibility & Access Controls'}
              </p>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'பொது பார்வையில் சுயவிவரம்' : 'People Public Visibility'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'சரிபார்க்கப்பட்ட உறுப்பினர்கள் உங்கள் பண்ணை சுயவிவரத்தைப் பார்க்க அனுமதிக்கவும்' : 'Allow verified stakeholders to view your farm profile'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={publicDirectory}
                  onChange={(e) => setPublicDirectory(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'வணிக சுயவிவரத்தில் தொலைபேசி எண்ணைக் காட்டு' : 'Show Phone on Verified Business Profile'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'உபகரண வழங்குநர்கள் & தீவன நிறுவனங்கள் உங்களைத் தொடர்பு கொள்ள அனுமதிக்கவும்' : 'Permit equipment providers & feed companies to reach you'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[12px] bg-ptic-bg border border-ptic-border">
                <div>
                  <p className="text-xs font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'இணைப்பு கோரிக்கைகளை அனுமதி' : 'Allow Connection Requests'}
                  </p>
                  <p className="text-[11px] text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'கோழிப்பண்ணை ஆராய்ச்சியாளர்களிடமிருந்து நெட்வொர்க்கிங் அழைப்புகளைப் பெறுங்கள்' : 'Receive networking invitations from poultry researchers'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowDirectConnect}
                  onChange={(e) => setAllowDirectConnect(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
              </div>
            </div>
          )}

          {/* 4. Theme & Language Settings — Requirement 1, 2, 4 */}
          {activeTab === 'appearance' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status summary pill */}
              <div className="p-3 rounded-xl bg-ptic-bg border border-ptic-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ptic-dark">
                    {language === 'தமிழ்' ? 'செயலில் உள்ள அமைப்புகள்:' : 'Current Preferences:'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-ptic-primary/10 text-ptic-primary font-bold">
                    {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : `System (${resolvedTheme})`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                    {language === 'தமிழ்' ? 'தமிழ் (Tamil)' : 'English'}
                  </span>
                </div>
                <span className="text-[11px] text-ptic-textMuted">
                  {language === 'தமிழ்' ? 'உடனடியாக செயல்படுத்தப்படும்' : 'Applies immediately'}
                </span>
              </div>

              {/* Theme Selection: Light / Dark / System Default */}
              <div>
                <div className="flex items-center justify-between border-b border-ptic-border pb-1.5 mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary flex items-center gap-1.5">
                    <Palette size={14} />
                    <span>{t('appearance', 'Appearance')} — {t('theme', 'Theme')}</span>
                  </p>
                  <span className="text-[11px] font-medium text-ptic-textMuted">
                    {theme === 'system' ? `Auto (${resolvedTheme})` : theme.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Light Theme Card */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`p-3.5 rounded-[12px] border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      theme === 'light'
                        ? 'border-ptic-primary bg-ptic-soft/20 shadow-subtle ring-2 ring-ptic-primary'
                        : 'border-ptic-border bg-white hover:border-ptic-soft hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="p-2 rounded-[10px] bg-amber-50 text-amber-600">
                        <Sun size={18} />
                      </div>
                      {theme === 'light' && (
                        <span className="w-5 h-5 rounded-full bg-ptic-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ptic-dark">
                        {t('themeLight', 'Light')}
                      </p>
                      <p className="text-[11px] text-ptic-textMuted mt-0.5 leading-snug">
                        {t('themeLightDesc', 'Standard council daylight palette with soft blue tints')}
                      </p>
                    </div>
                  </button>

                  {/* Dark Theme Card */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`p-3.5 rounded-[12px] border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      theme === 'dark'
                        ? 'border-ptic-primary bg-ptic-soft/20 shadow-subtle ring-2 ring-ptic-primary'
                        : 'border-ptic-border bg-white hover:border-ptic-soft hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="p-2 rounded-[10px] bg-slate-800 text-slate-200">
                        <Moon size={18} />
                      </div>
                      {theme === 'dark' && (
                        <span className="w-5 h-5 rounded-full bg-ptic-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ptic-dark">
                        {t('themeDark', 'Dark')}
                      </p>
                      <p className="text-[11px] text-ptic-textMuted mt-0.5 leading-snug">
                        {t('themeDarkDesc', 'High-contrast night deck with PTIC blue palette')}
                      </p>
                    </div>
                  </button>

                  {/* System Default Card */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('system')}
                    className={`p-3.5 rounded-[12px] border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      theme === 'system'
                        ? 'border-ptic-primary bg-ptic-soft/20 shadow-subtle ring-2 ring-ptic-primary'
                        : 'border-ptic-border bg-white hover:border-ptic-soft hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="p-2 rounded-[10px] bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300">
                        <Monitor size={18} />
                      </div>
                      {theme === 'system' && (
                        <span className="w-5 h-5 rounded-full bg-ptic-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ptic-dark">
                        {t('themeSystem', 'System Default')}
                      </p>
                      <p className="text-[11px] text-ptic-textMuted mt-0.5 leading-snug">
                        {t('themeSystemDesc', 'Matches your device / OS appearance automatically')}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection: English / Tamil */}
              <div>
                <div className="flex items-center justify-between border-b border-ptic-border pb-1.5 mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary flex items-center gap-1.5">
                    <Languages size={14} />
                    <span>{t('language', 'Language')} / மொழி</span>
                  </p>
                  <span className="text-[11px] font-medium text-ptic-textMuted">
                    {language === 'தமிழ்' ? 'தமிழ் தேர்ந்தெடுக்கப்பட்டது' : 'English Selected'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* English Card */}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('EN')}
                    className={`p-3.5 rounded-[12px] border text-left cursor-pointer transition-all flex items-center justify-between text-xs ${
                      language === 'EN'
                        ? 'border-ptic-primary bg-ptic-soft/20 ring-2 ring-ptic-primary shadow-subtle font-semibold'
                        : 'border-ptic-border bg-white text-ptic-dark hover:border-ptic-soft hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇬🇧</span>
                      <div>
                        <p className="font-bold text-xs text-ptic-dark">English</p>
                        <p className="text-[10px] text-ptic-textMuted mt-0.5">
                          {t('languageEnglishDesc', 'Council Working Language')}
                        </p>
                      </div>
                    </div>
                    {language === 'EN' && (
                      <span className="w-5 h-5 rounded-full bg-ptic-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>

                  {/* Tamil Card */}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('தமிழ்')}
                    className={`p-3.5 rounded-[12px] border text-left cursor-pointer transition-all flex items-center justify-between text-xs ${
                      language === 'தமிழ்'
                        ? 'border-ptic-primary bg-ptic-soft/20 ring-2 ring-ptic-primary shadow-subtle font-semibold'
                        : 'border-ptic-border bg-white text-ptic-dark hover:border-ptic-soft hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇮🇳</span>
                      <div>
                        <p className="font-bold text-xs text-ptic-dark">தமிழ் (Tamil)</p>
                        <p className="text-[10px] text-ptic-textMuted mt-0.5">
                          {t('languageTamilDesc', 'Regional Council Hubs')}
                        </p>
                      </div>
                    </div>
                    {language === 'தமிழ்' && (
                      <span className="w-5 h-5 rounded-full bg-ptic-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Help & Support */}
          {activeTab === 'support' && (
            <div className="space-y-3.5 animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary border-b border-ptic-border pb-1">
                {language === 'தமிழ்' ? 'உதவி & கவுன்சில் செயலக ஆதரவு' : 'Help & Council Secretariat Support'}
              </p>

              <div className="p-3.5 rounded-[12px] bg-ptic-bg border border-ptic-border space-y-2">
                <p className="text-xs font-bold text-ptic-dark">
                  PTIC Technical Secretariat
                </p>
                <div className="space-y-1 text-xs text-ptic-dark/80">
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-ptic-secondary" /> Email: support@ptic-council.in
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-ptic-secondary" /> Helpline: 1800-425-7842 (Toll Free)
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-ptic-secondary" /> Secretariat: Namakkal Poultry Complex, Tamil Nadu
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-ptic-dark">
                <p className="font-semibold text-ptic-dark">Frequently Asked Questions:</p>
                <div className="p-2.5 rounded-[10px] bg-white border border-ptic-border">
                  <p className="font-medium">How do I verify my farm or enterprise?</p>
                  <p className="text-[11px] text-ptic-textMuted mt-0.5">Upload your municipal trade license or PTIC membership receipt in your profile.</p>
                </div>
                <div className="p-2.5 rounded-[10px] bg-white border border-ptic-border">
                  <p className="font-medium">Who can answer questions in Ask Experts?</p>
                  <p className="text-[11px] text-ptic-textMuted mt-0.5">Certified avian pathologists, veterinarians, and registered researchers.</p>
                </div>
              </div>
            </div>
          )}

          {/* 6. About PTIC */}
          {activeTab === 'about' && (
            <div className="space-y-3.5 animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-ptic-secondary border-b border-ptic-border pb-1">
                {language === 'தமிழ்' ? 'கோழிப்பண்ணை தொழில்நுட்ப & கண்டுபிடிப்பு கவுன்சில் பற்றி' : 'About Poultry Technology & Innovation Council'}
              </p>

              <div className="p-3.5 rounded-[12px] bg-ptic-bg border border-ptic-border space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-ptic-primary text-white font-bold text-xs flex items-center justify-center">
                    PTIC
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-ptic-dark">PTIC Stakeholder Platform</h5>
                    <span className="text-[10px] text-ptic-textMuted">Version 1.2 · Release 2026</span>
                  </div>
                </div>
                <p className="text-xs text-ptic-dark/90 leading-relaxed">
                  The Poultry Technology & Innovation Council connects growers, veterinarians, automation providers, and researchers to drive biosecurity, disease resistance, and sustainable flock management.
                </p>
              </div>

              <div className="p-3 rounded-[12px] bg-white border border-ptic-border space-y-1 text-xs">
                <span className="font-semibold flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 size={14} /> Biosecurity Governance Standard Compliant
                </span>
                <p className="text-[11px] text-ptic-textMuted">
                  All farm data complies with national poultry biosecurity regulations and verified institutional protocols.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
