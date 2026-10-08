import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { SearchInput, Input } from '../ui/Input';
import { MOCK_INBOX_MESSAGES, CURRENT_USER, MOCK_STAKEHOLDERS } from '../../data/mockData';
import { InboxMessage, Stakeholder, MessageAttachment } from '../../types';
import { 
  Inbox, 
  Mail, 
  Calendar, 
  BookOpen, 
  Send, 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCheck,
  Paperclip,
  FileText,
  Download,
  X,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useLanguage } from '../../lib/LanguageContext';

export interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEvents?: () => void;
  targetStakeholder?: Stakeholder | null;
}

export const InboxModal: React.FC<InboxModalProps> = ({ 
  isOpen, 
  onClose, 
  onNavigateToEvents,
  targetStakeholder 
}) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<InboxMessage[]>(MOCK_INBOX_MESSAGES);
  const [selectedTab, setSelectedTab] = useState<'all' | 'message' | 'event' | 'course'>('all');
  const [search, setSearch] = useState('');
  const [activeMessage, setActiveMessage] = useState<InboxMessage | null>(() => MOCK_INBOX_MESSAGES[0]);
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<MessageAttachment | null>(null);
  
  // Mobile pane view: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Compose New Message
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState(MOCK_STAKEHOLDERS[0].name);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachment, setComposeAttachment] = useState<MessageAttachment | null>(null);

  const { showToast } = useToast();

  // If opened with a specific stakeholder from Directory/Home, open that conversation
  useEffect(() => {
    if (isOpen && targetStakeholder) {
      const existing = messages.find(
        (m) =>
          m.sender.toLowerCase().includes(targetStakeholder.name.toLowerCase()) ||
          targetStakeholder.name.toLowerCase().includes(m.sender.toLowerCase())
      );
      if (existing) {
        setActiveMessage(existing);
        setMobileView('chat');
      } else {
        const newConversation: InboxMessage = {
          id: `conv-${targetStakeholder.id}-${Date.now()}`,
          sender: targetStakeholder.name,
          senderRole: `${targetStakeholder.role} · ${targetStakeholder.organization}`,
          senderInitials: targetStakeholder.initials,
          subject: `Direct Inquiry with ${targetStakeholder.name}`,
          content: `Conversation initiated with ${targetStakeholder.name} via PTIC People. You are connected within the council network.`,
          time: 'Active now',
          category: 'message',
          unread: false,
          replies: []
        };
        setMessages((prev) => [newConversation, ...prev]);
        setActiveMessage(newConversation);
        setMobileView('chat');
      }
    }
  }, [isOpen, targetStakeholder]);

  // Keep an active message selected by default on desktop
  useEffect(() => {
    if (isOpen && !activeMessage && messages.length > 0) {
      setActiveMessage(messages[0]);
    }
  }, [isOpen, activeMessage, messages]);

  const filteredMessages = messages.filter((m) => {
    let matchesTab = false;
    if (selectedTab === 'all') matchesTab = true;
    else if (selectedTab === 'message') matchesTab = m.category === 'message';
    else if (selectedTab === 'event') matchesTab = m.category === 'event';
    else if (selectedTab === 'course') matchesTab = m.category === 'council' || m.category === 'course';

    const query = search.toLowerCase();
    const matchesQuery =
      m.sender.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query) ||
      m.content.toLowerCase().includes(query);

    return matchesTab && matchesQuery;
  });

  const unreadCount = messages.filter((m) => m.unread).length;

  const handleSelectMessage = (msg: InboxMessage) => {
    setActiveMessage(msg);
    setMobileView('chat');
    if (msg.unread) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
      );
    }
  };

  const handleAttachPreset = (forType: 'reply' | 'compose', type: 'image' | 'file') => {
    const presetAttachment: MessageAttachment = type === 'image'
      ? {
          name: 'Flock_Ventilation_Sensor_Chart.png',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          type: 'image',
          size: '860 KB'
        }
      : {
          name: 'PTIC_Shed_Biosecurity_Protocol.pdf',
          type: 'file',
          size: '1.4 MB'
        };

    if (forType === 'reply') {
      setReplyAttachment(presetAttachment);
    } else {
      setComposeAttachment(presetAttachment);
    }
    showToast('Attachment Added', presetAttachment.name, 'info');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !replyAttachment) return;
    if (!activeMessage) return;

    const newReply = {
      sender: CURRENT_USER.name,
      content: replyText.trim(),
      time: 'Just now',
      attachment: replyAttachment || undefined,
    };

    const updated: InboxMessage = {
      ...activeMessage,
      replies: [...(activeMessage.replies || []), newReply],
    };

    setActiveMessage(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === activeMessage.id ? updated : m))
    );
    setReplyText('');
    setReplyAttachment(null);
    showToast('Reply Sent', 'Your message has been delivered to stakeholder.', 'success');
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const newMsg: InboxMessage = {
      id: `msg-${Date.now()}`,
      sender: composeRecipient,
      senderRole: 'Council Stakeholder',
      senderInitials: composeRecipient.slice(0, 2).toUpperCase(),
      subject: composeSubject.trim(),
      content: composeBody.trim(),
      time: 'Just now',
      category: 'message',
      unread: false,
      attachment: composeAttachment || undefined,
      replies: []
    };

    setMessages([newMsg, ...messages]);
    setActiveMessage(newMsg);
    setMobileView('chat');
    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeBody('');
    setComposeAttachment(null);
    showToast('Message Sent', `Message transmitted to ${composeRecipient}.`, 'success');
  };

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, unread: false })));
    showToast('All messages marked as read', undefined, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={unreadCount > 0 ? `${t('messaging', 'Council Inbox & CRM')} (${unreadCount} ${t('unread', 'unread')})` : t('messaging', 'Council Inbox & CRM Conversations')}
      description={t('inboxDesc', 'Direct stakeholder communications, event pass confirmations, and official course advisories')}
      maxWidth="2xl"
      footer={
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck size={14} />}
            >
              {t('markAllRead', 'Mark all read')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsComposeOpen(true)}
              leftIcon={<Plus size={14} />}
            >
              {t('newMessage', 'New Message')}
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('common.cancel', 'Close')}
          </Button>
        </div>
      }
    >
      {/* CRM Main Two-Pane Container */}
      <div className="flex flex-col md:flex-row h-[72vh] -mx-4 -my-4 overflow-hidden border-t border-ptic-border dark:border-[#294966] text-left">
        
        {/* ========================================================
            LEFT PANE: CONVERSATION LIST (CRM LIST AREA)
            ======================================================== */}
        <div className={`w-full md:w-[360px] shrink-0 border-r border-ptic-border dark:border-[#294966] bg-[#F9FBFC] dark:bg-[#0A1931] flex flex-col ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Top Search & Category Filters */}
          <div className="p-3.5 space-y-2.5 border-b border-ptic-border dark:border-[#294966] bg-white dark:bg-[#102640]">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t('searchConversations', 'Search conversations, senders...')}
            />

            {/* Existing Categories: All, Messages, Event Updates, Course Alerts */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-left">
              {[
                { id: 'all', label: t('all', 'All'), icon: Inbox },
                { id: 'message', label: t('messages', 'Messages'), icon: Mail },
                { id: 'event', label: t('eventUpdates', 'Event Updates'), icon: Calendar },
                { id: 'course', label: t('courseAlerts', 'Course Alerts'), icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap select-none flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-ptic-primary text-white shadow-subtle'
                        : 'bg-ptic-bg dark:bg-[#153451] text-ptic-dark/80 dark:text-[#B3CFE5] hover:bg-ptic-soft/20 dark:hover:bg-[#1A3D63] border border-ptic-border dark:border-[#294966]'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-ptic-textMuted dark:text-[#B3CFE5]">
                {t('noConversations', 'No conversations found in this category.')}
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = activeMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3 rounded-[12px] border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                      isSelected
                        ? 'bg-white dark:bg-[#1A3D63] border-ptic-secondary shadow-card ring-1 ring-ptic-secondary/20'
                        : msg.unread
                        ? 'bg-ptic-soft/20 dark:bg-[#153451] border-ptic-soft/80 dark:border-[#294966] hover:bg-ptic-soft/30 dark:hover:bg-[#1A3D63]'
                        : 'bg-white/70 dark:bg-[#102640]/70 border-ptic-border dark:border-[#294966] hover:bg-white dark:hover:bg-[#102640]'
                    }`}
                  >
                    <Avatar initials={msg.senderInitials || msg.sender.slice(0, 2)} size="sm" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${msg.unread ? 'text-ptic-dark dark:text-[#F6FAFD]' : 'text-ptic-dark/90 dark:text-[#F6FAFD]/90'}`}>
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-ptic-textMuted dark:text-[#B3CFE5] shrink-0 font-medium">{msg.time}</span>
                      </div>

                      {msg.senderRole && (
                        <p className="text-[10px] text-ptic-secondary truncate font-medium mt-0.5">
                          {msg.senderRole}
                        </p>
                      )}

                      <p className={`text-xs mt-1 truncate ${msg.unread ? 'font-semibold text-ptic-dark dark:text-[#F6FAFD]' : 'text-ptic-dark/80 dark:text-[#F6FAFD]/80'}`}>
                        {msg.subject}
                      </p>

                      <p className="text-[11px] text-ptic-textMuted dark:text-[#B3CFE5] truncate leading-snug">
                        {msg.content}
                      </p>
                    </div>

                    {msg.unread && (
                      <span className="w-2 h-2 rounded-full bg-ptic-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT PANE: CONVERSATION AREA (CRM THREAD & COMPOSER)
            ======================================================== */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#102640] overflow-hidden ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          {activeMessage ? (
            <>
              {/* Conversation Header */}
              <div className="p-3.5 sm:px-5 border-b border-ptic-border dark:border-[#294966] bg-white dark:bg-[#102640] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    className="md:hidden p-1.5 rounded-[8px] hover:bg-ptic-bg dark:hover:bg-[#153451] text-ptic-secondary"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <Avatar initials={activeMessage.senderInitials || activeMessage.sender.slice(0, 2)} size="md" statusIndicator="online" />
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-ptic-dark dark:text-[#F6FAFD] truncate">
                        {activeMessage.sender}
                      </h4>
                      <Badge variant={activeMessage.category === 'event' ? 'secondary' : 'soft'} size="sm">
                        {activeMessage.category === 'event' ? t('eventUpdate', 'Event Update') : activeMessage.category === 'council' || activeMessage.category === 'course' ? t('courseAlert', 'Course Alert') : t('directMessage', 'Direct Message')}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-ptic-secondary font-medium truncate">
                      {activeMessage.senderRole || 'Verified PTIC Stakeholder'}
                    </p>
                  </div>
                </div>

                {/* Quick actions in conversation header */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeMessage.eventId && onNavigateToEvents && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onNavigateToEvents();
                      }}
                      leftIcon={<Calendar size={13} />}
                    >
                      {t('eventDetails', 'Event Details')}
                    </Button>
                  )}
                  <span className="text-[11px] text-ptic-textMuted dark:text-[#B3CFE5] hidden sm:flex items-center gap-1 font-mono">
                    <Clock size={11} /> {activeMessage.time}
                  </span>
                </div>
              </div>

              {/* Subject Bar */}
              <div className="px-4 py-2 bg-ptic-bg/60 dark:bg-[#0A1931]/60 border-b border-ptic-border dark:border-[#294966] flex items-center justify-between text-xs">
                <span className="font-bold text-ptic-dark dark:text-[#F6FAFD] truncate">
                  {t('subject', 'Subject')}: {activeMessage.subject}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 size={11} /> {t('encryptedSession', 'Encrypted Council Session')}
                </span>
              </div>

              {/* Scrollable Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAFCFD] dark:bg-[#0A1931]">
                {/* Initial Inbound Message Bubble */}
                <div className="max-w-2xl bg-white dark:bg-[#153451] p-4 rounded-[16px] rounded-tl-[4px] border border-ptic-border dark:border-[#294966] shadow-subtle space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-ptic-textMuted dark:text-[#B3CFE5] border-b border-ptic-border dark:border-[#294966] pb-1.5">
                    <span className="font-semibold text-ptic-dark dark:text-[#F6FAFD]">{activeMessage.sender}</span>
                    <span>{activeMessage.time}</span>
                  </div>

                  <p className="text-xs text-ptic-dark/90 dark:text-[#F6FAFD]/90 leading-relaxed whitespace-pre-line">
                    {activeMessage.content}
                  </p>

                  {/* Attachment if present */}
                  {activeMessage.attachment && (
                    <div className="mt-2.5 pt-2 border-t border-ptic-border">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ptic-secondary block mb-1">
                        Attached Document
                      </span>
                      {activeMessage.attachment.type === 'image' && activeMessage.attachment.url ? (
                        <div className="rounded-[10px] overflow-hidden border border-ptic-border bg-ptic-bg max-w-sm">
                          <img
                            src={activeMessage.attachment.url}
                            alt={activeMessage.attachment.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 flex items-center justify-between text-xs bg-white">
                            <span className="font-semibold text-ptic-dark truncate">{activeMessage.attachment.name}</span>
                            <span className="text-[10px] text-ptic-textMuted">{activeMessage.attachment.size}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-[10px] bg-ptic-bg border border-ptic-border flex items-center justify-between gap-3 text-xs max-w-sm">
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={16} className="text-ptic-primary" />
                            <span className="font-semibold text-ptic-dark truncate">{activeMessage.attachment.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast('Downloading Attachment', activeMessage.attachment?.name, 'success')}
                            className="p-1 rounded text-ptic-secondary hover:text-ptic-primary hover:bg-white"
                            title="Download"
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Thread Replies */}
                {activeMessage.replies && activeMessage.replies.map((rep, idx) => {
                  const isCurrentUser = rep.sender === CURRENT_USER.name;
                  return (
                    <div 
                      key={idx}
                      className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-xl p-3.5 rounded-[16px] text-xs space-y-1.5 shadow-subtle ${
                        isCurrentUser
                          ? 'bg-ptic-primary text-white rounded-tr-[4px]'
                          : 'bg-white text-ptic-dark rounded-tl-[4px] border border-ptic-border'
                      }`}>
                        <div className={`flex items-center justify-between gap-3 text-[10px] ${
                          isCurrentUser ? 'text-ptic-soft' : 'text-ptic-textMuted'
                        }`}>
                          <span className="font-semibold">{rep.sender}</span>
                          <span>{rep.time}</span>
                        </div>

                        <p className="leading-relaxed whitespace-pre-line">{rep.content}</p>

                        {rep.attachment && (
                          <div className={`mt-2 p-2 rounded-[8px] flex items-center justify-between gap-2 text-xs ${
                            isCurrentUser ? 'bg-white/10 text-white' : 'bg-ptic-bg text-ptic-dark border border-ptic-border'
                          }`}>
                            <div className="flex items-center gap-1.5 truncate">
                              {rep.attachment.type === 'image' ? <ImageIcon size={13} /> : <FileText size={13} />}
                              <span className="font-medium truncate">{rep.attachment.name}</span>
                            </div>
                            <span className="text-[10px] opacity-80 shrink-0">{rep.attachment.size}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer (Bottom) */}
              <form onSubmit={handleSendReply} className="p-3.5 border-t border-ptic-border dark:border-[#294966] bg-white dark:bg-[#102640] space-y-2 shrink-0">
                {replyAttachment && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-ptic-soft/30 dark:bg-[#153451] text-ptic-dark dark:text-[#F6FAFD] text-xs border border-ptic-soft dark:border-[#294966]">
                    <Paperclip size={12} className="text-ptic-secondary" />
                    <span className="font-medium truncate max-w-[220px]">{replyAttachment.name}</span>
                    <button type="button" onClick={() => setReplyAttachment(null)} className="hover:text-rose-600 ml-1">
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`${t('replyTo', 'Reply to')} ${activeMessage.sender}...`}
                    className="flex-1 bg-ptic-bg/60 dark:bg-[#153451] text-ptic-dark dark:text-[#F6FAFD] border border-ptic-border dark:border-[#294966] rounded-[12px] p-2.5 text-xs focus:border-ptic-secondary focus:bg-white dark:focus:bg-[#153451] focus:outline-none resize-none"
                    required={!replyAttachment}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!replyText.trim() && !replyAttachment}
                    leftIcon={<Send size={14} />}
                  >
                    {t('send', 'Send')}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAttachPreset('reply', 'file')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-medium text-ptic-secondary hover:bg-ptic-bg dark:hover:bg-[#153451] border border-ptic-border dark:border-[#294966] transition-colors cursor-pointer"
                    >
                      <FileText size={12} />
                      <span>{t('attachPdf', 'Attach PDF Report')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttachPreset('reply', 'image')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-medium text-ptic-secondary hover:bg-ptic-bg dark:hover:bg-[#153451] border border-ptic-border dark:border-[#294966] transition-colors cursor-pointer"
                    >
                      <ImageIcon size={12} />
                      <span>{t('attachPhoto', 'Attach Photo')}</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-ptic-textMuted dark:text-[#B3CFE5] hidden sm:inline">
                    {t('pressSendToTransmit', 'Press Send to transmit across PTIC CRM network')}
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-ptic-textMuted dark:text-[#B3CFE5] space-y-3">
              <div className="w-12 h-12 rounded-full bg-ptic-bg dark:bg-[#153451] flex items-center justify-center text-ptic-secondary">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-ptic-dark dark:text-[#F6FAFD]">{t('selectConversation', 'Select a conversation')}</p>
                <p className="text-xs text-ptic-textMuted dark:text-[#B3CFE5] mt-0.5">
                  {t('selectConversationDesc', 'Choose a stakeholder message or event alert on the left to read and reply.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose New Message Modal */}
      {isComposeOpen && (
        <Modal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          title={t('composeMessage', 'Compose Council Message')}
          description={t('composeDesc', 'Send direct stakeholder communication or technical inquiry')}
          maxWidth="md"
        >
          <form onSubmit={handleComposeSubmit} className="space-y-3.5 text-left max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ptic-dark/90 dark:text-[#F6FAFD]/90">{t('recipientStakeholder', 'Recipient Stakeholder')} *</label>
              <select
                value={composeRecipient}
                onChange={(e) => setComposeRecipient(e.target.value)}
                className="w-full bg-white dark:bg-[#153451] text-ptic-dark dark:text-[#F6FAFD] border border-ptic-soft/80 dark:border-[#294966] rounded-[12px] px-3.5 py-2 text-xs focus:border-ptic-secondary"
              >
                {MOCK_STAKEHOLDERS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.role} · {s.organization})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={`${t('subject', 'Subject / Discussion Topic')} *`}
              placeholder="e.g. Inquiring regarding shed fogger specs"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ptic-dark/90 dark:text-[#F6FAFD]/90">{t('messageContent', 'Message Content')} *</label>
              <textarea
                rows={4}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your message or inquiry..."
                className="w-full bg-white dark:bg-[#153451] text-ptic-dark dark:text-[#F6FAFD] border border-ptic-soft/80 dark:border-[#294966] rounded-[12px] p-3 text-xs focus:border-ptic-secondary focus:outline-none"
                required
              />
            </div>

            {/* Quick Attachments for compose */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAttachPreset('compose', 'file')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-medium text-ptic-secondary hover:bg-ptic-bg dark:hover:bg-[#153451] border border-ptic-border dark:border-[#294966]"
              >
                <FileText size={12} /> {t('attachPdf', 'Attach Document')}
              </button>
              <button
                type="button"
                onClick={() => handleAttachPreset('compose', 'image')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-medium text-ptic-secondary hover:bg-ptic-bg dark:hover:bg-[#153451] border border-ptic-border dark:border-[#294966]"
              >
                <ImageIcon size={12} /> {t('attachPhoto', 'Attach Image')}
              </button>
              {composeAttachment && (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ {composeAttachment.name}
                </span>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsComposeOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={13} />}>
                {t('sendMessage', 'Send Message')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Modal>
  );
};
