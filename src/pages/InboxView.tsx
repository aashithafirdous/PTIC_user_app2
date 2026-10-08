import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STAKEHOLDERS, MOCK_COMPANIES, CURRENT_USER, MOCK_EMART_ITEMS } from '../data/mockData';
import { NavRoute, EMartItem } from '../types';
import { 
  Search, 
  Send, 
  Paperclip, 
  CheckCheck, 
  ArrowLeft, 
  Building, 
  ShieldCheck, 
  X, 
  FileText, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { pushNav, slugify } from '../lib/router';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  attachment?: {
    name: string;
    size?: string;
    type: 'pdf' | 'image' | 'file';
  };
  productContext?: {
    title: string;
    price?: string;
    provider: string;
    imageUrl?: string;
  };
}

interface ConversationItem {
  id: string; // member id or company id
  isCompany: boolean;
  name: string;
  role: string;
  organization?: string;
  initials: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  productContext?: {
    title: string;
    price?: string;
    provider: string;
    imageUrl?: string;
  };
}

export interface InboxViewProps {
  onNavigate?: (route: NavRoute) => void;
}

export const InboxView: React.FC<InboxViewProps> = () => {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter tab for contacts: 'all' | 'members' | 'companies'
  const [contactFilter, setContactFilter] = useState<'all' | 'members' | 'companies'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState<string>('u1');
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  // Message composer input & sticky product attachment
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: 'pdf' | 'file' } | null>(null);
  const [attachedProduct, setAttachedProduct] = useState<EMartItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seeded conversations registry
  const [conversationsMap, setConversationsMap] = useState<Record<string, ChatMessage[]>>(() => {
    return {
      'u1': [
        {
          id: 'm1-1',
          senderId: 'u1',
          senderName: 'Dr. Arun Kumar',
          text: 'Hello Karthik, I reviewed the ventilation setup in your Namakkal shedding unit.',
          timestamp: '10:15 AM',
          isSelf: false,
        },
        {
          id: 'm1-2',
          senderId: 'u1',
          senderName: 'Dr. Arun Kumar',
          text: 'Make sure you maintain minimum 45 PSI at the furthest nozzle and keep the timer interval to 45 seconds on, 3 minutes off during afternoons above 36°C.',
          timestamp: '10:16 AM',
          isSelf: false,
          attachment: {
            name: 'Summer_Ventilation_Fogger_Protocol.pdf',
            size: '1.2 MB',
            type: 'pdf',
          },
        },
        {
          id: 'm1-3',
          senderId: 'u0',
          senderName: CURRENT_USER.name,
          text: 'Thank you Dr. Arun. We adjusted the pressure yesterday afternoon and observed an immediate 4.2°C temperature drop.',
          timestamp: '10:30 AM',
          isSelf: true,
        },
      ],
      'u2': [
        {
          id: 'm2-1',
          senderId: 'u2',
          senderName: 'Priya Subramaniam',
          text: 'Hello Karthik, we just published new LoRaWAN firmware for Namakkal shed ambient monitors. Ammonia drift auto-calibrates every 72 hours now.',
          timestamp: 'Yesterday',
          isSelf: false,
        },
      ],
      'b2': [
        {
          id: 'mb2-1',
          senderId: 'b2',
          senderName: 'Kongu Agro Automation',
          text: 'Greetings from Kongu Agro Automation. We received your inquiry regarding the Automated Shed Fogger Mist System.',
          timestamp: 'Yesterday',
          isSelf: false,
          productContext: {
            title: 'Automated Poultry Shed Fogger Mist System',
            price: '₹ 18,500',
            provider: 'Kongu Agro Automation',
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          },
        },
        {
          id: 'mb2-2',
          senderId: 'u0',
          senderName: CURRENT_USER.name,
          text: 'What is the lead time for delivery and on-site nozzle installation across 2 sheds in Namakkal?',
          timestamp: 'Yesterday',
          isSelf: true,
        },
        {
          id: 'mb2-3',
          senderId: 'b2',
          senderName: 'Kongu Agro Automation',
          text: 'We have our Western TN team available this Thursday. We can install high-pressure stainless steel lines in 48 hours.',
          timestamp: '09:40 AM',
          isSelf: false,
        },
      ],
      'u3': [
        {
          id: 'm3-1',
          senderId: 'u3',
          senderName: 'Rajesh Murugan',
          text: 'Hi Karthik, are your Namakkal sheds ready for the next batch of 20,000 Cobb broilers this weekend?',
          timestamp: '2d ago',
          isSelf: false,
        },
      ],
      'b1': [
        {
          id: 'mb1-1',
          senderId: 'b1',
          senderName: 'Rajan Poultry Farms & Hatcheries',
          text: 'Weekly internal council log: Flock average weight at Day 35 reached 2.14 kg with 1.54 FCR.',
          timestamp: '3d ago',
          isSelf: false,
        },
      ],
    };
  });

  // Build unified conversation contact list from directory members & companies
  const conversationList: ConversationItem[] = [
    // Directory Members
    ...MOCK_STAKEHOLDERS.map((stk) => {
      const chat = conversationsMap[stk.id];
      const lastMsg = chat && chat.length > 0 ? chat[chat.length - 1].text : 'No messages yet. Start a discussion.';
      const time = chat && chat.length > 0 ? chat[chat.length - 1].timestamp : 'Available';
      return {
        id: stk.id,
        isCompany: false,
        name: stk.name,
        role: stk.role,
        organization: stk.organization,
        initials: stk.initials,
        avatarUrl: stk.avatarUrl,
        lastMessage: lastMsg,
        timestamp: time,
        unread: stk.id === 'u1',
      };
    }),
    // Companies
    ...MOCK_COMPANIES.map((comp) => {
      const chat = conversationsMap[comp.id];
      const lastMsg = chat && chat.length > 0 ? chat[chat.length - 1].text : `Contact ${comp.name} for official enquiries.`;
      const time = chat && chat.length > 0 ? chat[chat.length - 1].timestamp : 'Active';
      return {
        id: comp.id,
        isCompany: true,
        name: comp.name,
        role: comp.category,
        organization: comp.location,
        initials: comp.initials,
        avatarUrl: undefined,
        lastMessage: lastMsg,
        timestamp: time,
        unread: comp.id === 'b2',
        productContext: chat && chat.length > 0 ? chat[0].productContext : undefined,
      };
    }),
  ];

  // Read URL query parameters to auto-select contact or setup product enquiry
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memberParam = params.get('member');
    const companyParam = params.get('company');
    const productParam = params.get('product');

    if (memberParam) {
      setSelectedConversationId(memberParam);
      setMobileShowChat(true);
      return;
    }

    if (productParam) {
      const prod = MOCK_EMART_ITEMS.find((it) => it.id === productParam || slugify(it.title) === productParam);
      if (prod) {
        setAttachedProduct(prod);
        setInputText(`Hello, I would like to inquire about "${prod.title}". Please share technical specs, quotation, and delivery schedule.`);
        
        // Auto select company if matching or provided
        if (companyParam) {
          const matchedComp = MOCK_COMPANIES.find(c => c.id === companyParam || slugify(c.name) === companyParam);
          setSelectedConversationId(matchedComp ? matchedComp.id : companyParam);
        } else {
          const matched = MOCK_COMPANIES.find(c => c.name.toLowerCase().includes(prod.provider.toLowerCase()) || prod.provider.toLowerCase().includes(c.name.toLowerCase()));
          if (matched) {
            setSelectedConversationId(matched.id);
          }
        }
        setMobileShowChat(true);
        return;
      }
    }

    if (companyParam) {
      const matchedComp = MOCK_COMPANIES.find(c => c.id === companyParam || slugify(c.name) === companyParam);
      setSelectedConversationId(matchedComp ? matchedComp.id : companyParam);
      setMobileShowChat(true);
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationsMap, selectedConversationId]);

  // Filter conversations
  const filteredList = conversationList.filter((item) => {
    if (contactFilter === 'members' && item.isCompany) return false;
    if (contactFilter === 'companies' && !item.isCompany) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        (item.organization && item.organization.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeContact = conversationList.find((c) => c.id === selectedConversationId) || conversationList[0];
  const activeMessages = (activeContact ? conversationsMap[activeContact.id] : []) || [];

  // Determine if this is a product enquiry conversation
  const productContext = activeMessages.find((m) => m.productContext)?.productContext || activeContact?.productContext;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !attachedProduct) return;

    if (!activeContact) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'u0',
      senderName: CURRENT_USER.name,
      text: inputText.trim() || (attachedProduct ? `Inquiring about ${attachedProduct.title}` : `Sent attachment: ${attachedFile?.name}`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      attachment: attachedFile ? { name: attachedFile.name, size: attachedFile.size, type: attachedFile.type } : undefined,
      productContext: attachedProduct ? {
        title: attachedProduct.title,
        price: attachedProduct.price || 'Council Inquiry',
        provider: attachedProduct.provider,
        imageUrl: attachedProduct.imageUrl,
      } : undefined,
    };

    setConversationsMap((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setInputText('');
    setAttachedFile(null);
    setAttachedProduct(null);

    // Auto simulation response for realistic feel
    setTimeout(() => {
      const simulatedReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: activeContact.id,
        senderName: activeContact.name,
        text: activeContact.isCompany 
          ? `Thank you for contacting ${activeContact.name}. Our technical specialist has logged your inquiry and will reply shortly.`
          : `Thanks Karthik, noted! I will review and get back to you with the technical specifications.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      };

      setConversationsMap((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), simulatedReply],
      }));
    }, 1200);
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'file',
      });
      showToast('File Attached', file.name, 'info');
    }
  };

  const handleSelectConversation = (item: ConversationItem) => {
    setSelectedConversationId(item.id);
    setMobileShowChat(true);
    // Update URL query cleanly
    pushNav(`/inbox?${item.isCompany ? 'company' : 'member'}=${item.id}`, true);
  };

  return (
    <div className="w-full max-w-full px-0 sm:px-1 pt-0 pb-3 text-left">
      {/* Main 2-Column Chat Box Container */}
      <div className="h-[calc(100vh-86px)] min-h-[620px] bg-white dark:bg-[#153451] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#294966] shadow-subtle overflow-hidden flex flex-col md:flex-row w-full">
        
        {/* ====================================================================== */}
        {/* LEFT COLUMN: Conversation List (~340-380px)                            */}
        {/* ====================================================================== */}
        <div className={`w-full md:w-[360px] lg:w-[380px] shrink-0 border-r border-slate-200/90 dark:border-[#294966] flex flex-col bg-slate-50/50 dark:bg-[#102640]/50 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Search Box Header */}
          <div className="p-3.5 border-b border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] space-y-2.5">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3.5 text-slate-400 dark:text-[#B3CFE5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members or companies..."
                className="w-full bg-slate-100 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] rounded-full pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:text-[#F6FAFD] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135E69]/20 focus:border-[#135E69]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Tabs: All, Members, Companies */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {[
                { id: 'all', label: 'All Contacts' },
                { id: 'members', label: 'Members' },
                { id: 'companies', label: 'Companies' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContactFilter(tab.id as any)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
                    contactFilter === tab.id
                      ? 'bg-[#135E69] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-200/80 dark:hover:bg-[#1A3D63]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#294966]/60">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations matching "{searchQuery}"
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = selectedConversationId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectConversation(item)}
                    className={`w-full p-3 sm:p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#153451] border-l-4 border-l-[#135E69] shadow-2xs'
                        : 'hover:bg-slate-100/70 dark:hover:bg-[#1A3D63]/40'
                    }`}
                  >
                    {/* Avatar / Company Logo */}
                    <div className="relative shrink-0">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-[#294966]"
                        />
                      ) : (
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
                          item.isCompany ? 'bg-[#0f8f8c]' : 'bg-[#135E69]'
                        }`}>
                          {item.initials}
                        </div>
                      )}
                      {item.unread && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#102640]" />
                      )}
                    </div>

                    {/* Metadata preview */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD] truncate flex items-center gap-1">
                          {item.name}
                          {item.isCompany && (
                            <Building size={12} className="text-[#0f8f8c] shrink-0" />
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-[#B3CFE5]/70 shrink-0 font-medium">
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] truncate mt-0.5">
                        {item.role} {item.organization ? `· ${item.organization}` : ''}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-[#B3CFE5]/90 truncate mt-1 leading-snug">
                        {item.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ====================================================================== */}
        {/* RIGHT COLUMN: Active Conversation Screen                               */}
        {/* ====================================================================== */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#153451] ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-3 sm:px-5 sm:py-3.5 border-b border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1A3D63]"
                    title="Back to conversation list"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* Profile Avatar / Company Badge */}
                  <div className="relative shrink-0">
                    {activeContact.avatarUrl ? (
                      <img
                        src={activeContact.avatarUrl}
                        alt={activeContact.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200/80 dark:ring-[#294966]"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-2xs ${
                        activeContact.isCompany ? 'bg-[#0f8f8c]' : 'bg-[#135E69]'
                      }`}>
                        {activeContact.initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-[#F6FAFD] truncate">
                        {activeContact.name}
                      </h3>
                      <ShieldCheck size={15} className="text-[#135E69] dark:text-[#5ce0d2] shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] truncate">
                      {activeContact.role} {activeContact.organization ? `· ${activeContact.organization}` : ''}
                    </p>
                  </div>
                </div>

                {/* Right Action: Direct Profile / Company Link */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeContact.isCompany) {
                        pushNav('/directory');
                      } else {
                        pushNav(`/directory/people/${slugify(activeContact.name)}`);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] border border-[#135E69]/30 dark:border-[#5ce0d2]/30 hover:bg-[#135E69]/10 transition-colors cursor-pointer"
                  >
                    <span>{activeContact.isCompany ? 'View Company' : 'View Profile'}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Product Enquiry Context Card (Clean eCommerce Hierarchy) */}
              {productContext && (
                <div className="mx-4 mt-3 p-3 rounded-xl bg-sky-50/80 dark:bg-[#102640] border border-sky-200 dark:border-[#294966] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {productContext.imageUrl ? (
                      <img
                        src={productContext.imageUrl}
                        alt={productContext.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-[#294966] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#135E69] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        PTIC
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#135E69] dark:text-[#5ce0d2]">
                        Product Enquiry Subject
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD] truncate">
                        {productContext.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-[#B3CFE5]">
                        Price: <span className="font-extrabold text-[#135E69] dark:text-[#5ce0d2]">{productContext.price || 'Council Quotation'}</span> · Supplied by {productContext.provider}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => pushNav(`/e-mart/products/${slugify(productContext.title)}`)}
                    className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline shrink-0"
                  >
                    Product Details →
                  </button>
                </div>
              )}

              {/* Conversation Message History Stream */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/30 dark:bg-[#102640]/30">
                {activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:px-4 sm:py-3 space-y-1.5 shadow-2xs leading-relaxed text-xs sm:text-sm ${
                        msg.isSelf
                          ? 'bg-[#135E69] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#153451] text-slate-800 dark:text-[#F6FAFD] border border-slate-200/80 dark:border-[#294966] rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Product attachment preview if present */}
                      {msg.productContext && (
                        <div
                          className={`mt-2 p-2.5 rounded-xl border flex items-center gap-3 ${
                            msg.isSelf
                              ? 'bg-black/20 border-white/20 text-white'
                              : 'bg-slate-100 dark:bg-[#102640] border-slate-200 dark:border-[#294966] text-slate-800 dark:text-[#F6FAFD]'
                          }`}
                        >
                          {msg.productContext.imageUrl && (
                            <img
                              src={msg.productContext.imageUrl}
                              alt={msg.productContext.title}
                              className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-black/10"
                            />
                          )}
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-[9px] uppercase font-bold tracking-wider opacity-80 block">
                              Enquiry Product Attached
                            </span>
                            <p className="text-xs font-bold truncate">{msg.productContext.title}</p>
                            <p className="text-[11px] opacity-90">{msg.productContext.price} · {msg.productContext.provider}</p>
                          </div>
                        </div>
                      )}

                      {/* File attachment preview if present */}
                      {msg.attachment && (
                        <div
                          className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2.5 ${
                            msg.isSelf
                              ? 'bg-black/15 border-white/20 text-white'
                              : 'bg-slate-50 dark:bg-[#102640] border-slate-200 dark:border-[#294966] text-slate-800 dark:text-[#F6FAFD]'
                          }`}
                        >
                          <FileText size={18} className={msg.isSelf ? 'text-white' : 'text-[#135E69]'} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                            <p className="text-[10px] opacity-80">{msg.attachment.size || '1.2 MB'} · Verified PDF</p>
                          </div>
                        </div>
                      )}

                      <div className={`flex items-center gap-1 text-[10px] ${msg.isSelf ? 'text-white/70 justify-end' : 'text-slate-400 dark:text-[#B3CFE5]/60'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.isSelf && <CheckCheck size={12} className="text-white/90" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Footer */}
              <div className="p-3 sm:p-4 bg-white dark:bg-[#153451] border-t border-slate-200/90 dark:border-[#294966] space-y-2 shrink-0">
                {/* Sticky Attached Product Card (like WhatsApp product share) */}
                {attachedProduct && (
                  <div className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-[#102640] border border-slate-300 dark:border-[#294966] flex items-center gap-3 shadow-xs animate-fadeIn">
                    <img
                      src={attachedProduct.imageUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                      alt={attachedProduct.title}
                      className="w-13 h-13 rounded-lg object-cover bg-white shrink-0 border border-slate-200 dark:border-[#294966]"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#135E69] dark:text-[#5ce0d2] bg-teal-50 dark:bg-teal-950/50 px-1.5 py-0.2 rounded">
                          Product Attached
                        </span>
                        <span className="text-xs font-black text-[#135E69] dark:text-[#5ce0d2]">
                          {attachedProduct.price}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F6FAFD] truncate mt-0.5">
                        {attachedProduct.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-[#B3CFE5] truncate">
                        {attachedProduct.provider} · {attachedProduct.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedProduct(null)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer shrink-0"
                      title="Remove attached product"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                {/* Pending file attachment chip */}
                {attachedFile && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#102640] text-xs font-medium text-slate-700 dark:text-[#F6FAFD] border border-slate-200 dark:border-[#294966]">
                    <FileText size={13} className="text-[#135E69]" />
                    <span>{attachedFile.name} ({attachedFile.size})</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  {/* Attachment Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileAttachment}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-full text-slate-500 dark:text-[#B3CFE5] hover:bg-slate-100 dark:hover:bg-[#1A3D63] transition-colors cursor-pointer shrink-0"
                    title="Attach technical document or image"
                  >
                    <Paperclip size={18} />
                  </button>

                  {/* Input field with tailored placeholder */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      attachedProduct || productContext
                        ? "Write your enquiry or questions about this product..."
                        : `Write your message to ${activeContact.name}...`
                    }
                    className="flex-1 bg-slate-100 dark:bg-[#102640] border border-slate-200/90 dark:border-[#294966] rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-[#F6FAFD] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135E69]/25 focus:border-[#135E69]"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && !attachedFile && !attachedProduct}
                    className="px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#135E69] hover:bg-[#0e4850] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare size={48} className="text-slate-300 dark:text-[#294966] mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-[#F6FAFD]">Select a Conversation</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose a directory member or company from the left panel to begin professional correspondence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
