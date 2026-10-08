import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '../ui/Avatar';
import { Stakeholder } from '../../types';
import { MOCK_STAKEHOLDERS, CURRENT_USER } from '../../data/mockData';
import { 
  Search, 
  Smile, 
  Paperclip, 
  Send, 
  Mic, 
  SquarePen, 
  CheckCheck, 
  X, 
  FileArchive, 
  Download, 
  Eye, 
  Check, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Info,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMember?: Stakeholder | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'contact';
  text?: string;
  time: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  hasImage?: boolean;
  imageUrl?: string;
  imageCaption?: string;
  reaction?: string;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  onClose,
  initialMember,
}) => {
  const { showToast } = useToast();
  const [activeStakeholder, setActiveStakeholder] = useState<Stakeholder>(
    initialMember || MOCK_STAKEHOLDERS[0]
  );
  const [chatSearch, setChatSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [inputText, setInputText] = useState('');
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  
  // In-Conversation Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'words' | 'files' | 'media'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulated chat histories tailored to PTIC council stakeholders
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({
    u1: [ // Dr. Arun Kumar
      {
        id: 'm1',
        sender: 'user',
        text: "Hello Dr. Arun, here are the latest flock respiratory lab reports and biosecurity diagnostic logs.",
        time: '14:03',
      },
      {
        id: 'm2',
        sender: 'user',
        hasAttachment: true,
        attachmentName: 'Flock_Pathology_Lab_Results.zip',
        attachmentSize: '23.5 MB · Compressed Archive',
        time: '14:04',
      },
      {
        id: 'm3',
        sender: 'contact',
        text: 'Reviewing now. Shed viral load is within the safe threshold. Keep the aerosol disinfection schedule active.',
        time: '14:05',
      },
      {
        id: 'm4',
        sender: 'contact',
        hasImage: true,
        imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
        imageCaption: 'Namakkal zone broiler flock health check completed. Excellent weight distribution.',
        reaction: '❤️',
        time: '15:06',
      },
      {
        id: 'm5',
        sender: 'user',
        text: 'Great update. We will proceed with the recommended nutritional boost.',
        time: '15:12',
      },
    ],
    u2: [ // Priya Subramaniam
      {
        id: 'm21',
        sender: 'contact',
        text: 'Hi Karthik, the IoT sensors for ambient ammonia tracking and shed humidity are now live.',
        time: '11:20',
      },
      {
        id: 'm22',
        sender: 'user',
        text: 'Excellent! Can you share the latest telemetry dashboard data export?',
        time: '11:22',
      },
      {
        id: 'm23',
        sender: 'contact',
        hasAttachment: true,
        attachmentName: 'Shed_Sensors_Telemetry_Log.csv',
        attachmentSize: '4.2 MB · CSV Dataset',
        time: '11:24',
      },
      {
        id: 'm24',
        sender: 'contact',
        text: 'Sending the telemetry dashboard zip package and calibration logs now.',
        time: '11:25',
      },
    ],
    u3: [ // Rajesh Murugan
      {
        id: 'm31',
        sender: 'contact',
        text: 'Contract farming feed dispatch is confirmed for the Salem zone starting tomorrow morning.',
        time: '09:40',
      },
      {
        id: 'm32',
        sender: 'user',
        text: 'Understood. All participating farmer sheds have verified biosecurity disinfection at gate entry.',
        time: '09:45',
      },
      {
        id: 'm33',
        sender: 'contact',
        hasAttachment: true,
        attachmentName: 'Salem_Farming_Feed_Distribution_Manifest.pdf',
        attachmentSize: '1.4 MB · Verified Council Document',
        time: '09:50',
      },
    ],
  });

  // Sync active stakeholder when initialMember changes
  useEffect(() => {
    if (initialMember) {
      setActiveStakeholder(initialMember);
    }
  }, [initialMember]);

  // Focus search input when in-chat search opens
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Auto-scroll chat feed to bottom when messages update (unless searching)
  useEffect(() => {
    if (!isSearchOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeStakeholder, isSearchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        } else if (showProfileDetails) {
          setShowProfileDetails(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSearchOpen, showProfileDetails, onClose]);

  if (!isOpen) return null;

  const currentMessages = conversations[activeStakeholder.id] || [
    {
      id: 'init1',
      sender: 'contact',
      text: `Hello Karthik! Connected via PTIC People. How can I assist with ${activeStakeholder.organization}?`,
      time: '10:00',
    },
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setConversations((prev) => ({
      ...prev,
      [activeStakeholder.id]: [...(prev[activeStakeholder.id] || []), newMsg],
    }));

    setInputText('');

    // Simulate contact reply after 1.2 seconds
    setTimeout(() => {
      const contactReplies: Record<string, string> = {
        u1: "Thanks for the update Karthik! I'll review these diagnostic readings and advise on flock biosecurity.",
        u2: "Received! The IoT telemetry nodes are synchronizing ambient metrics as we speak.",
        u3: "Understood. Our Salem distribution coordinators have logged this request.",
        u4: "Great point! Let's incorporate this into the upcoming TANUVAS nutritional trial schedule.",
        u5: "Noted! Automated cages and grading lines are running at full efficiency.",
      };

      const replyText = contactReplies[activeStakeholder.id] || `Thank you Karthik! Message received at ${activeStakeholder.organization}.`;

      const replyMsg: ChatMessage = {
        id: `cnt-${Date.now()}`,
        sender: 'contact',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      };

      setConversations((prev) => ({
        ...prev,
        [activeStakeholder.id]: [...(prev[activeStakeholder.id] || []), replyMsg],
      }));
    }, 1200);
  };

  const filteredMembers = MOCK_STAKEHOLDERS.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      m.organization.toLowerCase().includes(chatSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(chatSearch.toLowerCase());
    
    if (activeTab === 'unread') {
      return matchesSearch && (m.id === 'u2' || m.id === 'u4');
    }
    return matchesSearch;
  });

  // Calculate matching items for In-Chat Search
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingMessages = currentMessages.filter((msg) => {
    if (!trimmedQuery) return true;
    const textMatch = msg.text?.toLowerCase().includes(trimmedQuery);
    const attachMatch = msg.attachmentName?.toLowerCase().includes(trimmedQuery);
    const imageMatch = msg.imageCaption?.toLowerCase().includes(trimmedQuery);
    return textMatch || attachMatch || imageMatch;
  });

  const matchingWordsCount = currentMessages.filter((msg) => 
    msg.text && (!trimmedQuery || msg.text.toLowerCase().includes(trimmedQuery))
  ).length;

  const matchingFiles = currentMessages.filter((msg) => 
    msg.hasAttachment && (!trimmedQuery || msg.attachmentName?.toLowerCase().includes(trimmedQuery))
  );

  const matchingMedia = currentMessages.filter((msg) => 
    msg.hasImage && (!trimmedQuery || msg.imageCaption?.toLowerCase().includes(trimmedQuery))
  );

  const displayedMessages = currentMessages.filter((msg) => {
    if (!isSearchOpen) return true;

    // Apply category filter
    if (searchCategory === 'files') {
      if (!msg.hasAttachment) return false;
      return !trimmedQuery || msg.attachmentName?.toLowerCase().includes(trimmedQuery);
    }
    if (searchCategory === 'media') {
      if (!msg.hasImage) return false;
      return !trimmedQuery || msg.imageCaption?.toLowerCase().includes(trimmedQuery);
    }
    if (searchCategory === 'words') {
      if (!msg.text) return false;
      return !trimmedQuery || msg.text.toLowerCase().includes(trimmedQuery);
    }

    // Default 'all'
    if (!trimmedQuery) return true;
    const textMatch = msg.text?.toLowerCase().includes(trimmedQuery);
    const attachMatch = msg.attachmentName?.toLowerCase().includes(trimmedQuery);
    const imageMatch = msg.imageCaption?.toLowerCase().includes(trimmedQuery);
    return textMatch || attachMatch || imageMatch;
  });

  // Highlight helper for words matching the search query
  const renderHighlightedText = (text?: string) => {
    if (!text) return null;
    if (!isSearchOpen || !trimmedQuery) return text;

    const escaped = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    return parts.map((part, index) =>
      part.toLowerCase() === trimmedQuery ? (
        <mark key={index} className="bg-amber-300 text-slate-900 px-1 py-0.5 rounded font-bold shadow-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* PTIC Council Chat Window Shell */}
      <div className="w-full max-w-[1140px] h-[90vh] max-h-[760px] min-h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 text-left">
        
        {/* Unified Merged Single Header Row */}
        <div className="h-16 bg-white border-b border-slate-200/90 flex items-center shrink-0 z-20">
          
          {/* Left Column Header (Width matches left sidebar: 340px) */}
          <div className="w-[300px] sm:w-[340px] px-4 flex items-center justify-between border-r border-slate-200/90 h-full shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar initials={CURRENT_USER.initials} size="sm" className="w-9 h-9 rounded-full ring-2 ring-[#0a66c2]/20 shadow-xs" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                  Council Messages
                </h2>
                <p className="text-[11px] text-[#0a66c2] font-medium truncate">
                  PTIC Stakeholder Network
                </p>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => showToast('New Discussion', 'Select a verified council member to initiate a direct message.', 'info')}
              className="p-2 hover:bg-white text-slate-500 hover:text-[#0a66c2] rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-xs"
              title="Compose message"
            >
              <SquarePen size={17} />
            </button>
          </div>

          {/* Right Column Header (Active Stakeholder + Actions + Close Button) */}
          <div className="flex-1 px-5 flex items-center justify-between h-full bg-white">
            
            {/* Clickable Member Profile Header Block */}
            <div 
              onClick={() => setShowProfileDetails((prev) => !prev)}
              className="flex items-center gap-3 min-w-0 cursor-pointer group select-none py-1 px-1.5 -ml-1.5 rounded-xl hover:bg-slate-50 transition-colors"
              title="Click to view profile details"
            >
              <div className="relative shrink-0 transition-transform group-hover:scale-105">
                <Avatar
                  src={activeStakeholder.avatarUrl}
                  initials={activeStakeholder.initials}
                  size="md"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-[#0a66c2]/40 shadow-xs transition-all"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0a66c2] transition-colors truncate leading-snug">
                    {activeStakeholder.name}
                  </h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                    <Check size={11} className="text-emerald-600 stroke-[2.5]" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate font-normal group-hover:text-slate-700 transition-colors">
                  {activeStakeholder.role} · <span className="text-slate-700 font-medium">{activeStakeholder.organization}</span>
                </p>
              </div>
            </div>

            {/* Header Right Actions & Close Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Search Icon button to toggle In-Chat Finder */}
              <button 
                type="button" 
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  if (isSearchOpen) {
                    setSearchQuery('');
                  }
                }}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                  isSearchOpen 
                    ? 'bg-sky-100 text-[#0a66c2] ring-1 ring-[#0a66c2]/30 shadow-xs' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
                title="Search words, chats, files, and media"
              >
                <Search size={16} />
                <span className="hidden sm:inline text-[11px]">
                  {isSearchOpen ? 'Searching' : 'Search'}
                </span>
              </button>

              {/* Profile Details Toggle button */}
              <button 
                type="button" 
                onClick={() => setShowProfileDetails((prev) => !prev)}
                className={`p-2 rounded-lg transition-colors ${
                  showProfileDetails 
                    ? 'bg-sky-100 text-[#0a66c2]' 
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
                title={showProfileDetails ? 'Hide profile details' : 'View profile details'}
              >
                <Info size={17} />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Close chat (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat App Body: Left Sidebar + Chat Canvas + Optional Right Profile Drawer */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Stakeholder Conversations List */}
          <div className="w-[300px] sm:w-[340px] border-r border-slate-200/90 flex flex-col bg-slate-50/40 shrink-0">
            
            {/* Search and Tabs Row */}
            <div className="p-3 border-b border-slate-200/80 bg-white space-y-2.5 shrink-0">
              <div className="relative flex items-center bg-slate-100/80 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0a66c2]/20 focus-within:border-[#0a66c2] border border-transparent transition-all">
                <Search size={14} className="text-slate-400 mr-2 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search members or messages..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#0a66c2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Chats
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === 'unread'
                      ? 'bg-[#0a66c2] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Unread</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === 'unread' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    2
                  </span>
                </button>
              </div>
            </div>

            {/* Stakeholder Threads List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const isSelected = member.id === activeStakeholder.id;
                const memberMsgs = conversations[member.id] || [];
                const lastMsg = memberMsgs.length > 0 
                  ? (memberMsgs[memberMsgs.length - 1].text || memberMsgs[memberMsgs.length - 1].attachmentName || 'Media attachment')
                  : `${member.role} · ${member.organization}`;

                return (
                  <div
                    key={member.id}
                    onClick={() => setActiveStakeholder(member)}
                    className={`px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-all select-none relative ${
                      isSelected 
                        ? 'bg-sky-50/80 border-l-[3px] border-[#0a66c2]' 
                        : 'hover:bg-white bg-transparent border-l-[3px] border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        src={member.avatarUrl}
                        initials={member.initials}
                        size="md"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs sm:text-[13px] font-bold truncate ${
                          isSelected ? 'text-[#0a66c2]' : 'text-slate-900'
                        }`}>
                          {member.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                          {member.id === 'u1' ? '15:12' : member.id === 'u2' ? '14:54' : '11:21'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {member.organization}
                      </p>

                      <div className="flex items-center justify-between mt-0.5">
                        <div className="flex items-center gap-1 min-w-0 text-xs text-slate-500 truncate">
                          {member.id === 'u1' && (
                            <CheckCheck size={13} className="text-[#0a66c2] shrink-0 inline" />
                          )}
                          <span className="truncate text-[11px]">{lastMsg}</span>
                        </div>

                        {member.id === 'u2' && (
                          <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-1 shadow-xs">
                            2
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Active Conversation Pane */}
          <div className="flex-1 flex flex-col bg-[#f8fafc] relative overflow-hidden">
            
            {/* Interactive In-Chat Search & Resource Finder Bar */}
            {isSearchOpen && (
              <div className="bg-white border-b border-slate-200/90 p-3 shadow-xs shrink-0 z-20 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center bg-slate-100/90 rounded-xl px-3 py-1.5 border border-slate-200/80 focus-within:bg-white focus-within:border-[#0a66c2] focus-within:ring-2 focus-within:ring-[#0a66c2]/20 transition-all">
                    <Search size={14} className="text-slate-400 mr-2 shrink-0 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search words, chats, files, documents..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                        title="Clear query"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>

                {/* Filter Category Pills for Search */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSearchCategory('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        searchCategory === 'all'
                          ? 'bg-[#0a66c2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({matchingMessages.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchCategory('words')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                        searchCategory === 'words'
                          ? 'bg-[#0a66c2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <MessageSquare size={11} />
                      Words ({matchingWordsCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchCategory('files')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                        searchCategory === 'files'
                          ? 'bg-[#0a66c2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileArchive size={11} />
                      Files ({matchingFiles.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setSearchCategory('media')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                        searchCategory === 'media'
                          ? 'bg-[#0a66c2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ImageIcon size={11} />
                      Media ({matchingMedia.length})
                    </button>
                  </div>

                  {searchQuery && (
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {displayedMessages.length} {displayedMessages.length === 1 ? 'match' : 'matches'}
                    </span>
                  )}
                </div>

                {/* If searching files specifically, show dedicated file repository cards */}
                {searchCategory === 'files' && matchingFiles.length > 0 && (
                  <div className="pt-1 space-y-1.5 max-h-36 overflow-y-auto">
                    {matchingFiles.map((fileMsg) => (
                      <div 
                        key={fileMsg.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/90 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded bg-sky-100 text-[#0a66c2] flex items-center justify-center shrink-0">
                            <FileArchive size={16} />
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-900 truncate">
                              {renderHighlightedText(fileMsg.attachmentName)}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {fileMsg.attachmentSize} · {fileMsg.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => showToast('Preview Document', `Viewing ${fileMsg.attachmentName}...`, 'info')}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-200 flex items-center gap-1"
                          >
                            <Eye size={10} /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast('Download', `Downloading ${fileMsg.attachmentName}...`, 'success')}
                            className="px-2 py-1 bg-[#0a66c2] hover:bg-[#0855a5] text-white rounded text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Download size={10} /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message History Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 z-10 flex flex-col">
              
              {/* Date / Security Notice Pill */}
              <div className="self-center my-1">
                <span className="bg-white border border-slate-200 text-slate-500 text-[11px] font-medium px-3.5 py-1 rounded-full shadow-xs select-none">
                  Today · PTIC Verified Council Session
                </span>
              </div>

              {/* Empty state when search yields no matches */}
              {isSearchOpen && displayedMessages.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm mx-auto my-6">
                  <Search size={24} className="mx-auto text-slate-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-800">No matches found</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No words, files, or media matched "{searchQuery}". Try a different keyword.
                  </p>
                </div>
              )}

              {/* Message Bubbles */}
              {displayedMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[72%] ${
                      isUser ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#0a66c2] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      {/* Text content if present with word highlighting */}
                      {msg.text && (
                        <p className="whitespace-pre-wrap">
                          {renderHighlightedText(msg.text)}
                        </p>
                      )}

                      {/* File attachment card (styled for PTIC) */}
                      {msg.hasAttachment && (
                        <div className={`rounded-xl p-3 my-1.5 min-w-[260px] border ${
                          isUser 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                              isUser ? 'bg-white/20 text-white' : 'bg-sky-50 text-[#0a66c2]'
                            }`}>
                              <FileArchive size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate">
                                {renderHighlightedText(msg.attachmentName)}
                              </p>
                              <p className={`text-[10px] mt-0.5 truncate ${
                                isUser ? 'text-blue-100' : 'text-slate-500'
                              }`}>
                                {msg.attachmentSize}
                              </p>
                            </div>
                          </div>

                          <div className={`grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t ${
                            isUser ? 'border-white/15' : 'border-slate-200'
                          }`}>
                            <button
                              type="button"
                              onClick={() => showToast('Preview Document', 'Opening verified document viewer...', 'info')}
                              className={`py-1.5 px-3 rounded-lg font-semibold text-[11px] text-center transition-colors flex items-center justify-center gap-1 ${
                                isUser 
                                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <Eye size={12} /> Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast('Download', 'Saving file to Downloads...', 'success')}
                              className={`py-1.5 px-3 rounded-lg font-semibold text-[11px] text-center transition-colors flex items-center justify-center gap-1 ${
                                isUser 
                                  ? 'bg-white text-[#0a66c2] hover:bg-blue-50 font-bold' 
                                  : 'bg-[#0a66c2] text-white hover:bg-[#0855a5]'
                              }`}
                            >
                              <Download size={12} /> Download
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Image attachment card */}
                      {msg.hasImage && (
                        <div className="my-1.5 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-900/5">
                          <img
                            src={msg.imageUrl}
                            alt="Attachment"
                            className="w-full max-h-60 object-cover rounded-t-xl"
                          />
                          {msg.imageCaption && (
                            <p className="p-2.5 text-xs text-slate-800 font-medium bg-white">
                              {renderHighlightedText(msg.imageCaption)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Reaction badge */}
                      {msg.reaction && (
                        <div className="absolute -bottom-2.5 left-3 bg-white rounded-full px-2 py-0.5 shadow-sm border border-slate-200 text-xs flex items-center gap-1">
                          <span>{msg.reaction}</span>
                          <span className="text-[10px] text-slate-500 font-bold">1</span>
                        </div>
                      )}

                      {/* Timestamp & Double Checkmarks */}
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-normal ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <span>{msg.time}</span>
                        {isUser && (
                          <CheckCheck size={13} className="text-sky-200 ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Modern Bottom Message Input Bar */}
            <div className="h-16 bg-white px-4 flex items-center gap-2.5 border-t border-slate-200/90 shrink-0 z-10">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Insert emoji"
              >
                <Smile size={19} />
              </button>
              <button
                type="button"
                onClick={() => showToast('Attachment', 'Select PDF, dataset, or image to attach.', 'info')}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip size={19} />
              </button>

              <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message to ${activeStakeholder.name}...`}
                  className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all"
                />
              </form>

              {inputText.trim() ? (
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="h-9 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#0855a5] text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-all shadow-xs"
                  title="Send message"
                >
                  <span>Send</span>
                  <Send size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => showToast('Audio Note', 'Hold to record council voice note.', 'info')}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Voice note"
                >
                  <Mic size={19} />
                </button>
              )}
            </div>

          </div>

          {/* Rightmost Profile Details Drawer / Side Panel */}
          {showProfileDetails && (
            <div className="w-[310px] sm:w-[350px] border-l border-slate-200/90 bg-white flex flex-col shrink-0 h-full overflow-hidden animate-in slide-in-from-right duration-200 z-20 shadow-lg">
              {/* Profile Drawer Header */}
              <div className="h-16 px-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Member Profile
                  </h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Check size={11} className="text-emerald-600 stroke-[2.5]" />
                    Verified
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileDetails(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Close profile details"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Profile Details Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                {/* Hero Avatar & Core Info */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                  <div className="relative mb-3">
                    <Avatar
                      src={activeStakeholder.avatarUrl}
                      initials={activeStakeholder.initials}
                      size="lg"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-sky-50 shadow-md"
                    />
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    {activeStakeholder.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    {activeStakeholder.role}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-[#0a66c2] border border-sky-100">
                      <Building size={12} />
                      {activeStakeholder.organization}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      <MapPin size={12} />
                      {activeStakeholder.location}
                    </span>
                  </div>
                </div>

                {/* About / Bio */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    About Stakeholder
                  </h5>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeStakeholder.bio}
                    </p>
                  </div>
                </div>

                {/* Specialties & Domains */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Specialties & Domains
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStakeholder.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Council Channels & Network */}
                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Council Network Contacts</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={11} /> Discoverable
                    </span>
                  </h5>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-sky-100/80">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail size={13} className="text-[#0a66c2]" /> Email
                      </span>
                      <span className="font-semibold text-slate-800">
                        {activeStakeholder.name.toLowerCase().replace(/[^a-z]/g, '')}@ptic-council.org
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-sky-100/80">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone size={13} className="text-[#0a66c2]" /> Council Phone
                      </span>
                      <span className="font-semibold text-slate-800">
                        +91 98421 •••••
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Users size={13} className="text-[#0a66c2]" /> Connections
                      </span>
                      <span className="font-semibold text-slate-800">
                        {activeStakeholder.connectionsCount} across Tamil Nadu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Contact Card', `Contact details for ${activeStakeholder.name} copied to clipboard.`, 'success');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#0a66c2] hover:bg-[#0855a5] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Mail size={13} /> Direct Inquiry Available
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
