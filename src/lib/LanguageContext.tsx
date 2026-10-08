import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'EN' | 'தமிழ்';

interface TranslationEntry {
  en: string;
  ta: string;
}

interface Translations {
  [key: string]: TranslationEntry;
}

const TRANSLATIONS: Translations = {
  // Brand & Header
  brandTitle: {
    en: 'Poultry Technology & Innovation Council',
    ta: 'கோழிப்பண்ணை தொழில்நுட்ப & கண்டுபிடிப்பு கவுன்சில்'
  },
  councilBadge: {
    en: 'Council',
    ta: 'கவுன்சில்'
  },
  verifiedStakeholder: {
    en: 'Verified Council Stakeholder',
    ta: 'சரிபார்க்கப்பட்ட கவுன்சில் பங்குதாரர்'
  },
  namakkalChapter: {
    en: 'Namakkal Chapter',
    ta: 'நாமக்கல் கிளை'
  },
  poultryCouncil: {
    en: 'Poultry Council',
    ta: 'கோழிப்பண்ணை கவுன்சில்'
  },

  // Home Page Refined Layout
  homeWelcome: {
    en: 'Welcome to PTIC',
    ta: 'PTIC-க்கு வரவேற்கிறோம்'
  },
  homePartner: {
    en: 'Your Poultry Farming Partner',
    ta: 'உங்கள் கோழிப்பண்ணை கூட்டாளி'
  },
  homeHeroDesc: {
    en: 'Get expert advice, useful information, products and support – all in one place.',
    ta: 'நிபுணர் ஆலோசனை, பயனுள்ள தகவல், தயாரிப்புகள் மற்றும் ஆதரவு - அனைத்தும் ஒரே இடத்தில்.'
  },
  exploreNow: {
    en: 'Explore Now',
    ta: 'இப்போதே ஆராயுங்கள்'
  },
  directoryCardTitle: {
    en: 'Directory',
    ta: 'வழிகாட்டி'
  },
  directoryCardDesc: {
    en: 'Find experts, farmers and companies',
    ta: 'நிபுணர்கள், பண்ணையாளர்கள் & நிறுவனங்கள்'
  },
  askExpertCardTitle: {
    en: 'Ask Expert',
    ta: 'நிபுணரிடம் கேளுங்கள்'
  },
  askExpertCardDesc: {
    en: 'Get answers to your questions',
    ta: 'உங்கள் கேள்விகளுக்கு பதில்களைப் பெறுங்கள்'
  },
  emartCardTitle: {
    en: 'E-Mart',
    ta: 'இ-மார்ட்'
  },
  emartCardDesc: {
    en: 'Buy products & services',
    ta: 'தயாரிப்புகள் & சேவைகளை வாங்குங்கள்'
  },
  eventsCardTitle: {
    en: 'Events',
    ta: 'நிகழ்வுகள்'
  },
  eventsCardDesc: {
    en: 'Join workshops, seminars & expos',
    ta: 'பணிமனைகள், கருத்தரங்குகள் & கண்காட்சிகள்'
  },
  latestEvents: {
    en: 'Latest Events',
    ta: 'சமீபத்திய நிகழ்வுகள்'
  },
  latestEvent: {
    en: 'Latest Event',
    ta: 'சமீபத்திய நிகழ்வு'
  },
  helpfulForYou: {
    en: 'Helpful for You',
    ta: 'உங்களுக்கு பயனுள்ளது'
  },
  betterHealth: {
    en: 'Better Health',
    ta: 'சிறந்த ஆரோக்கியம்'
  },
  betterHealthDesc: {
    en: 'Keep your birds healthy',
    ta: 'பறவைகளை ஆரோக்கியமாக வைத்திருங்கள்'
  },
  higherProduction: {
    en: 'Higher Production',
    ta: 'அதிக உற்பத்தி'
  },
  higherProductionDesc: {
    en: 'Get better results',
    ta: 'சிறந்த விளைவுகளைப் பெறுங்கள்'
  },
  safeFarming: {
    en: 'Safe Farming',
    ta: 'பாதுகாப்பான பண்ணை'
  },
  safeFarmingDesc: {
    en: 'Follow best practices',
    ta: 'சிறந்த நடைமுறைகளைப் பின்பற்றுங்கள்'
  },
  learnAndGrow: {
    en: 'Learn & Grow',
    ta: 'கற்றுக்கொண்டு வளருங்கள்'
  },
  learnAndGrowDesc: {
    en: 'Stay updated',
    ta: 'தகவல் அறிந்து முன்னேறுங்கள்'
  },

  // Main Navigation (matches required prompt format)
  'nav.home': {
    en: 'Home',
    ta: 'முகப்பு'
  },
  navHome: {
    en: 'Home',
    ta: 'முகப்பு'
  },
  'nav.people': {
    en: 'People',
    ta: 'நபர்கள்'
  },
  navDirectory: {
    en: 'People',
    ta: 'நபர்கள்'
  },
  dirPeople: {
    en: 'People',
    ta: 'நபர்கள்'
  },
  people: {
    en: 'People',
    ta: 'நபர்கள்'
  },
  'nav.events': {
    en: 'Events',
    ta: 'நிகழ்வுகள்'
  },
  navEvents: {
    en: 'Events',
    ta: 'நிகழ்வுகள்'
  },
  events: {
    en: 'Events',
    ta: 'நிகழ்வுகள்'
  },
  'nav.eMart': {
    en: 'E-Mart',
    ta: 'இ-மார்ட்'
  },
  navEmart: {
    en: 'E-Mart',
    ta: 'இ-மார்ட்'
  },
  emart: {
    en: 'E-Mart',
    ta: 'இ-மார்ட்'
  },
  'nav.askExperts': {
    en: 'Ask Experts',
    ta: 'நிபுணர்களிடம் கேளுங்கள்'
  },
  navAsk: {
    en: 'Ask Experts',
    ta: 'நிபுணர்களிடம் கேளுங்கள்'
  },
  askExperts: {
    en: 'Ask Experts',
    ta: 'நிபுணர்களிடம் கேளுங்கள்'
  },
  'nav.inbox': {
    en: 'Messaging',
    ta: 'செய்திகள்'
  },
  navInbox: {
    en: 'Messaging',
    ta: 'செய்திகள்'
  },
  messaging: {
    en: 'Messaging',
    ta: 'செய்திகள்'
  },
  'nav.notifications': {
    en: 'Notifications',
    ta: 'அறிவிப்புகள்'
  },
  navNotifications: {
    en: 'Notifications',
    ta: 'அறிவிப்புகள்'
  },
  notifications: {
    en: 'Notifications',
    ta: 'அறிவிப்புகள்'
  },
  navProfile: {
    en: 'Profile',
    ta: 'சுயவிவரம்'
  },
  navMe: {
    en: 'Me',
    ta: 'நான்'
  },
  'nav.settings': {
    en: 'Settings',
    ta: 'அமைப்புகள்'
  },
  navSettings: {
    en: 'Settings & Privacy',
    ta: 'அமைப்புகள் & தனியுரிமை'
  },
  settings: {
    en: 'Settings',
    ta: 'அமைப்புகள்'
  },
  navLogout: {
    en: 'Sign Out',
    ta: 'வெளியேறு'
  },
  logout: {
    en: 'Logout',
    ta: 'வெளியேறு'
  },

  // Common UI Actions & Buttons (matches required prompt format)
  'common.search': {
    en: 'Search',
    ta: 'தேடுக'
  },
  search: {
    en: 'Search',
    ta: 'தேடுக'
  },
  searchPlaceholder: {
    en: 'Search people, events, solutions...',
    ta: 'உறுப்பினர்கள், நிகழ்வுகள், தீர்வுகளைத் தேடுங்கள்...'
  },
  'common.save': {
    en: 'Save',
    ta: 'சேமிக்க'
  },
  save: {
    en: 'Save',
    ta: 'சேமிக்க'
  },
  'common.cancel': {
    en: 'Cancel',
    ta: 'ரத்து செய்'
  },
  cancel: {
    en: 'Cancel',
    ta: 'ரத்து செய்'
  },
  'common.submit': {
    en: 'Submit',
    ta: 'சமர்ப்பிக்க'
  },
  submit: {
    en: 'Submit',
    ta: 'சமர்ப்பிக்க'
  },
  viewDetails: {
    en: 'View Details',
    ta: 'விவரங்களைப் பார்க்க'
  },
  'common.viewDetails': {
    en: 'View Details',
    ta: 'விவரங்களைப் பார்க்க'
  },
  loading: {
    en: 'Loading...',
    ta: 'ஏற்றப்படுகிறது...'
  },
  tryAgain: {
    en: 'Try Again',
    ta: 'மீண்டும் முயற்சிக்கவும்'
  },
  clear: {
    en: 'Clear',
    ta: 'அழிக்க'
  },
  clearSearch: {
    en: 'Clear search',
    ta: 'தேடலை அழிக்க'
  },
  close: {
    en: 'Close',
    ta: 'மூடு'
  },
  back: {
    en: 'Back',
    ta: 'பின்னோக்கி'
  },
  share: {
    en: 'Share',
    ta: 'பகிர்'
  },
  download: {
    en: 'Download',
    ta: 'பதிவிறக்கு'
  },
  connect: {
    en: 'Connect',
    ta: 'இணைக்க'
  },
  connected: {
    en: 'Connected',
    ta: 'இணைக்கப்பட்டது'
  },
  send: {
    en: 'Send',
    ta: 'அனுப்பு'
  },
  edit: {
    en: 'Edit',
    ta: 'திருத்து'
  },
  delete: {
    en: 'Delete',
    ta: 'நீக்கு'
  },
  filter: {
    en: 'Filter',
    ta: 'வடிகட்டு'
  },
  all: {
    en: 'All',
    ta: 'அனைத்தும்'
  },
  explore: {
    en: 'Explore',
    ta: 'ஆராயுங்கள்'
  },
  viewAll: {
    en: 'View All',
    ta: 'அனைத்தையும் காண்க'
  },

  // Settings & Theme
  'settings.theme': {
    en: 'Theme',
    ta: 'தீம் (Theme)'
  },
  'settings.language': {
    en: 'Language',
    ta: 'மொழி (Language)'
  },
  appearance: {
    en: 'Appearance',
    ta: 'தோற்றம்'
  },
  theme: {
    en: 'Theme',
    ta: 'தீம்'
  },
  themeLight: {
    en: 'Light',
    ta: 'வெளிச்சம் (Light)'
  },
  themeDark: {
    en: 'Dark',
    ta: 'இருள் (Dark)'
  },
  themeSystem: {
    en: 'System Default',
    ta: 'கணினி இயல்புநிலை (System Default)'
  },
  themeLightDesc: {
    en: 'Standard council daylight palette with soft blue tints',
    ta: 'மென்மையான நீல வண்ணங்களுடன் கூடிய நிலையான பகல் வெளிச்சத் தீம்'
  },
  themeDarkDesc: {
    en: 'High-contrast night deck for poultry sheds and low-light',
    ta: 'குறைந்த வெளிச்சம் மற்றும் இரவு நேரப் பயன்பாட்டிற்கான உயர்தர இருள் தீம்'
  },
  themeSystemDesc: {
    en: 'Automatically matches your device system appearance',
    ta: 'உங்கள் சாதனத்தின் தோற்ற அமைப்பிற்கு ஏற்ப தானாக மாறும்'
  },
  languageEnglish: {
    en: 'English',
    ta: 'ஆங்கிலம் (English)'
  },
  languageTamil: {
    en: 'தமிழ் (Tamil)',
    ta: 'தமிழ்'
  },
  languageEnglishDesc: {
    en: 'Council Working Language',
    ta: 'கவுன்சில் பணி மொழி'
  },
  languageTamilDesc: {
    en: 'Regional Council Hubs',
    ta: 'மண்டல கவுன்சில் மொழி'
  },
  savePreferences: {
    en: 'Save Preferences',
    ta: 'விருப்பங்களைச் சேமி'
  },
  personalInfo: {
    en: 'Personal Information',
    ta: 'தனிப்பட்ட தகவல்கள்'
  },
  notificationPrefs: {
    en: 'Notification Preferences',
    ta: 'அறிவிப்பு விருப்பங்கள்'
  },
  privacySettings: {
    en: 'Privacy Settings',
    ta: 'தனியுரிமை அமைப்புகள்'
  },
  helpSupport: {
    en: 'Help & Support',
    ta: 'உதவி & ஆதரவு'
  },
  aboutPtic: {
    en: 'About PTIC',
    ta: 'PTIC பற்றி'
  },

  // Home Page
  greetingMorning: {
    en: 'Good morning',
    ta: 'காலை வணக்கம்'
  },
  greetingAfternoon: {
    en: 'Good afternoon',
    ta: 'மதிய வணக்கம்'
  },
  greetingEvening: {
    en: 'Good evening',
    ta: 'மாலை வணக்கம்'
  },
  homeWelcomeSub: {
    en: 'Welcome to the Poultry Technology & Innovation Council network. Collaborate with certified avian veterinarians, farm automation providers, and regional growers across Tamil Nadu.',
    ta: 'கோழிப்பண்ணை தொழில்நுட்ப & கண்டுபிடிப்பு கவுன்சிலுக்கு வரவேற்கிறோம். தமிழ்நாடு முழுவதும் உள்ள சான்றளிக்கப்பட்ட கால்நடை மருத்துவர்கள், பண்ணை ஆட்டோமேஷன் வழங்குநர்கள் மற்றும் பண்ணையாளர்களுடன் இணையுங்கள்.'
  },
  whatToDo: {
    en: 'What would you like to do today?',
    ta: 'இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?'
  },
  whatToDoSub: {
    en: 'Quick pathways to community collaboration, event participation, and technical advisory',
    ta: 'சமூக ஒத்துழைப்பு, நிகழ்வு பங்கேற்பு மற்றும் தொழில்நுட்ப ஆலோசனைகளுக்கான விரைவு வழிகள்'
  },
  upcomingEvents: {
    en: 'Upcoming Events',
    ta: 'வரவிருக்கும் நிகழ்வுகள்'
  },
  browseAllEvents: {
    en: 'Browse all events',
    ta: 'அனைத்து நிகழ்வுகளையும் காண்க'
  },
  askExpertsHub: {
    en: 'Ask Experts — Knowledge Hub',
    ta: 'நிபுணர்களிடம் கேளுங்கள் — அறிவு மையம்'
  },
  emartInnovations: {
    en: 'E-Mart — Poultry Innovations & Equipment',
    ta: 'இ-மார்ட் — கோழிப்பண்ணை உபகரணங்கள் & தீர்வுகள்'
  },
  recommendedStakeholders: {
    en: 'Recommended Stakeholders',
    ta: 'பரிந்துரைக்கப்பட்ட பங்குதாரர்கள்'
  },
  officialAdvisory: {
    en: 'Official Advisory',
    ta: 'அதிகாரப்பூர்வ ஆலோசனை'
  },
  homeExploreDirectory: {
    en: 'Explore People',
    ta: 'நபர்களை ஆராயுங்கள்'
  },
  homeExploreEvents: {
    en: 'Explore Events',
    ta: 'நிகழ்வுகளை ஆராயுங்கள்'
  },
  homeExploreAsk: {
    en: 'Explore Ask Experts',
    ta: 'நிபுணர்களிடம் கேளுங்கள்'
  },
  homeExploreEmart: {
    en: 'Explore E-Mart',
    ta: 'இ-மார்ட்டை ஆராயுங்கள்'
  },
  homeDirectoryDesc: {
    en: 'Connect with poultry farmers, veterinarians & innovators',
    ta: 'பண்ணையாளர்கள், கால்நடை மருத்துவர்கள் & கண்டுபிடிப்பாளர்களுடன் இணையுங்கள்'
  },
  homeEventsDesc: {
    en: 'Register for upcoming technical expos, summits & workshops',
    ta: 'தொழில்நுட்ப கண்காட்சிகள், மாநாடுகள் & பயிலரங்குகளில் பதிவு செய்யுங்கள்'
  },
  homeAskDesc: {
    en: 'Ask poultry health, nutrition & shed ventilation questions',
    ta: 'கோழி ஆரோக்கியம், ஊட்டச்சத்து & காற்றோட்டம் குறித்த கேள்விகளைக் கேளுங்கள்'
  },
  homeEmartDesc: {
    en: 'Explore verified shed sensors, misting kits & nutrition',
    ta: 'சரிபார்க்கப்பட்ட பண்ணை சென்சார்கள், பனிமூட்ட கருவிகள் & தீவனங்களை ஆராயுங்கள்'
  },
  homeCommunityBadge: {
    en: 'Community',
    ta: 'சமூகம்'
  },
  homeProgramsBadge: {
    en: 'Programs',
    ta: 'நிகழ்ச்சிகள்'
  },
  homeQaHubBadge: {
    en: 'Q&A Hub',
    ta: 'கேள்வி-பதில்'
  },
  homeSolutionsBadge: {
    en: 'Solutions',
    ta: 'தீர்வுகள்'
  },
  viewEvent: {
    en: 'View Event',
    ta: 'நிகழ்வு காண்க'
  },
  viewProduct: {
    en: 'View Product',
    ta: 'தயாரிப்பு காண்க'
  },
  viewProfile: {
    en: 'View Profile',
    ta: 'சுயவிவரம் காண்க'
  },
  matchingStakeholders: {
    en: 'Matching Stakeholders',
    ta: 'பொருந்தும் பங்குதாரர்கள்'
  },
  matchingEvents: {
    en: 'Matching Events',
    ta: 'பொருந்தும் நிகழ்வுகள்'
  },
  matchingProducts: {
    en: 'Matching E-Mart Innovations',
    ta: 'பொருந்தும் இ-மார்ட் தயாரிப்புகள்'
  },
  noResultsFound: {
    en: 'No results found',
    ta: 'முடிவுகள் எதுவும் கிடைக்கவில்லை'
  },

  // Directory / People Page
  dirSearchPlaceholder: {
    en: 'Search people by name, expertise, organization, location...',
    ta: 'பெயர், நிபுணத்துவம், அமைப்பின் மூலம் நபர்களைத் தேடுங்கள்...'
  },
  dirAllMembers: {
    en: 'All Members',
    ta: 'அனைத்து நபர்கள்'
  },
  dirCompany: {
    en: 'Company',
    ta: 'நிறுவனங்கள்'
  },
  dirFilterMembers: {
    en: 'Filter Members',
    ta: 'உறுப்பினர்களை வடிகட்டவும்'
  },
  dirConnections: {
    en: 'Connections',
    ta: 'இணைப்புகள்'
  },
  dirConnectionsSub: {
    en: 'All council members are automatically linked',
    ta: 'அனைத்து கவுன்சில் உறுப்பினர்களும் தானாக இணைக்கப்பட்டுள்ளனர்'
  },
  dirRecentlyJoined: {
    en: 'Recently Joined Members',
    ta: 'சமீபத்தில் இணைந்த உறுப்பினர்கள்'
  },
  dirLatestRegistered: {
    en: 'Latest registered stakeholders',
    ta: 'சமீபத்தில் பதிவு செய்த பங்குதாரர்கள்'
  },
  dirConnected: {
    en: 'Connected',
    ta: 'இணைக்கப்பட்டது'
  },
  dirConnect: {
    en: 'Connect',
    ta: 'இணைக்க'
  },
  dirBackToDirectory: {
    en: 'Back to People',
    ta: 'நபர்களுக்கு திரும்பு'
  },
  backToPeople: {
    en: 'Back to People',
    ta: 'நபர்களுக்கு திரும்பு'
  },
  dirRecommendedMembers: {
    en: 'Recommended Members',
    ta: 'பரிந்துரைக்கப்பட்ட உறுப்பினர்கள்'
  },
  dirRecommendedSubtitle: {
    en: 'Relevant peers based on expertise & domain',
    ta: 'நிபுணத்துவம் மற்றும் துறையின் அடிப்படையிலான உறுப்பினர்கள்'
  },
  dirStakeholders: {
    en: 'Stakeholders',
    ta: 'பங்குதாரர்கள்'
  },
  dirVerifiedStakeholder: {
    en: 'Verified Stakeholder',
    ta: 'சரிபார்க்கப்பட்ட பங்குதாரர்'
  },
  dirCouncilVerifiedMember: {
    en: 'PTIC Council Verified Member',
    ta: 'PTIC கவுன்சில் சரிபார்க்கப்பட்ட உறுப்பினர்'
  },
  dirSendInquiry: {
    en: 'Send Inquiry',
    ta: 'விசாரிக்க'
  },
  dirCall: {
    en: 'Call',
    ta: 'அழைக்க'
  },
  dirSaveContact: {
    en: 'Save Contact',
    ta: 'தொடர்பை சேமிக்க'
  },
  dirAboutAndBio: {
    en: 'About & Professional Background',
    ta: 'தொழில்முறை பின்னணி & விவரம்'
  },
  dirCouncilStanding: {
    en: 'Council Standing',
    ta: 'கவுன்சில் நிலை'
  },
  dirCouncilStandingDesc: {
    en: 'Active member of the PTIC Regional Advisory Panel. Engaged in commercial flock health, biosecurity standards, and technological adoption across Namakkal and Western Tamil Nadu.',
    ta: 'PTIC பிராந்திய ஆலோசனைக் குழுவின் செயலில் உள்ள உறுப்பினர். நாமக்கல் மற்றும் மேற்கு தமிழ்நாடு முழுவதும் கோழிப்பண்ணை ஆரோக்கியம், உயிரியல் பாதுகாப்பு தரநிலைகளில் தீவிரமாக ஈடுபட்டுள்ளார்.'
  },
  dirSpecialties: {
    en: 'Specialties & Key Domains',
    ta: 'நிபுணத்துவ துறைகள் & கவனம்'
  },
  dirSpecialtiesSub: {
    en: 'Verified core competencies and advisory areas acknowledged by the PTIC Board:',
    ta: 'கவுன்சில் குழுவால் அங்கீகரிக்கப்பட்ட சரிபார்க்கப்பட்ட திறன்கள்:'
  },
  dirAssociatedEnterprise: {
    en: 'Associated Enterprise',
    ta: 'தொடர்புடைய நிறுவனம்'
  },
  dirVisitWebsite: {
    en: 'Visit Website',
    ta: 'இணையதளம் செல்க'
  },
  dirOfficialContact: {
    en: 'Official Contact Details',
    ta: 'அதிகாரப்பூர்வ தொடர்பு விவரங்கள்'
  },
  dirCouncilEmail: {
    en: 'Council Email',
    ta: 'கவுன்சில் மின்னஞ்சல்'
  },
  dirPhoneHotline: {
    en: 'Phone / Hotline',
    ta: 'தொலைபேசி எண்'
  },
  dirLocationBase: {
    en: 'Location Base',
    ta: 'இருப்பிடம்'
  },
  dirDownloadContactCard: {
    en: 'Download Contact Card (.vcf)',
    ta: 'தொடர்பு அட்டையைப் பதிவிறக்கு (.vcf)'
  },
  dirSimilarMembers: {
    en: 'Similar Council Members',
    ta: 'ஒத்த கவுன்சில் உறுப்பினர்கள்'
  },
  dirEmptyTitle: {
    en: 'No stakeholders found',
    ta: 'பங்குதாரர்கள் எவரும் காணப்படவில்லை'
  },
  dirEmptyDesc: {
    en: 'Try adjusting your filter or search keywords.',
    ta: 'உங்கள் வடிகட்டி அல்லது தேடல் வார்த்தைகளை மாற்றி முயற்சிக்கவும்.'
  },
  dirClearFilters: {
    en: 'Clear Filters',
    ta: 'வடிகட்டிகளை அழிக்க'
  },
  directMessage: {
    en: 'Direct Message',
    ta: 'நேரடி செய்தி'
  },

  // Categories
  catAll: {
    en: 'All',
    ta: 'அனைத்தும்'
  },
  catFarmers: {
    en: 'Farmers',
    ta: 'பண்ணையாளர்கள்'
  },
  catVeterinarians: {
    en: 'Veterinarians',
    ta: 'கால்நடை மருத்துவர்கள்'
  },
  catPoultryIndustry: {
    en: 'Poultry Industry',
    ta: 'கோழிப்பண்ணை தொழில்'
  },
  catExperts: {
    en: 'Experts',
    ta: 'நிபுணர்கள்'
  },
  catTechProviders: {
    en: 'Technology Providers',
    ta: 'தொழில்நுட்ப நிறுவனங்கள்'
  },

  // Events Page
  eventsTitle: {
    en: 'Events',
    ta: 'நிகழ்வுகள்'
  },
  eventsSubtitle: {
    en: 'Poultry technology conventions, annual summits & expos across Tamil Nadu',
    ta: 'தமிழ்நாடு முழுவதும் கோழிப்பண்ணை தொழில்நுட்ப மாநாடுகள், உச்சி மாநாடுகள் & கண்காட்சிகள்'
  },
  eventsSearchPlaceholder: {
    en: 'Search events by title, location, category...',
    ta: 'தலைப்பு, இடம் அல்லது வகை மூலம் நிகழ்வுகளைத் தேடுங்கள்...'
  },
  eventsConferenceExpo: {
    en: 'Conference & Expo',
    ta: 'மாநாடு & கண்காட்சி'
  },
  eventsTechnicalWorkshop: {
    en: 'Technical Workshop',
    ta: 'தொழில்நுட்ப பயிலரங்கு'
  },
  eventsVirtualSeminar: {
    en: 'Virtual Seminar',
    ta: 'இணைய கருத்தரங்கு'
  },
  eventsAttending: {
    en: 'Attending',
    ta: 'பங்கேற்கிறேன்'
  },
  eventsInterested: {
    en: 'Interested',
    ta: 'ஆர்வம் உள்ளது'
  },
  eventsRegisterNow: {
    en: 'Register Now',
    ta: 'பதிவு செய்க'
  },
  bookNow: {
    en: 'Book Now',
    ta: 'முன்பதிவு செய்க'
  },
  eventsViewPass: {
    en: 'View Pass',
    ta: 'நுழைவுச்சீட்டு காண்க'
  },
  eventsViewAgenda: {
    en: 'Official Agenda',
    ta: 'அதிகாரப்பூர்வ நிகழ்ச்சி நிரல்'
  },
  eventsDownloadFlyer: {
    en: 'Download Flyer',
    ta: 'கையேட்டைப் பதிவிறக்கு'
  },
  eventsCoordinators: {
    en: 'Event Coordinators',
    ta: 'நிகழ்வு ஒருங்கிணைப்பாளர்கள்'
  },
  eventsSponsors: {
    en: 'Sponsors & Exhibitors',
    ta: 'ஸ்பான்சர்கள் & கண்காட்சியாளர்கள்'
  },
  eventsGuidelines: {
    en: 'Delegate Guidelines',
    ta: 'பங்கேற்பாளர் வழிகாட்டுதல்கள்'
  },
  eventsModeInPerson: {
    en: 'In-Person',
    ta: 'நேரில்'
  },
  eventsModeVirtual: {
    en: 'Virtual',
    ta: 'இணையவழியில்'
  },
  eventsModeHybrid: {
    en: 'Hybrid',
    ta: 'ஹைப்ரிட்'
  },
  eventsBrochureReady: {
    en: 'Brochure & Agenda Ready',
    ta: 'கையேடு & நிகழ்ச்சி நிரல் தயார்'
  },
  eventsDelegatesAttending: {
    en: 'delegates attending',
    ta: 'பங்கேற்பாளர்கள் கலந்து கொள்கிறார்கள்'
  },
  eventsRegisteredBadge: {
    en: 'Registered',
    ta: 'பதிவு செய்யப்பட்டது'
  },
  eventsNoEvents: {
    en: 'No events found',
    ta: 'நிகழ்வுகள் எதுவும் காணப்படவில்லை'
  },
  eventsNoEventsDesc: {
    en: 'Try selecting a different category or adjusting your search term.',
    ta: 'வேறு வகையைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் தேடல் வார்த்தைகளை மாற்றவும்.'
  },
  eventsRegisterModalTitle: {
    en: 'Event Delegate Registration',
    ta: 'நிகழ்வு பிரதிநிதி பதிவு'
  },
  eventsRegisterModalDesc: {
    en: 'Confirm your credentials for official PTIC Council Delegate accreditation.',
    ta: 'அதிகாரப்பூர்வ PTIC கவுன்சில் பிரதிநிதி அங்கீகாரத்திற்கு உங்கள் விவரங்களை உறுதிப்படுத்தவும்.'
  },
  eventsFullName: {
    en: 'Full Name',
    ta: 'முழு பெயர்'
  },
  eventsOrganization: {
    en: 'Enterprise / Farm Name',
    ta: 'நிறுவனம் / பண்ணையின் பெயர்'
  },
  eventsDesignation: {
    en: 'Designation / Role',
    ta: 'பதவி / பங்கு'
  },
  eventsPhone: {
    en: 'Phone Number',
    ta: 'தொலைபேசி எண்'
  },
  eventsEmail: {
    en: 'Email Address',
    ta: 'மின்னஞ்சல் முகவரி'
  },
  eventsConfirmRegistration: {
    en: 'Confirm & Issue Delegate Pass',
    ta: 'பதிவை உறுதி செய்து நுழைவுச்சீட்டு பெறுக'
  },
  eventsPassModalTitle: {
    en: 'Council Delegate Pass',
    ta: 'கவுன்சில் பிரதிநிதி நுழைவுச்சீட்டு'
  },
  eventsPassIssued: {
    en: 'Official delegate pass issued by Poultry Technology & Innovation Council',
    ta: 'கோழிப்பண்ணை தொழில்நுட்ப & கண்டுபிடிப்பு கவுன்சிலால் வழங்கப்பட்ட அதிகாரப்பூர்வ பாஸ்'
  },
  eventsPassNumber: {
    en: 'Pass Number',
    ta: 'பாஸ் எண்'
  },
  eventsDownloadPass: {
    en: 'Download Pass PDF',
    ta: 'நுழைவுச்சீட்டைப் பதிவிறக்கு (PDF)'
  },
  eventsClosePass: {
    en: 'Close Pass',
    ta: 'மூடு'
  },
  overview: {
    en: 'Overview',
    ta: 'கண்ணோட்டம்'
  },
  speakers: {
    en: 'Speakers',
    ta: 'பேச்சாளர்கள்'
  },
  schedule: {
    en: 'Schedule',
    ta: 'அட்டவணை'
  },
  registration: {
    en: 'Registration',
    ta: 'பதிவு'
  },

  // E-Mart Page
  emartTitle: {
    en: 'E-Mart',
    ta: 'இ-மார்ட்'
  },
  emartSubtitle: {
    en: 'Verified poultry technology innovations, equipment & farm automation solutions',
    ta: 'சரிபார்க்கப்பட்ட கோழிப்பண்ணை தொழில்நுட்ப கண்டுபிடிப்புகள், உபகரணங்கள் & பண்ணை ஆட்டோமேஷன்'
  },
  emartSearchPlaceholder: {
    en: 'Search sensors, misting nozzles, probiotics, automation...',
    ta: 'சென்சார்கள், பனிமூட்ட அமைப்புகள், புரோபயாடிக்குகள், ஆட்டோமேஷன் தேடுங்கள்...'
  },
  emartAddProduct: {
    en: 'Add Product',
    ta: 'பொருள் சேர்க்க'
  },
  addProduct: {
    en: 'Add Product',
    ta: 'பொருள் சேர்க்க'
  },
  emartEnquire: {
    en: 'Enquire Now',
    ta: 'விசாரிக்க'
  },
  enquireNow: {
    en: 'Enquire Now',
    ta: 'விசாரிக்க'
  },
  emartInStock: {
    en: 'In Stock & Verified',
    ta: 'இருப்பில் உள்ளது (சரிபார்க்கப்பட்டது)'
  },
  inStock: {
    en: 'In Stock',
    ta: 'இருப்பில் உள்ளது'
  },
  emartTechHardware: {
    en: 'Technology & Hardware',
    ta: 'தொழில்நுட்பம் & வன்பொருள்'
  },
  emartShedEquipment: {
    en: 'Shed Equipment',
    ta: 'பண்ணை உபகரணங்கள்'
  },
  emartNutritionFeed: {
    en: 'Nutrition & Feed',
    ta: 'ஊட்டச்சத்து & தீவனம்'
  },
  emartFarmAutomation: {
    en: 'Farm Automation',
    ta: 'பண்ணை ஆட்டோமேஷன்'
  },
  emartEstimatedCost: {
    en: 'Estimated Cost',
    ta: 'மதிப்பிடப்பட்ட விலை'
  },
  emartViewDetails: {
    en: 'View Details',
    ta: 'விவரங்களைப் பார்க்க'
  },
  emartNoProducts: {
    en: 'No products found',
    ta: 'பொருட்கள் எதுவும் காணப்படவில்லை'
  },
  emartNoProductsDesc: {
    en: 'Try adjusting your search query or category filters.',
    ta: 'உங்கள் தேடல் அல்லது வகை வடிகட்டிகளை மாற்றி முயற்சிக்கவும்.'
  },
  emartAddProductModalTitle: {
    en: 'List New Product on E-Mart',
    ta: 'இ-மார்ட்டில் புதிய பொருளைப் பட்டியலிட'
  },
  emartAddProductModalDesc: {
    en: 'Publish poultry technology hardware, automated equipment or nutrition supplies to council members.',
    ta: 'கவுன்சில் உறுப்பினர்களுக்காக கோழிப்பண்ணை தொழில்நுட்ப வன்பொருள், உபகரணங்கள் அல்லது தீவனங்களை வெளியிடவும்.'
  },
  emartProductTitle: {
    en: 'Product Title',
    ta: 'பொருளின் பெயர்'
  },
  emartCategoryLabel: {
    en: 'Category',
    ta: 'வகை'
  },
  emartProviderLabel: {
    en: 'Provider / Company',
    ta: 'வழங்குநர் / நிறுவனம்'
  },
  emartTagLabel: {
    en: 'Highlight Badge / Tag',
    ta: 'சிறப்பம்ச குறிச்சொல்'
  },
  emartPriceLabel: {
    en: 'Indicative Price',
    ta: 'உத்தேச விலை'
  },
  emartDescriptionLabel: {
    en: 'Description & Features',
    ta: 'விளக்கம் & சிறப்பம்சங்கள்'
  },
  emartImageUrlLabel: {
    en: 'Image URL (optional)',
    ta: 'பட இணைப்பு (விருப்பத்தேர்வு)'
  },
  emartPublishBtn: {
    en: 'Publish Product to E-Mart',
    ta: 'இ-மார்ட்டில் பொருளை வெளியிடவும்'
  },
  emartDetailModalTitle: {
    en: 'Product Specifications & Sourcing',
    ta: 'பொருளின் விவரக்குறிப்புகள் & கொள்முதல்'
  },
  emartOfficialSupplier: {
    en: 'PTIC Verified Equipment Supplier',
    ta: 'PTIC சரிபார்க்கப்பட்ட உபகரண வழங்குநர்'
  },
  emartSendCouncilEnquiry: {
    en: 'Send Council Enquiry',
    ta: 'கவுன்சில் விசாரணையை அனுப்பு'
  },

  // Ask Experts Page
  askTitle: {
    en: 'Ask Experts',
    ta: 'நிபுணர்களிடம் கேளுங்கள்'
  },
  askSubtitle: {
    en: 'Direct consultation on flock mortality, disease diagnostics, ventilation & nutrition',
    ta: 'மந்தை ஆரோக்கியம், இறப்பு குறைப்பு, காற்றோட்டம் & ஊட்டச்சத்து குறித்த நேரடி ஆலோசனை'
  },
  askSearchPlaceholder: {
    en: 'Search questions, discussions, symptoms...',
    ta: 'கேள்விகள், அறிகுறிகள், தலைப்புகளைத் தேடுங்கள்...'
  },
  askQuestionBtn: {
    en: 'Ask a Question',
    ta: 'கேள்வி கேளுங்கள்'
  },
  askPoultryHealth: {
    en: 'Poultry Health',
    ta: 'கோழி ஆரோக்கியம்'
  },
  askVentilationClimate: {
    en: 'Ventilation & Climate',
    ta: 'காற்றோட்டம் & காலநிலை'
  },
  askNutritionFeed: {
    en: 'Nutrition & Feed',
    ta: 'ஊட்டச்சத்து & தீவனம்'
  },
  askTechAutomation: {
    en: 'Technology & Automation',
    ta: 'தொழில்நுட்பம் & ஆட்டோமேஷன்'
  },
  askAnswersCount: {
    en: 'Answers',
    ta: 'பதில்கள்'
  },
  askHelpful: {
    en: 'Helpful',
    ta: 'பயனுள்ளது'
  },
  askWriteAnswer: {
    en: 'Write an Answer',
    ta: 'பதிலளிக்க'
  },
  askResolved: {
    en: 'Resolved by Expert',
    ta: 'நிபுணரால் தீர்க்கப்பட்டது'
  },
  askActiveDiscussion: {
    en: 'Active Discussion',
    ta: 'செயலில் உள்ள விவாதம்'
  },
  askReadAndAnswer: {
    en: 'Read & Answer',
    ta: 'படித்து பதிலளிக்கவும்'
  },
  askNoQuestions: {
    en: 'No questions found',
    ta: 'கேள்விகள் எதுவும் காணப்படவில்லை'
  },
  askNoQuestionsDesc: {
    en: 'Try selecting a different topic or ask the first question to the panel.',
    ta: 'வேறு தலைப்பைத் தேர்ந்தெடுக்கவும் அல்லது நிபுணர் குழுவிடம் முதல் கேள்வியைக் கேட்கவும்.'
  },
  askModalTitle: {
    en: 'Submit a Question to Council Experts',
    ta: 'கவுன்சில் நிபுணர்களிடம் கேள்வி கேட்க'
  },
  askModalDesc: {
    en: 'Avian veterinarians, flock nutritionists, and shed engineers will review and respond.',
    ta: 'கால்நடை மருத்துவர்கள், ஊட்டச்சத்து நிபுணர்கள் மற்றும் பொறியாளர்கள் பரிசீலித்து பதிலளிப்பார்கள்.'
  },
  askModalQuestionTitle: {
    en: 'Question Title / Problem Summary',
    ta: 'கேள்வியின் தலைப்பு / பிரச்சனையின் சுருக்கம்'
  },
  askModalCategory: {
    en: 'Domain Category',
    ta: 'துறை வகை'
  },
  askSubmitQuestionBtn: {
    en: 'Submit Question to Panel',
    ta: 'கேள்வியை சமர்ப்பிக்கவும்'
  },
  askDetailTitle: {
    en: 'Expert Discussion & Clinical Insights',
    ta: 'நிபுணர் கலந்துரையாடல் & மருத்துவ ஆலோசனைகள்'
  },
  askYourAnswerPlaceholder: {
    en: 'Write your clinical insight, recommendation, or field experience...',
    ta: 'உங்கள் மருத்துவ ஆலோசனை, பரிந்துரை அல்லது கள அனுபவத்தை எழுதுங்கள்...'
  },
  askPostAnswerBtn: {
    en: 'Post Answer',
    ta: 'பதிலை சமர்ப்பிக்கவும்'
  },

  // Feedback, alerts and notifications
  notificationsTitle: {
    en: 'Council Notifications',
    ta: 'கவுன்சில் அறிவிப்புகள்'
  },
  notificationsDesc: {
    en: 'Advisories, event alerts, and expert updates',
    ta: 'ஆலோசனைகள், நிகழ்வு எச்சரிக்கைகள் மற்றும் நிபுணர் தகவல்கள்'
  },
  inboxTitle: {
    en: 'Council Messaging Hub',
    ta: 'கவுன்சில் செய்திகள் மையம்'
  },
  inboxDesc: {
    en: 'Direct correspondence between council stakeholders',
    ta: 'கவுன்சில் உறுப்பினர்களிடையே நேரடி தொடர்பு'
  },
  searchModalTitle: {
    en: 'Global Council Search',
    ta: 'முழுமையான கவுன்சில் தேடல்'
  },
  searchModalDesc: {
    en: 'Search stakeholders, technical events, innovations & expert discussions',
    ta: 'உறுப்பினர்கள், நிகழ்வுகள், கண்டுபிடிப்புகள் & விவாதங்களை தேடுங்கள்'
  },
};

// Build reverse lookup index for instant fallback by English text
const ENGLISH_TO_TAMIL_LOOKUP: Record<string, string> = {};
Object.values(TRANSLATIONS).forEach((entry) => {
  ENGLISH_TO_TAMIL_LOOKUP[entry.en.trim().toLowerCase()] = entry.ta;
});

// Additional direct phrase mappings for common UI text
const COMMON_PHRASES: Record<string, string> = {
  'home': 'முகப்பு',
  'people': 'நபர்கள்',
  'events': 'நிகழ்வுகள்',
  'e-mart': 'இ-மார்ட்',
  'emart': 'இ-மார்ட்',
  'ask experts': 'நிபுணர்களிடம் கேளுங்கள்',
  'messaging': 'செய்திகள்',
  'notifications': 'அறிவிப்புகள்',
  'settings': 'அமைப்புகள்',
  'settings & privacy': 'அமைப்புகள் & தனியுரிமை',
  'search': 'தேடுக',
  'view details': 'விவரங்களைப் பார்க்க',
  'save': 'சேமிக்க',
  'cancel': 'ரத்து செய்',
  'submit': 'சமர்ப்பிக்க',
  'loading...': 'ஏற்றப்படுகிறது...',
  'loading': 'ஏற்றப்படுகிறது...',
  'try again': 'மீண்டும் முயற்சிக்கவும்',
  'appearance': 'தோற்றம்',
  'theme': 'தீம்',
  'light': 'வெளிச்சம்',
  'dark': 'இருள்',
  'system default': 'கணினி இயல்புநிலை',
  'language': 'மொழி',
  'english': 'English',
  'tamil': 'தமிழ்',
  'all': 'அனைத்தும்',
  'filter': 'வடிகட்டு',
  'clear': 'அழிக்க',
  'clear search': 'தேடலை அழிக்க',
  'close': 'மூடு',
  'back': 'பின்னோக்கி',
  'share': 'பகிர்',
  'download': 'பதிவிறக்கு',
  'connect': 'இணைக்க',
  'connected': 'இணைக்கப்பட்டது',
  'send': 'அனுப்பு',
  'call': 'அழைக்க',
  'profile': 'சுயவிவரம்',
  'me': 'நான்',
  'view profile': 'சுயவிவரம் காண்க',
  'view event': 'நிகழ்வு காண்க',
  'view product': 'தயாரிப்பு காண்க',
  'direct message': 'நேரடி செய்தி',
  'in stock': 'இருப்பில் உள்ளது',
  'out of stock': 'இருப்பு இல்லை',
  'price': 'விலை',
  'date': 'தேதி',
  'location': 'இருப்பிடம்',
  'category': 'வகை',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'ptic-language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'தமிழ்' || saved === 'ta') return 'தமிழ்';
      if (saved === 'EN' || saved === 'en') return 'EN';
    } catch (e) {
      // ignore
    }
    return 'EN';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = language === 'EN' ? 'தமிழ்' : 'EN';
    setLanguage(next);
  }, [language, setLanguage]);

  const t = useCallback((key: string, fallback?: string): string => {
    if (!key) return fallback || '';

    // 1. Exact match in dictionary
    if (TRANSLATIONS[key]) {
      return language === 'தமிழ்' ? TRANSLATIONS[key].ta : TRANSLATIONS[key].en;
    }

    // 2. Normalized dot or camelCase variation
    const cleanKey = key.trim();
    const dotKey = cleanKey.includes('.') ? cleanKey.replace(/\.([a-z])/g, (_, letter) => letter.toUpperCase()) : cleanKey;
    if (TRANSLATIONS[dotKey]) {
      return language === 'தமிழ்' ? TRANSLATIONS[dotKey].ta : TRANSLATIONS[dotKey].en;
    }

    // 3. If English requested and key is already readable English
    if (language === 'EN') {
      return fallback || key;
    }

    // 4. Tamil requested: Reverse match against English dictionary values
    const lowerKey = cleanKey.toLowerCase();
    if (ENGLISH_TO_TAMIL_LOOKUP[lowerKey]) {
      return ENGLISH_TO_TAMIL_LOOKUP[lowerKey];
    }

    // 5. Common phrase fallback
    if (COMMON_PHRASES[lowerKey]) {
      return COMMON_PHRASES[lowerKey];
    }

    return fallback || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
