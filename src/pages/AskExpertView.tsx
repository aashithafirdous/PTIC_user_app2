import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { ExpertQuestion } from '../types';
import { 
  ArrowRight,
  Share2, 
  Send, 
  ThumbsUp, 
  MessageSquare,
  Image,
  Video,
  Play,
  X,
  Sparkles,
  LayoutGrid,
  HelpCircle,
  Clock,
  Search
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { slugify, pushNav, parseCurrentLocation, resolveQuestionBySlugOrId } from '../lib/router';
import { useApp, THREE_SUGGESTED_QUESTIONS } from '../context/AppContext';

type SidebarTab = 'hub' | 'like' | 'comments' | 'ask';

export const AskExpertView: React.FC = () => {
  const { showToast } = useToast();
  const {
    questions,
    likedQuestionIds,
    likedAnswerIds,
    userQuestionIds,
    contributedQuestionIds,
    toggleLikeQuestion,
    toggleLikeAnswer,
    createQuestion,
    addAnswer,
    addComment,
    openShare,
    currentUser,
    isAuthenticated,
    setIsLoginModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<SidebarTab>('hub');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer Expansion State
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDesc, setQuestionDesc] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Active question modal for deep discussion view
  const [activeQuestion, setActiveQuestion] = useState<ExpertQuestion | null>(null);
  const [activeQuestionAnswerText, setActiveQuestionAnswerText] = useState('');

  // Inline Comment / Answer expansion per card on Hub
  const [activeInlineCommentQuestionId, setActiveInlineCommentQuestionId] = useState<string | null>(null);
  const [inlineCommentText, setInlineCommentText] = useState('');
  const [activeInlineAnswerQuestionId, setActiveInlineAnswerQuestionId] = useState<string | null>(null);
  const [inlineAnswerText, setInlineAnswerText] = useState('');

  // Sync active question with URL (/ask-experts/question/:slug)
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentLocation();
      if (parsed.questionSlug) {
        const found = resolveQuestionBySlugOrId(parsed.questionSlug, questions);
        if (found) {
          setActiveQuestion(found);
          return;
        }
      }
      if (parsed.route === 'ask' && !parsed.questionSlug) {
        setActiveQuestion(null);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('ptic-navigate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('ptic-navigate', handleUrlChange);
    };
  }, [questions]);

  const handleOpenQuestion = (q: ExpertQuestion) => {
    setActiveQuestion(q);
    pushNav(`/ask-experts/question/${slugify(q.title)}`);
  };

  const handleCloseQuestion = () => {
    setActiveQuestion(null);
    pushNav('/ask-experts');
  };

  const handleShare = (q: ExpertQuestion, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/ask-experts/question/${slugify(q.title)}`;
    openShare({
      title: q.title,
      text: q.description || `Read discussion on PTIC Community: ${q.title}`,
      url: shareUrl,
    });
  };

  // Composer Media Attachment Handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
        setIsComposerExpanded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setAttachedVideo(videoUrl);
      setIsComposerExpanded(true);
    }
  };

  // Submitting Question from Composer
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!questionTitle.trim()) {
      showToast('Question title required', 'Please enter your question title.', 'info');
      return;
    }

    createQuestion({
      title: questionTitle.trim(),
      description: questionDesc.trim() || undefined,
      category: 'General Technical',
      imageUrl: attachedImage || undefined,
      videoUrl: attachedVideo || undefined,
    });

    setQuestionTitle('');
    setQuestionDesc('');
    setAttachedImage(null);
    setAttachedVideo(null);
    setIsComposerExpanded(false);
  };

  // Handle Suggested Question click
  const handleSuggestedClick = (suggested: ExpertQuestion) => {
    const existing = questions.find((q) => q.title.toLowerCase() === suggested.title.toLowerCase());
    if (existing) {
      handleOpenQuestion(existing);
    } else {
      setQuestionTitle(suggested.title);
      setQuestionDesc(suggested.description || '');
      setIsComposerExpanded(true);
    }
  };

  // Professional Navigation Tabs using Lucide line icons without emojis
  const sidebarItems: Array<{ id: SidebarTab; label: string; icon: React.ReactNode }> = [
    { id: 'hub', label: 'All Discussions', icon: <LayoutGrid size={16} /> },
    { id: 'like', label: 'Liked Posts', icon: <ThumbsUp size={16} /> },
    { id: 'comments', label: 'My Contributions', icon: <MessageSquare size={16} /> },
    { id: 'ask', label: 'My Questions', icon: <HelpCircle size={16} /> },
  ];

  // Filtered Content Based on Active Sidebar Tab + Search
  const getTabContent = () => {
    let list: ExpertQuestion[] = [];
    switch (activeTab) {
      case 'like':
        list = questions.filter((q) => likedQuestionIds.includes(q.id));
        break;
      case 'comments':
        list = questions.filter((q) => contributedQuestionIds.includes(q.id));
        break;
      case 'ask':
        list = questions.filter((q) => userQuestionIds.includes(q.id) || q.author === currentUser.name);
        break;
      case 'hub':
      default:
        list = questions;
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => 
        item.title.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.author.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const displayedQuestions = getTabContent();

  return (
    <div className="w-full max-w-full px-0 sm:px-1 text-left font-sans animate-fadeIn py-3">
      
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR (Simple, Clean Professional Navigation)     */}
        {/* ======================================================== */}
        <aside 
          className="lg:col-span-3 bg-white dark:bg-[#153451] rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 shadow-sm sticky top-[80px]"
          aria-label="Knowledge Navigation"
        >
          {/* Simple Clean Header */}
          <div className="pb-3 border-b border-slate-100 dark:border-[#294966]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
              Knowledge Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
              Technical insights & expert Q&A
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative pt-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] rounded-xl text-xs text-slate-800 dark:text-[#F6FAFD] placeholder:text-slate-400 focus:outline-none focus:border-[#135E69]"
            />
          </div>

          {/* Professional Navigation Tabs */}
          <nav className="space-y-1 pt-2 text-left" aria-label="Knowledge Navigation Menu">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              let badgeCount: number | undefined;
              if (item.id === 'like') badgeCount = likedQuestionIds.length;
              if (item.id === 'comments') badgeCount = contributedQuestionIds.length;
              if (item.id === 'ask') badgeCount = userQuestionIds.length;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#135E69] text-white shadow-sm'
                      : 'text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-50 dark:hover:bg-[#1A3D63] hover:text-[#135E69] dark:hover:text-[#5ce0d2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-[#88B0D3]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {badgeCount !== undefined && badgeCount > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-[#102640] text-slate-600 dark:text-[#B3CFE5]'
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ======================================================== */}
        {/* MAIN CONTENT AREA                                        */}
        {/* ======================================================== */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Header Title & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-[#294966]">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F6FAFD] tracking-tight">
                {activeTab === 'hub' && 'Community Knowledge Hub'}
                {activeTab === 'like' && 'Liked Discussions'}
                {activeTab === 'comments' && 'My Contributed Answers & Comments'}
                {activeTab === 'ask' && 'My Questions'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#B3CFE5] mt-0.5">
                {activeTab === 'hub' && 'Explore questions, verified peer insights, and technical veterinary guidance.'}
                {activeTab === 'like' && 'Discussions and answers you have bookmarked with a like.'}
                {activeTab === 'comments' && 'Discussions where you provided direct answers or feedback.'}
                {activeTab === 'ask' && 'Questions you have submitted to the community.'}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] self-start sm:self-auto">
              {displayedQuestions.length} {displayedQuestions.length === 1 ? 'Discussion' : 'Discussions'}
            </span>
          </div>

          {/* ======================================================== */}
          {/* QUESTION COMPOSER                                        */}
          {/* ======================================================== */}
          <div className="sticky top-[72px] z-20 bg-white/95 dark:bg-[#153451]/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-[#294966] p-4 sm:p-5 shadow-md space-y-3.5 transition-all">
            {/* Top Prompt Row */}
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#135E69] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white dark:ring-[#153451]">
                {currentUser.initials}
              </div>

              {/* Clean Input Box */}
              <div className="flex-1">
                <input
                  type="text"
                  value={questionTitle}
                  onFocus={() => setIsComposerExpanded(true)}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="Ask a technical or field question..."
                  className="w-full bg-slate-50 dark:bg-[#102640] border border-slate-200/80 dark:border-[#294966] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-[#F6FAFD] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#135E69]/20 focus:border-[#135E69] transition-all"
                />
              </div>

              {!isComposerExpanded && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsComposerExpanded(true)}
                  leftIcon={<HelpCircle size={14} />}
                >
                  Ask
                </Button>
              )}
            </div>

            {/* EXPANDED COMPOSER SECTION */}
            {isComposerExpanded && (
              <form onSubmit={handlePostQuestion} className="space-y-3.5 pt-3 animate-fadeIn border-t border-slate-100 dark:border-[#294966]">
                {/* Description Textarea */}
                <div>
                  <textarea
                    rows={3}
                    value={questionDesc}
                    onChange={(e) => setQuestionDesc(e.target.value)}
                    placeholder="Provide additional details, symptoms, farm environment, or technical context (optional)..."
                    className="w-full bg-slate-50/60 dark:bg-[#102640]/60 border border-slate-200/80 dark:border-[#294966] rounded-xl p-3 text-xs sm:text-sm text-slate-800 dark:text-[#F6FAFD] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#135E69]/20 focus:border-[#135E69]"
                  />
                </div>

                {/* Attached Media Previews */}
                {(attachedImage || attachedVideo) && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#102640] rounded-xl border border-slate-200 dark:border-[#294966]">
                    {attachedImage && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-[#294966]">
                        <img src={attachedImage} alt="Attachment" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAttachedImage(null)}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-rose-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {attachedVideo && (
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-[#294966] bg-black flex items-center justify-center">
                        <video src={attachedVideo} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAttachedVideo(null)}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-rose-600 z-10"
                        >
                          <X size={12} />
                        </button>
                        <Play size={20} className="text-white opacity-80" />
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />

                {/* Composer Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      leftIcon={<Image size={14} />}
                    >
                      Add Photo
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => videoInputRef.current?.click()}
                      leftIcon={<Video size={14} />}
                    >
                      Add Video
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsComposerExpanded(false);
                        setQuestionTitle('');
                        setQuestionDesc('');
                        setAttachedImage(null);
                        setAttachedVideo(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!questionTitle.trim()}
                      leftIcon={<Send size={14} />}
                    >
                      Post Question
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* ======================================================== */}
          {/* THREE SUGGESTED QUESTIONS                                */}
          {/* ======================================================== */}
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-[#B3CFE5] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#135E69] dark:text-[#5ce0d2]" />
                Suggested Questions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {THREE_SUGGESTED_QUESTIONS.map((sq) => (
                <div
                  key={sq.id}
                  onClick={() => handleSuggestedClick(sq)}
                  className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] hover:border-[#135E69]/40 hover:bg-[#135E69]/[0.03] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#F6FAFD] group-hover:text-[#135E69] dark:group-hover:text-[#5ce0d2] leading-snug line-clamp-2">
                    {sq.title}
                  </p>
                  <div className="w-6 h-6 rounded-full bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* QUESTIONS LIST                                           */}
          {/* ======================================================== */}
          <div className="space-y-4">
            {displayedQuestions.length === 0 ? (
              <EmptyState
                title={
                  activeTab === 'like'
                    ? 'No liked discussions yet'
                    : activeTab === 'comments'
                    ? 'No contributed answers yet'
                    : activeTab === 'ask'
                    ? 'You have not asked any questions yet'
                    : 'No questions found'
                }
                description={
                  activeTab === 'like'
                    ? 'Tap the Like button on any discussion to bookmark it here.'
                    : activeTab === 'comments'
                    ? 'Submit an answer or comment on any question to track it here.'
                    : activeTab === 'ask'
                    ? 'Use the composer above to submit your first question.'
                    : 'Try adjusting your search or check back later for new expert discussions.'
                }
              />
            ) : (
              displayedQuestions.map((q) => {
                const isLiked = likedQuestionIds.includes(q.id);
                const isInlineCommentOpen = activeInlineCommentQuestionId === q.id;
                const isInlineAnswerOpen = activeInlineAnswerQuestionId === q.id;

                return (
                  <Card
                    key={q.id}
                    padding="none"
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#294966] bg-white dark:bg-[#153451] shadow-sm space-y-3.5 transition-all"
                  >
                    {/* Author & Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#135E69]/15 text-[#135E69] dark:text-[#5ce0d2] font-bold text-xs flex items-center justify-center shrink-0">
                          {q.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-[#F6FAFD] truncate">
                            {q.author}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-[#B3CFE5] truncate flex items-center gap-1.5">
                            <span>{q.authorRole}</span>
                            <span>•</span>
                            <span>{q.location}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Clock size={10} /> {q.timeAgo}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Question Title & Description */}
                    <div>
                      <h3 
                        onClick={() => handleOpenQuestion(q)}
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F6FAFD] hover:text-[#135E69] dark:hover:text-[#5ce0d2] transition-colors leading-snug cursor-pointer"
                      >
                        {q.title}
                      </h3>
                      {q.description && (
                        <p className="text-xs text-slate-600 dark:text-[#B3CFE5] mt-1.5 leading-relaxed">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Uploaded Image (if present) */}
                    {q.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966] max-h-80 bg-slate-900">
                        <img 
                          src={q.imageUrl} 
                          alt={q.title} 
                          className="w-full h-full object-cover max-h-80" 
                        />
                      </div>
                    )}

                    {/* Uploaded Video (if present) */}
                    {q.videoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966] bg-black aspect-video flex items-center justify-center relative">
                        <video 
                          src={q.videoUrl} 
                          controls 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )}

                    {/* Special "Your Contribution" view for Comments tab */}
                    {activeTab === 'comments' && (
                      <div className="p-3 rounded-xl bg-[#135E69]/[0.05] border border-[#135E69]/20 text-xs space-y-1">
                        <span className="font-bold text-[#135E69] dark:text-[#5ce0d2] block">
                          Your Contribution:
                        </span>
                        <p className="text-slate-700 dark:text-[#F6FAFD]">
                          {q.answers?.find((a) => a.author.includes(currentUser.name))?.content ||
                            'Contributed discussion feedback and practical advice for growers.'}
                        </p>
                      </div>
                    )}

                    {/* Post Interaction Bar: Like, Comment, Answer, Share (Dislike removed completely) */}
                    <div className="pt-2 border-t border-slate-100 dark:border-[#294966] flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        {/* Like Pill Button */}
                        <button
                          type="button"
                          onClick={() => toggleLikeQuestion(q.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                            isLiked
                              ? 'bg-[#135E69] text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] hover:bg-[#135E69]/10 hover:text-[#135E69]'
                          }`}
                          title="Like this discussion"
                        >
                          <ThumbsUp size={13} className={isLiked ? 'fill-white' : ''} />
                          <span>{q.likesCount || 0}</span>
                        </button>

                        {/* Comment Button (Toggles Inline Comment) */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInlineCommentQuestionId(
                              isInlineCommentOpen ? null : q.id
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold bg-slate-100 dark:bg-[#102640] text-slate-700 dark:text-[#B3CFE5] hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <MessageSquare size={13} />
                          <span>Comment</span>
                        </button>

                        {/* Answer Button (Toggles Answer Composer) */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInlineAnswerQuestionId(
                              isInlineAnswerOpen ? null : q.id
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold bg-[#135E69]/10 text-[#135E69] dark:bg-[#18A999]/20 dark:text-[#5ce0d2] hover:bg-[#135E69]/20 transition-all cursor-pointer"
                        >
                          <span>Answer</span>
                          <span>({q.answersCount || q.answers?.length || 0})</span>
                        </button>
                      </div>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={(e) => handleShare(q, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-slate-500 hover:text-[#135E69] dark:text-[#B3CFE5] dark:hover:text-[#5ce0d2] hover:bg-slate-100 dark:hover:bg-[#102640] transition-colors cursor-pointer"
                        title="Share discussion"
                      >
                        <Share2 size={13} />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Inline Comment Input Box */}
                    {isInlineCommentOpen && (
                      <div className="pt-2 border-t border-slate-100 dark:border-[#294966] space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inlineCommentText}
                            onChange={(e) => setInlineCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && inlineCommentText.trim()) {
                                const targetAns = q.answers?.[0]?.id || `default-ans-${q.id}`;
                                addComment(q.id, targetAns, inlineCommentText.trim());
                                setInlineCommentText('');
                              }
                            }}
                            placeholder="Add a comment or observation..."
                            className="flex-1 bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] rounded-xl px-3.5 py-1.5 text-xs text-slate-800 dark:text-[#F6FAFD] outline-none focus:border-[#135E69]"
                          />
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={!inlineCommentText.trim()}
                            onClick={() => {
                              const targetAns = q.answers?.[0]?.id || `default-ans-${q.id}`;
                              addComment(q.id, targetAns, inlineCommentText.trim());
                              setInlineCommentText('');
                            }}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Inline Answer Composer */}
                    {isInlineAnswerOpen && (
                      <div className="pt-2 border-t border-slate-100 dark:border-[#294966] space-y-2.5 animate-fadeIn">
                        <textarea
                          rows={2}
                          value={inlineAnswerText}
                          onChange={(e) => setInlineAnswerText(e.target.value)}
                          placeholder="Write your technical or practical answer..."
                          className="w-full bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966] rounded-xl p-2.5 text-xs text-slate-800 dark:text-[#F6FAFD] outline-none focus:border-[#135E69]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveInlineAnswerQuestionId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={!inlineAnswerText.trim()}
                            onClick={() => {
                              addAnswer(q.id, inlineAnswerText.trim());
                              setInlineAnswerText('');
                              setActiveInlineAnswerQuestionId(null);
                            }}
                          >
                            Submit Answer
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Answers Summary Preview */}
                    {q.answers && q.answers.length > 0 && (
                      <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-[#294966]">
                        {q.answers.slice(0, 1).map((ans) => {
                          const isAnsLiked = likedAnswerIds.includes(ans.id);
                          return (
                            <div 
                              key={ans.id}
                              className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#102640]/50 border border-slate-100 dark:border-[#294966] text-xs text-left space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">
                                  {ans.author}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {ans.timeAgo}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-[#B3CFE5] leading-relaxed">
                                {ans.content}
                              </p>
                              <div className="flex items-center justify-between pt-1 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => toggleLikeAnswer(q.id, ans.id)}
                                  className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                                    isAnsLiked ? 'text-[#135E69] dark:text-[#5ce0d2]' : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  <ThumbsUp size={11} className={isAnsLiked ? 'fill-current' : ''} />
                                  <span>Helpful ({ans.upvotes || 0})</span>
                                </button>
                                <span 
                                  onClick={() => handleOpenQuestion(q)}
                                  className="font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline cursor-pointer"
                                >
                                  View all ({q.answersCount || q.answers?.length}) answers →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL QUESTION DISCUSSION MODAL (/ask-experts/:slug)      */}
      {/* ======================================================== */}
      {activeQuestion && (
        <Modal
          isOpen={!!activeQuestion}
          onClose={handleCloseQuestion}
          title={activeQuestion.title}
          description={`Asked by ${activeQuestion.author} (${activeQuestion.authorRole}) · ${activeQuestion.location} · ${activeQuestion.timeAgo}`}
          maxWidth="lg"
          headerActions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleShare(activeQuestion)}
              leftIcon={<Share2 size={13} />}
            >
              Share
            </Button>
          }
        >
          <div className="space-y-5 text-left pt-1">
            {/* Description */}
            {activeQuestion.description && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#102640] border border-slate-200 dark:border-[#294966]">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#B3CFE5] leading-relaxed">
                  {activeQuestion.description}
                </p>
              </div>
            )}

            {/* Media if present */}
            {activeQuestion.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966]">
                <img src={activeQuestion.imageUrl} alt="Attachment" className="w-full max-h-96 object-cover" />
              </div>
            )}
            {activeQuestion.videoUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#294966] bg-black aspect-video flex items-center justify-center">
                <video src={activeQuestion.videoUrl} controls className="w-full h-full object-contain" />
              </div>
            )}

            {/* Write Answer Form */}
            <div className="p-4 rounded-xl bg-[#135E69]/[0.04] border border-[#135E69]/20 space-y-3">
              <span className="text-xs font-bold text-[#135E69] dark:text-[#5ce0d2] block">
                Contribute an Expert Answer
              </span>
              <textarea
                rows={3}
                value={activeQuestionAnswerText}
                onChange={(e) => setActiveQuestionAnswerText(e.target.value)}
                placeholder="Share your diagnosis, protocol, or practical guidance..."
                className="w-full bg-white dark:bg-[#102640] border border-slate-200 dark:border-[#294966] rounded-xl p-3 text-xs sm:text-sm text-slate-800 dark:text-[#F6FAFD] outline-none focus:border-[#135E69]"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!activeQuestionAnswerText.trim()}
                  onClick={() => {
                    addAnswer(activeQuestion.id, activeQuestionAnswerText.trim());
                    setActiveQuestionAnswerText('');
                  }}
                  leftIcon={<Send size={13} />}
                >
                  Post Answer
                </Button>
              </div>
            </div>

            {/* All Answers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-[#B3CFE5] uppercase tracking-wider">
                Expert Answers ({activeQuestion.answers?.length || 0})
              </h4>

              {(!activeQuestion.answers || activeQuestion.answers.length === 0) ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No answers posted yet. Be the first to answer!
                </p>
              ) : (
                activeQuestion.answers.map((ans) => {
                  const isAnsLiked = likedAnswerIds.includes(ans.id);
                  return (
                    <div
                      key={ans.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#102640] border border-slate-200/90 dark:border-[#294966] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-[#F6FAFD]">
                            {ans.author}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {ans.authorRole} · {ans.authorLocation || 'Verified Member'} · {ans.timeAgo}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLikeAnswer(activeQuestion.id, ans.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold cursor-pointer ${
                            isAnsLiked
                              ? 'bg-[#135E69] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#B3CFE5] hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp size={11} className={isAnsLiked ? 'fill-current' : ''} />
                          <span>Helpful ({ans.upvotes || 0})</span>
                        </button>
                      </div>

                      <p className="text-slate-700 dark:text-[#B3CFE5] leading-relaxed pt-1">
                        {ans.content}
                      </p>

                      {/* Comments under answer */}
                      {ans.comments && ans.comments.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#294966] space-y-1.5 pl-3 border-l-2 border-[#135E69]/30">
                          {ans.comments.map((comm) => (
                            <div key={comm.id} className="text-[11px] text-slate-600 dark:text-[#B3CFE5]">
                              <span className="font-bold text-slate-800 dark:text-[#F6FAFD]">{comm.author}: </span>
                              <span>{comm.content}</span>
                              <span className="text-[9px] text-slate-400 ml-1.5">{comm.timeAgo}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
