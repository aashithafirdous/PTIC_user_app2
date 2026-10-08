export type NavRoute = 'home' | 'directory' | 'people' | 'events' | 'emart' | 'ask' | 'design-system' | 'profile' | 'inbox' | 'notifications';

export type StakeholderCategory = 
  | 'All' 
  | 'Farmers' 
  | 'Veterinarians' 
  | 'Poultry Industry' 
  | 'Experts' 
  | 'Technology Providers'
  | 'Farmer' 
  | 'Veterinarian' 
  | 'Technology Provider' 
  | 'Integrator' 
  | 'Researcher';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: StakeholderCategory;
  location: string;
  initials: string;
  avatarUrl?: string;
  bio: string;
  specialties: string[];
  connectionsCount: number;
}

export interface EventCoordinator {
  id: string;
  name: string;
  contact: string;
  email: string;
}

export interface EventSponsor {
  id: string;
  name: string;
  tier?: 'Platinum' | 'Gold' | 'Silver' | 'Associate';
  logo?: string;
}

export interface EventExhibitor {
  id: string;
  name: string;
  booth?: string;
  category?: string;
}

export interface AgendaItem {
  time: string;
  topic: string;
  speaker?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatarUrl: string;
  bio: string;
  specialties: string[];
}

export interface EventTicket {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  inclusions?: string[];
  features?: string[];
  availability: string;
  availableCount?: number;
  badge?: string;
}

export interface PTICEvent {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  date: string;
  timeRange?: string;
  location: string;
  venueAddress?: string;
  organizer?: string;
  price?: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  category: string;
  description: string;
  attendeesCount: number;
  capacity?: number;
  featured?: boolean;
  createdBy: string; // User ID of creator (e.g. 'u0')
  flyerUrl?: string;
  flyerType?: 'image' | 'pdf';
  flyerName?: string;
  agendaFileName?: string;
  agendaItems?: AgendaItem[];
  speakers?: EventSpeaker[];
  tickets?: EventTicket[];
  features?: string[];
  whoShouldAttend?: string[];
  tags?: string[];
  sponsors?: EventSponsor[];
  exhibitors?: EventExhibitor[];
  coordinators?: EventCoordinator[];
  guidelines?: string[];
  interestedCount: number;
  isInterested?: boolean;
  isAttending?: boolean;
}

export interface BusinessProfile {
  id: string;
  name: string;
  logoUrl?: string;
  initials: string;
  category: string;
  type: string; // e.g. 'Private Limited', 'Partnership', 'Proprietorship'
  services: string[];
  description: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  representativeId?: string;
  representativeName?: string;
  representativeRole?: string;
  representativeAvatar?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface EMartItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  tag: string;
  featured?: boolean;
  imageUrl?: string;
  price?: string;
  rating?: number;
  inStock?: boolean;
  keyDetails?: string[];
  brand?: string;
  color?: string;
  material?: string;
  availability?: string;
  aboutItem?: string[];
  galleryImages?: string[];
}

export interface QuestionComment {
  id: string;
  author: string;
  authorRole?: string;
  content: string;
  timeAgo: string;
  upvotes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface ExpertAnswer {
  id: string;
  author: string;
  authorRole: string;
  authorLocation?: string;
  content: string;
  timeAgo: string;
  upvotes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  comments?: QuestionComment[];
}

export interface ExpertQuestion {
  id: string;
  title: string;
  description?: string;
  author: string;
  authorRole: string;
  location: string;
  timeAgo: string;
  answersCount: number;
  likesCount?: number;
  dislikesCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  category: string;
  isResolved?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  answers?: ExpertAnswer[];
  comments?: QuestionComment[];
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'default' | 'success' | 'info';
}

export interface MessageAttachment {
  name: string;
  url?: string;
  type: 'image' | 'file';
  size?: string;
}

export interface InboxMessage {
  id: string;
  sender: string;
  senderRole?: string;
  senderInitials?: string;
  subject: string;
  content: string;
  time: string;
  category: 'message' | 'notification' | 'event' | 'council' | 'course';
  unread: boolean;
  eventId?: string;
  attachment?: MessageAttachment;
  replies?: Array<{
    sender: string;
    content: string;
    time: string;
    attachment?: MessageAttachment;
  }>;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  participantName: string;
  organization: string;
  role: string;
  phone: string;
  email: string;
  badgeNumber: string;
  registeredAt: string;
}


export type NotificationType =
  | 'message'
  | 'comment_like'
  | 'question_answer'
  | 'incomplete_profile'
  | 'new_event'
  | 'registration_closing'
  | 'upcoming_conference'
  | 'event_pass_ready'
  | 'guest_greeting'
  | 'product_enquiry'
  | 'profile_verification'
  | 'profile_completion'
  | 'connection_request'
  | 'event_update'
  | 'venue_change'
  | 'cancellation'
  | 'expert_response'
  | 'profile'
  | 'event'
  | 'emart'
  | 'ask'
  | 'system';

export interface ExhibitionStall {
  id: string;
  stallNumber: string; // "Stall 01", "Stall 02"
  status: 'available' | 'occupied' | 'reserved';
  companyName: string;
  companyInitials: string;
  companyLogo?: string;
  companyId?: string;
  industry: string;
  products: string[];
  description: string;
  location: string;
  hallName?: string;
}

export interface ExhibitionHall {
  id: string;
  hallNumber: string; // "Hall 1", "Hall 2"
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  stallsCount: number;
  stalls: ExhibitionStall[];
}

export interface PTICNotification {
  id: string;
  type: NotificationType;
  category?: 'all' | 'messages' | 'events' | 'network' | 'knowledge';
  author?: string;
  avatarUrl?: string;
  title: string;
  supportingText?: string;
  timestamp: string;
  unread: boolean;
  route: NavRoute;
  targetId?: string;
  linkAction?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

