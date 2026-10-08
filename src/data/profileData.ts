export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  documentUrl?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  unit: string;
  features: string[];
  availability: 'In Stock' | 'Made to Order' | 'Available on Request';
  verificationStatus: 'PTIC Verified' | 'Pending Review';
  imageUrl: string;
}

export interface BusinessLocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Headquarters' | 'Commercial Farm / Shed' | 'Hatchery' | 'Processing Facility' | 'Branch Office';
  isPrimary: boolean;
  googleMapsUrl: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  avatarUrl: string;
  designation: string;
  email: string;
  phone: string;
  role: 'Founder / Owner' | 'Farm Manager' | 'Technical Specialist' | 'Veterinary Consultant' | 'Supervisor';
}

export interface PersonalProfileData {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: string;
  location: string;
  initials: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  specialties: string[];
  keyDomains: string[];
  professionalSummary: string;
  dateOfBirth: string;
  gender: string;
  languages: string[];
  phone: string;
  email: string;
  yearsExperience: number | string;
  industry: string;
  stakeholderType: string;
  areaOfWork: string[];
  visibility: {
    dob: 'Public' | 'Members Only' | 'Private';
    gender: 'Public' | 'Members Only' | 'Private';
    phone: 'Public' | 'Members Only' | 'Private';
    email: 'Public' | 'Members Only' | 'Private';
  };
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  participationStats: {
    eventsAttended: number;
    eventsRegistered: number;
    connectionsCount: number;
    questionsAsked: number;
    expertAnswers: number;
    contributionsCount: number;
  };
  participationInterests: string[];
  areasOfContribution: string[];
  communityInterests: string[];
  verification: {
    email: boolean;
    mobile: boolean;
    identity: boolean;
    professionalDetails: boolean;
    organization: boolean;
  };
}

export interface FullBusinessProfileData {
  id: string;
  name: string;
  tagline: string;
  initials: string;
  logoUrl: string;
  coverUrl: string;
  category: string;
  type: string;
  industry: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  description: string;
  mission: string;
  vision: string;
  keyDomains: string[];
  businessCategories: string[];
  products: ProductItem[];
  locations: BusinessLocationItem[];
  teamMembers: TeamMemberItem[];
  certifications: CertificationItem[];
  socials: {
    whatsapp?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface ConnectedMember {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  avatarUrl: string;
  initials: string;
}

// ============================================================
// INITIAL MOCK DATA
// ============================================================

export const INITIAL_PERSONAL_PROFILE: PersonalProfileData = {
  id: 'u0',
  name: 'Karthik Rajan',
  role: 'Poultry Farm Owner & Commercial Broiler Producer',
  organization: 'Rajan Poultry Farms',
  category: 'Commercial Farmer',
  location: 'Namakkal, Tamil Nadu',
  initials: 'KR',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
  bio: 'Managing 40,000 broilers across 3 tunnel-ventilated sheds in Namakkal district. Passionate about IoT climate automation, flock biosecurity, and antibiotic-free sustainable poultry farming.',
  specialties: [
    'Farm Automation',
    'IoT & Sensors',
    'Broiler Production',
    'Climate Control',
    'Biosecurity',
    'Feed Optimization'
  ],
  keyDomains: ['Broiler Production', 'Climate Automation', 'Biosecurity Protocols', 'Flock Health'],
  professionalSummary: 'Over 15 years of operational excellence in commercial broiler husbandry, managing environmental control systems, feed conversion ratios (FCR < 1.55), and strict bio-exclusion zones in Western Tamil Nadu.',
  dateOfBirth: '1985-06-14',
  gender: 'Male',
  languages: ['English', 'தமிழ் (Tamil)'],
  phone: '+91 98421 54321',
  email: 'karthik.rajan@rajanpoultry.in',
  yearsExperience: 15,
  industry: 'Commercial Broiler & Layer Production',
  stakeholderType: 'Commercial Poultry Farmer',
  areaOfWork: ['Broiler Growing', 'Tunnel Ventilation', 'Biosecurity Protocols', 'Feed Milling'],
  visibility: {
    dob: 'Private',
    gender: 'Members Only',
    phone: 'Members Only',
    email: 'Members Only',
  },
  experiences: [
    {
      id: 'exp-1',
      title: 'Proprietor & Operations Lead',
      company: 'Rajan Poultry Farms & Hatcheries',
      startDate: '2011',
      endDate: 'Present',
      isCurrent: true,
      description: 'Overseeing daily operations of 3 modern tunnel-ventilated broiler sheds with 40,000 bird capacity. Implemented automated foggers, ammonia sensors, and bio-bubble sanitation protocols.',
    },
    {
      id: 'exp-2',
      title: 'Assistant Farm Supervisor',
      company: 'Namakkal Integrated Broilers',
      startDate: '2008',
      endDate: '2011',
      isCurrent: false,
      description: 'Supervised flock mortality audits, vaccination timetables, and nipple drinking line sanitation across 4 contract grower units.',
    }
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'Tamil Nadu Veterinary and Animal Sciences University (TANUVAS)',
      degree: 'Diploma in Poultry Farm Management',
      fieldOfStudy: 'Poultry Science & Biosecurity',
      startYear: '2005',
      endYear: '2008',
      description: 'Rigorous coursework in avian physiology, flock epidemiology, feed formulation, and environmentally controlled shed design.',
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Biosecurity Practitioner (Poultry)',
      issuingOrganization: 'PTIC Council & TANUVAS',
      issueDate: '2021-03',
      expiryDate: '2026-03',
      credentialId: 'PTIC-BIO-2021-049',
      credentialUrl: 'https://ptic-council.org/credentials/049',
    },
    {
      id: 'cert-2',
      name: 'Automated Environmental Shed Control Masterclass',
      issuingOrganization: 'Western India Poultry Association (WIPA)',
      issueDate: '2023-08',
      expiryDate: 'Lifetime',
      credentialId: 'WIPA-ENV-882',
      credentialUrl: 'https://wipa.org/cert/882',
    }
  ],
  participationStats: {
    eventsAttended: 8,
    eventsRegistered: 12,
    connectionsCount: 38,
    questionsAsked: 5,
    expertAnswers: 14,
    contributionsCount: 9,
  },
  participationInterests: [
    'Technical Webinars',
    'Poultry Expos',
    'Farmer Training Camps',
    'Biosecurity Workshops'
  ],
  areasOfContribution: [
    'Field Mentorship',
    'Regional Chapter Organizing',
    'Ammonia Sensor Case Studies'
  ],
  communityInterests: [
    'Solar Energy in Poultry Sheds',
    'Alternative Protein Feed Formulations',
    'Export Standards Compliance'
  ],
  verification: {
    email: true,
    mobile: true,
    identity: true,
    professionalDetails: true,
    organization: true,
  }
};

export const INITIAL_BUSINESS_PROFILES: FullBusinessProfileData[] = [
  {
    id: 'b1',
    name: 'Rajan Poultry Farms & Hatcheries',
    tagline: 'Sustainable, High-Performance Broiler Growing & Nursery',
    initials: 'RP',
    logoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    category: 'Commercial Broiler & Layer Production',
    type: 'Sole Proprietorship',
    industry: 'Commercial Broiler & Layer Production',
    location: 'Namakkal, Tamil Nadu',
    website: 'https://rajanpoultry.example.in',
    phone: '+91 98421 54321',
    email: 'contact@rajanpoultry.example.in',
    description: 'Premier commercial broiler enterprise in Namakkal district operating automated climate control and rigorous biosecurity protocols with 40,000 bird capacity.',
    mission: 'To deliver high-quality, ethically raised broiler flocks with industry-leading FCR while maintaining zero antibiotic misuse and strict animal welfare.',
    vision: 'To establish Western Tamil Nadu benchmark smart poultry facilities through continuous adoption of IoT, clean energy, and bio-secure waste processing.',
    keyDomains: ['Broiler Production', 'Day-Old Chicks (DOC) Nursery', 'Manure Composting', 'Contract Growing'],
    businessCategories: ['Commercial Poultry', 'Contract Growing', 'Bio-fertilizer Distribution'],
    products: [
      {
        id: 'prod-1',
        name: 'Premium Broiler Live Birds (COBB 430Y)',
        category: 'Commercial Broilers',
        price: '₹ 118',
        unit: 'per kg (farmgate)',
        description: 'Uniform, robust live birds raised in computer-monitored climate-controlled sheds with low mortality and optimal feed conversion.',
        features: ['Avg Bodyweight 2.2 kg', 'FCR 1.52 - 1.58', 'Antibiotic-Residue Free', 'Daily Health Audited'],
        availability: 'In Stock',
        verificationStatus: 'PTIC Verified',
        imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-2',
        name: 'Day-Old Chicks (DOC) Nursery Brooding',
        category: 'Nursery & Hatchery',
        price: '₹ 38',
        unit: 'per chick',
        description: 'Temperature-controlled brooding service for day-old chicks during critical first 7 days, boosting early livability and uniform feathering.',
        features: ['Infrared Radiant Brooding', 'Electrolyte Pre-hydration', 'ND/IB Vaccination Done', 'Livability 99.2%'],
        availability: 'In Stock',
        verificationStatus: 'PTIC Verified',
        imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-3',
        name: 'Fermented Poultry Manure Compost',
        category: 'Organic Bio-fertilizer',
        price: '₹ 320',
        unit: 'per 50 kg bag',
        description: 'High nitrogen-phosphorus composted organic manure dried and treated with beneficial trichoderma microbes for horticulture.',
        features: ['Weed Seed Free', 'Rich in NPK Organics', 'Odor Neutralized', 'Bulk Delivery Available'],
        availability: 'In Stock',
        verificationStatus: 'PTIC Verified',
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
      }
    ],
    locations: [
      {
        id: 'loc-1',
        name: 'Central Broiler Farm & HQ (Sheds 1 & 2)',
        address: 'SF No. 248/2, Mohanur Road, Paramathi Velur Taluk',
        city: 'Namakkal',
        state: 'Tamil Nadu',
        pincode: '637207',
        type: 'Commercial Farm / Shed',
        isPrimary: true,
        googleMapsUrl: 'https://maps.google.com/?q=Namakkal+Tamil+Nadu',
      },
      {
        id: 'loc-2',
        name: 'Nursery Brooding Yard (Shed 3)',
        address: 'SF No. 89/1B, Puduchatram Bypass',
        city: 'Namakkal',
        state: 'Tamil Nadu',
        pincode: '637018',
        type: 'Hatchery',
        isPrimary: false,
        googleMapsUrl: 'https://maps.google.com/?q=Puduchatram+Namakkal',
      }
    ],
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Karthik Rajan',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        designation: 'Farm Owner & General Manager',
        email: 'karthik.rajan@rajanpoultry.in',
        phone: '+91 98421 54321',
        role: 'Founder / Owner',
      },
      {
        id: 'tm-2',
        name: 'M. Selvakumar',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        designation: 'Senior Shed Operations Supervisor',
        email: 'selvakumar@rajanpoultry.in',
        phone: '+91 94432 87654',
        role: 'Farm Manager',
      },
      {
        id: 'tm-3',
        name: 'Dr. S. Gayathri',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813589-a79fffa2f44a?auto=format&fit=crop&w=300&q=80',
        designation: 'Consulting Avian Veterinarian',
        email: 'gayathri.vet@rajanpoultry.in',
        phone: '+91 98433 11223',
        role: 'Veterinary Consultant',
      }
    ],
    certifications: [
      {
        id: 'bcert-1',
        name: 'ISO 22000:2018 Food Safety Management in Poultry',
        issuingOrganization: 'Bureau Veritas Quality Certification',
        issueDate: '2022-09-15',
        expiryDate: '2025-09-14',
        credentialId: 'BV-FSMS-IN-88912',
        credentialUrl: 'https://bureauveritas.com',
      },
      {
        id: 'bcert-2',
        name: 'Tamil Nadu Pollution Control Board (TNPCB) Consent to Operate',
        issuingOrganization: 'TNPCB Namakkal District Office',
        issueDate: '2020-04-01',
        expiryDate: '2030-03-31',
        credentialId: 'TNPCB/NKL/CTO/2020/0942',
        credentialUrl: 'https://tnpcb.gov.in',
      }
    ],
    socials: {
      whatsapp: '+91 98421 54321',
      linkedin: 'https://linkedin.com/company/rajan-poultry',
      twitter: '@RajanPoultryTN',
      facebook: 'https://facebook.com/rajanpoultry',
    }
  },
  {
    id: 'b2',
    name: 'Kongu Agro Automation Solutions',
    tagline: 'Precision Poultry Climate & Biosecurity Systems',
    initials: 'KA',
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    category: 'Poultry Technology & Equipment',
    type: 'Partnership Firm',
    industry: 'Poultry Technology & Equipment',
    location: 'Salem & Namakkal, Tamil Nadu',
    website: 'https://konguagroautomation.example.in',
    phone: '+91 97890 12345',
    email: 'info@konguagro.example.in',
    description: 'Engineering and field support team providing turnkey shed automation, ventilation curtains, and solar backup systems for Western Tamil Nadu poultry sheds.',
    mission: 'To democratize precision poultry technology for small and medium farmers across South India.',
    vision: 'Smart, zero-loss poultry housing powered by indigenous IoT hardware.',
    keyDomains: ['Shed Fogger Installation', 'Automatic Water Sanitation', 'Ammonia Sensor Maintenance'],
    businessCategories: ['Automation Equipment', 'Engineering Services'],
    products: [
      {
        id: 'prod-k1',
        name: 'Turnkey High-Pressure Fogger System',
        category: 'Climate Automation',
        price: '₹ 45,000',
        unit: 'per shed',
        description: 'Complete 70-bar ceramic nozzle misting kit for temperature reduction up to 6°C during peak summer.',
        features: ['Italian Triplex Pump', 'Anti-Drip Nozzles', 'Auto-Cycle Timer', '1 Year Warranty'],
        availability: 'In Stock',
        verificationStatus: 'PTIC Verified',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      }
    ],
    locations: [
      {
        id: 'loc-k1',
        name: 'Technology Center & Workshop',
        address: '14/B, SIDCO Industrial Estate, Five Roads',
        city: 'Salem',
        state: 'Tamil Nadu',
        pincode: '636004',
        type: 'Headquarters',
        isPrimary: true,
        googleMapsUrl: 'https://maps.google.com/?q=Salem+Tamil+Nadu',
      }
    ],
    teamMembers: [
      {
        id: 'tm-k1',
        name: 'Priya Subramaniam',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        designation: 'Managing Partner & Solutions Architect',
        email: 'priya@konguagro.example.in',
        phone: '+91 97890 12345',
        role: 'Founder / Owner',
      }
    ],
    certifications: [
      {
        id: 'cert-k1',
        name: 'MSME Registered Poultry Tech Provider',
        issuingOrganization: 'Govt of India Ministry of MSME',
        issueDate: '2021-06-10',
        expiryDate: 'Lifetime',
        credentialId: 'UDYAM-TN-24-0019284',
        credentialUrl: 'https://udyamregistration.gov.in',
      }
    ],
    socials: {
      whatsapp: '+91 97890 12345',
      linkedin: 'https://linkedin.com/company/kongu-agro-automation',
    }
  }
];

export const MOCK_CONNECTIONS_LIST: ConnectedMember[] = [
  {
    id: 'u1',
    name: 'Dr. Arun Kumar',
    role: 'Senior Poultry Veterinarian',
    organization: 'VetCare Poultry Services',
    location: 'Namakkal, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'AK',
  },
  {
    id: 'u2',
    name: 'Priya Subramaniam',
    role: 'Founder & CEO',
    organization: 'AgriTech Solutions',
    location: 'Coimbatore, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'PS',
  },
  {
    id: 'u3',
    name: 'Rajesh Murugan',
    role: 'Operations Director',
    organization: 'Srinivasa Poultry Integrations',
    location: 'Salem, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'RM',
  },
  {
    id: 'u4',
    name: 'Dr. Meenakshi Sundaram',
    role: 'Avian Nutrition Scientist',
    organization: 'TANUVAS Poultry Research',
    location: 'Chennai, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'MS',
  },
  {
    id: 'u5',
    name: 'Suresh Venkatachalam',
    role: 'Managing Partner',
    organization: 'Kongu Feed Mills',
    location: 'Erode, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'SV',
  },
  {
    id: 'u6',
    name: 'Anitha Balakrishnan',
    role: 'Biosecurity Specialist',
    organization: 'Tamil Nadu Poultry Council',
    location: 'Namakkal, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    initials: 'AB',
  }
];

// ============================================================
// DYNAMIC SCORE CALCULATIONS
// ============================================================

export interface ScoreBreakdownCategory {
  name: string;
  weight: number;
  score: number;
  isComplete: boolean;
  details: string;
}

export interface ProfileScoreResult {
  totalScore: number;
  status: 'Needs Work' | 'Intermediate' | 'Good' | 'Excellent';
  categories: ScoreBreakdownCategory[];
}

export function calculatePersonalProfileScore(p: PersonalProfileData): ProfileScoreResult {
  // 1. Basic Information (weight: 20%)
  const basicItems = [
    Boolean(p.name?.trim()),
    Boolean(p.location?.trim()),
    Boolean(p.phone?.trim()),
    Boolean(p.email?.trim()),
    Boolean(p.avatarUrl?.trim()),
    Boolean(p.coverUrl?.trim())
  ];
  const basicCount = basicItems.filter(Boolean).length;
  const basicScore = Math.round((basicCount / basicItems.length) * 20);

  // 2. Professional Details (weight: 20%)
  const profItems = [
    Boolean(p.role?.trim()),
    Boolean(p.organization?.trim()),
    Boolean(p.industry?.trim()),
    Boolean(p.yearsExperience),
    Boolean(p.stakeholderType?.trim())
  ];
  const profCount = profItems.filter(Boolean).length;
  const profScore = Math.round((profCount / profItems.length) * 20);

  // 3. Expertise (weight: 15%)
  let expScore = 0;
  if (p.specialties.length >= 3) expScore = 15;
  else if (p.specialties.length === 2) expScore = 10;
  else if (p.specialties.length === 1) expScore = 5;

  // 4. Experience (weight: 15%)
  let workScore = 0;
  if (p.experiences.length >= 2) workScore = 15;
  else if (p.experiences.length === 1) workScore = 10;

  // 5. Education & Certifications (weight: 15%)
  const totalCertsEdu = p.educations.length + p.certifications.length;
  let eduScore = 0;
  if (totalCertsEdu >= 2) eduScore = 15;
  else if (totalCertsEdu === 1) eduScore = 10;

  // 6. PTIC Participation (weight: 15%)
  const interestCount = (p.participationInterests?.length || 0) + (p.areasOfContribution?.length || 0);
  let pticScore = 0;
  if (interestCount >= 4) pticScore = 15;
  else if (interestCount >= 2) pticScore = 10;
  else if (interestCount >= 1) pticScore = 5;

  const total = Math.min(100, basicScore + profScore + expScore + workScore + eduScore + pticScore);

  let status: 'Needs Work' | 'Intermediate' | 'Good' | 'Excellent' = 'Intermediate';
  if (total >= 90) status = 'Excellent';
  else if (total >= 70) status = 'Good';
  else if (total < 50) status = 'Needs Work';

  return {
    totalScore: total,
    status,
    categories: [
      {
        name: 'Basic Information',
        weight: 20,
        score: basicScore,
        isComplete: basicCount === basicItems.length,
        details: `${basicCount} of ${basicItems.length} personal profile fields completed`,
      },
      {
        name: 'Professional Details',
        weight: 20,
        score: profScore,
        isComplete: profCount === profItems.length,
        details: `${profCount} of ${profItems.length} professional credentials provided`,
      },
      {
        name: 'Expertise & Skills',
        weight: 15,
        score: expScore,
        isComplete: p.specialties.length >= 3,
        details: `${p.specialties.length} technical poultry skills added (target: 3+)`,
      },
      {
        name: 'Experience Timeline',
        weight: 15,
        score: workScore,
        isComplete: p.experiences.length >= 2,
        details: `${p.experiences.length} career milestones recorded`,
      },
      {
        name: 'Education & Certifications',
        weight: 15,
        score: eduScore,
        isComplete: totalCertsEdu >= 2,
        details: `${p.educations.length} qualifications and ${p.certifications.length} credentials`,
      },
      {
        name: 'PTIC Participation',
        weight: 15,
        score: pticScore,
        isComplete: interestCount >= 4,
        details: `${interestCount} community interests and contribution topics declared`,
      }
    ]
  };
}

export function calculateBusinessProfileScore(b: FullBusinessProfileData): ProfileScoreResult {
  // 1. Business Information (weight: 20%)
  const bizItems = [
    Boolean(b.name?.trim()),
    Boolean(b.tagline?.trim()),
    Boolean(b.type?.trim()),
    Boolean(b.logoUrl?.trim()),
    Boolean(b.coverUrl?.trim()),
    Boolean(b.description?.trim())
  ];
  const bizCount = bizItems.filter(Boolean).length;
  const bizScore = Math.round((bizCount / bizItems.length) * 20);

  // 2. Products & Services (weight: 20%)
  let prodScore = 0;
  if (b.products.length >= 3) prodScore = 20;
  else if (b.products.length === 2) prodScore = 15;
  else if (b.products.length === 1) prodScore = 10;

  // 3. Business Details (weight: 15%)
  const detailItems = [
    Boolean(b.industry?.trim()),
    Boolean(b.location?.trim()),
    Boolean(b.phone?.trim()),
    Boolean(b.email?.trim()),
    Boolean(b.website?.trim())
  ];
  const detailCount = detailItems.filter(Boolean).length;
  const detailScore = Math.round((detailCount / detailItems.length) * 15);

  // 4. Team & People (weight: 15%)
  let teamScore = 0;
  if (b.teamMembers.length >= 3) teamScore = 15;
  else if (b.teamMembers.length >= 1) teamScore = 10;

  // 5. Certifications (weight: 10%)
  let certScore = 0;
  if (b.certifications.length >= 2) certScore = 10;
  else if (b.certifications.length === 1) certScore = 7;

  // 6. Locations (weight: 10%)
  let locScore = 0;
  if (b.locations.length >= 2) locScore = 10;
  else if (b.locations.length === 1) locScore = 7;

  // 7. PTIC Participation (weight: 10%)
  const pticScore = 10; // Registered enterprise with active chapter verification

  const total = Math.min(100, bizScore + prodScore + detailScore + teamScore + certScore + locScore + pticScore);

  let status: 'Needs Work' | 'Intermediate' | 'Good' | 'Excellent' = 'Intermediate';
  if (total >= 90) status = 'Excellent';
  else if (total >= 70) status = 'Good';
  else if (total < 50) status = 'Needs Work';

  return {
    totalScore: total,
    status,
    categories: [
      {
        name: 'Business Information',
        weight: 20,
        score: bizScore,
        isComplete: bizCount === bizItems.length,
        details: `${bizCount} of ${bizItems.length} core enterprise fields completed`,
      },
      {
        name: 'Products & Services',
        weight: 20,
        score: prodScore,
        isComplete: b.products.length >= 3,
        details: `${b.products.length} catalog offerings listed with pricing & specifications`,
      },
      {
        name: 'Business Details',
        weight: 15,
        score: detailScore,
        isComplete: detailCount === detailItems.length,
        details: `${detailCount} of ${detailItems.length} contact and channel records active`,
      },
      {
        name: 'Team & People',
        weight: 15,
        score: teamScore,
        isComplete: b.teamMembers.length >= 3,
        details: `${b.teamMembers.length} verified key personnel and managers on record`,
      },
      {
        name: 'Certifications',
        weight: 10,
        score: certScore,
        isComplete: b.certifications.length >= 2,
        details: `${b.certifications.length} statutory, TNPCB or ISO accreditations attached`,
      },
      {
        name: 'Locations',
        weight: 10,
        score: locScore,
        isComplete: b.locations.length >= 2,
        details: `${b.locations.length} poultry operating sheds or yards mapped`,
      },
      {
        name: 'PTIC Participation',
        weight: 10,
        score: pticScore,
        isComplete: true,
        details: 'Active council enterprise standing & directory badge',
      }
    ]
  };
}
