import React, { createContext, useContext, useState, useCallback } from 'react';
import { EMartItem, ExpertQuestion, ExpertAnswer, QuestionComment, PTICNotification } from '../types';
import { MOCK_EMART_ITEMS, MOCK_QUESTIONS, INITIAL_NOTIFICATIONS, CURRENT_USER } from '../data/mockData';
import { ShareData, ShareModal } from '../components/common/ShareModal';
import { useToast } from '../components/ui/Toast';

export interface RecordedEnquiry {
  id: string;
  productId: string;
  productTitle: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  notes?: string;
}

export interface AppContextType {
  // Auth State
  isAuthenticated: boolean;
  currentUser: typeof CURRENT_USER;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  login: (identifier?: string, password?: string) => boolean;
  logout: () => void;

  // Products (Profile <-> E-Mart sync)
  products: EMartItem[];
  addProduct: (product: Partial<EMartItem>) => void;
  updateProduct: (product: EMartItem) => void;
  deleteProduct: (id: string) => void;
  syncBusinessProducts: (businessProducts: Array<{ id: string; name: string; category: string; price: string; description: string; imageUrl?: string; inStock?: boolean }>) => void;
  enquiries: RecordedEnquiry[];
  recordEnquiry: (product: EMartItem, notes?: string) => void;

  // Ask Experts State
  questions: ExpertQuestion[];
  likedQuestionIds: string[];
  dislikedQuestionIds: string[];
  likedAnswerIds: string[];
  dislikedAnswerIds: string[];
  userQuestionIds: string[];
  contributedQuestionIds: string[];
  toggleLikeQuestion: (id: string) => void;
  toggleDislikeQuestion: (id: string) => void;
  toggleLikeAnswer: (questionId: string, answerId: string) => void;
  toggleDislikeAnswer: (questionId: string, answerId: string) => void;
  createQuestion: (q: {
    title: string;
    description?: string;
    category: string;
    imageUrl?: string;
    videoUrl?: string;
  }) => ExpertQuestion;
  addAnswer: (questionId: string, content: string) => void;
  addComment: (questionId: string, answerId: string, content: string) => void;

  // Notifications
  notifications: PTICNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Share
  openShare: (data: ShareData) => void;
  closeShare: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Three Suggested Questions strictly specified
export const THREE_SUGGESTED_QUESTIONS: ExpertQuestion[] = [
  {
    id: 'sq-1',
    title: 'What are the best practices for broiler farm management?',
    description: 'Guidelines on tunnel ventilation air-speed, litter moisture maintenance (<25%), and brooding temperature curves for the first 14 days.',
    author: 'Dr. Arun Kumar',
    authorRole: 'Senior Poultry Veterinarian',
    location: 'Namakkal',
    timeAgo: '2h ago',
    answersCount: 2,
    likesCount: 18,
    dislikesCount: 0,
    isLiked: false,
    category: 'Broiler Management',
    isResolved: true,
    answers: [
      {
        id: 'sq-ans-1',
        author: 'Dr. Senthil Kumar',
        authorRole: 'Poultry Specialist',
        authorLocation: 'Coimbatore',
        content: 'Maintain strict biosecurity protocols, optimize tunnel ventilation for uniform air velocity (2.5–3 m/s), keep litter moisture below 25%, and ensure consistent brooding temperatures during the first 14 days.',
        timeAgo: '1h ago',
        upvotes: 9,
        comments: [
          {
            id: 'comm-1',
            author: 'Karthik Rajan',
            content: 'Great protocol! We tried this in our 3rd flock and saw mortality drop by 1.8%.',
            timeAgo: '30m ago',
          }
        ]
      },
      {
        id: 'sq-ans-1b',
        author: 'P. Ravichandran',
        authorRole: 'Farm Manager',
        authorLocation: 'Palladam',
        content: 'Ensure water temperature stays below 25°C with insulated delivery pipes and calibrate drinking nipples daily to prevent wet litter.',
        timeAgo: '30m ago',
        upvotes: 4,
      }
    ],
  },
  {
    id: 'sq-2',
    title: 'How can I improve FCR in my poultry farm?',
    description: 'Looking for verified strategies on feeder pan height adjustment, pellet quality index (PDI), and water acidification to achieve FCR under 1.45.',
    author: 'P. Ravichandran',
    authorRole: 'Commercial Integrator',
    location: 'Palladam',
    timeAgo: '4h ago',
    answersCount: 1,
    likesCount: 14,
    dislikesCount: 0,
    isLiked: false,
    category: 'Nutrition & Feed',
    isResolved: false,
    answers: [
      {
        id: 'sq-ans-2',
        author: 'Dr. Meenakshi Sundaram',
        authorRole: 'Avian Nutrition Scientist',
        authorLocation: 'Chennai',
        content: 'Check pellet quality (PDI > 90%), calibrate feeder pan heights to bird crop level, optimize phase feeding amino acid profiles, and eliminate feed wastage with anti-spill rims.',
        timeAgo: '2h ago',
        upvotes: 14,
      }
    ],
  },
  {
    id: 'sq-3',
    title: 'What are the latest poultry technologies?',
    description: 'Innovations in automated climate telemetry, acoustic distress monitoring, solar hybrid inverters, and computer-vision bird weight tracking.',
    author: 'Karthik Rajan',
    authorRole: 'Agritech Specialist',
    location: 'Namakkal',
    timeAgo: '6h ago',
    answersCount: 1,
    likesCount: 22,
    dislikesCount: 0,
    isLiked: true,
    category: 'Technology & Automation',
    isResolved: true,
    answers: [
      {
        id: 'sq-ans-3',
        author: 'Rajesh Sharma',
        authorRole: 'IoT Automation Engineer',
        authorLocation: 'Coimbatore',
        content: 'Key innovations include IoT automated climate controllers with ammonia/CO2 sensors, computer-vision flock weight estimation, automated nipple drinker flushing systems, and solar hybrid backup power.',
        timeAgo: '3h ago',
        upvotes: 11,
      }
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // 1. Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [currentUser] = useState(CURRENT_USER);

  const login = useCallback((identifier?: string, _password?: string) => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    showToast(
      'Welcome back, Karthik Rajan',
      `Session authenticated as ${identifier || 'Verified Broiler Producer'}.`,
      'success'
    );
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    showToast('Signed out', 'You have securely signed out of your PTIC account.', 'info');
  }, [showToast]);

  // 2. Products State (Profile <-> E-Mart synchronization)
  const [products, setProducts] = useState<EMartItem[]>(() => MOCK_EMART_ITEMS);
  const [enquiries, setEnquiries] = useState<RecordedEnquiry[]>([]);

  const addProduct = useCallback((newProd: Partial<EMartItem>) => {
    const item: EMartItem = {
      id: newProd.id || `em-custom-${Date.now()}`,
      title: newProd.title || 'New Poultry Innovation',
      provider: newProd.provider || 'Rajan Poultry Tech',
      brand: newProd.brand || 'Rajan Tech',
      category: newProd.category || 'Technology & Hardware',
      description: newProd.description || 'High-performance equipment certified by PTIC.',
      tag: 'Council Verified',
      price: newProd.price || '₹15,000 / unit',
      inStock: newProd.inStock !== undefined ? newProd.inStock : true,
      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      galleryImages: newProd.galleryImages || [
        newProd.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'
      ],
      rating: 4.8,
      keyDetails: newProd.keyDetails || ['PTIC Verified', 'In Stock', 'Direct Support'],
      aboutItem: newProd.aboutItem || [
        'Commercial grade construction designed for tropical poultry operations.',
        'Official warranty and dedicated service backing from certified suppliers.',
        'Seamless compatibility with standard automated shed layouts.'
      ],
    };

    setProducts((prev) => [item, ...prev]);
    showToast('Product Added to E-Mart', `"${item.title}" is now available in the council marketplace.`, 'success');
  }, [showToast]);

  const updateProduct = useCallback((updated: EMartItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Product Updated', `Changes to "${updated.title}" synced to E-Mart.`, 'success');
  }, [showToast]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', 'Item removed from E-Mart marketplace.', 'info');
  }, [showToast]);

  // Synchronize products from Profile Business with E-Mart
  const syncBusinessProducts = useCallback((businessProducts: Array<{
    id: string;
    name: string;
    category: string;
    price: string;
    description: string;
    imageUrl?: string;
    inStock?: boolean;
  }>) => {
    setProducts((prev) => {
      // Keep mock items
      const mockNonProfile = prev.filter((p) => !p.id.startsWith('biz-prod-'));
      // Map business products
      const profileItems: EMartItem[] = businessProducts.map((bp) => ({
        id: `biz-prod-${bp.id}`,
        title: bp.name,
        provider: 'Rajan Poultry Integrations',
        brand: 'Rajan Agro',
        category: bp.category || 'Technology & Hardware',
        description: bp.description || 'Quality poultry farming product.',
        tag: 'Council Member Product',
        price: bp.price,
        inStock: bp.inStock !== false,
        imageUrl: bp.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        galleryImages: [
          bp.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'
        ],
        rating: 4.9,
        keyDetails: ['Member Produced', 'Quality Assured', 'Prompt Delivery'],
        aboutItem: [
          'Directly supplied by Rajan Poultry Integrations with council certification.',
          'Engineered for maximum durability in high-density commercial sheds.',
          'Comprehensive warranty and technical advisory support included.'
        ],
      }));

      return [...profileItems, ...mockNonProfile];
    });
  }, []);

  // Notifications State
  const [notifications, setNotifications] = useState<PTICNotification[]>(INITIAL_NOTIFICATIONS);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  const recordEnquiry = useCallback((product: EMartItem, notes?: string) => {
    const newEnquiry: RecordedEnquiry = {
      id: `enq-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      userName: CURRENT_USER.name,
      userEmail: 'karthik.rajan@rajanpoultry.in',
      createdAt: 'Just now',
      notes,
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Push PTIC-relevant notification
    const enqNotification: PTICNotification = {
      id: `n-enq-${Date.now()}`,
      type: 'emart',
      author: 'PTIC E-Mart',
      title: 'Your enquiry has been sent',
      supportingText: `Official council enquiry for "${product.title}" delivered to ${product.provider}.`,
      timestamp: 'Just now',
      unread: true,
      route: 'emart',
      targetId: product.id,
    };

    setNotifications((prev) => [enqNotification, ...prev]);
  }, []);

  // 3. Ask Experts State
  const [questions, setQuestions] = useState<ExpertQuestion[]>(() => [
    ...THREE_SUGGESTED_QUESTIONS,
    ...MOCK_QUESTIONS,
  ]);
  const [likedQuestionIds, setLikedQuestionIds] = useState<string[]>(['sq-1', 'q1']);
  const [dislikedQuestionIds, setDislikedQuestionIds] = useState<string[]>([]);
  const [likedAnswerIds, setLikedAnswerIds] = useState<string[]>(['sq-ans-1', 'ans1']);
  const [dislikedAnswerIds, setDislikedAnswerIds] = useState<string[]>([]);
  const [userQuestionIds, setUserQuestionIds] = useState<string[]>(['sq-3', 'q1']);
  const [contributedQuestionIds, setContributedQuestionIds] = useState<string[]>(['sq-1', 'sq-3', 'q1']);

  const toggleLikeQuestion = useCallback((id: string) => {
    const isCurrentlyLiked = likedQuestionIds.includes(id);

    if (isCurrentlyLiked) {
      // Remove like
      setLikedQuestionIds((prev) => prev.filter((qid) => qid !== id));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, isLiked: false, likesCount: Math.max(0, (q.likesCount || 1) - 1) } : q
        )
      );
      showToast('Like removed', undefined, 'info');
    } else {
      // Add like & remove dislike if active (mutually exclusive)
      setLikedQuestionIds((prev) => [...prev, id]);
      setDislikedQuestionIds((prev) => prev.filter((qid) => qid !== id));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                isLiked: true,
                isDisliked: false,
                likesCount: (q.likesCount || 0) + 1,
                dislikesCount: q.isDisliked ? Math.max(0, (q.dislikesCount || 1) - 1) : q.dislikesCount,
              }
            : q
        )
      );
      showToast('Liked post', undefined, 'success');
    }
  }, [likedQuestionIds, showToast]);

  const toggleDislikeQuestion = useCallback((id: string) => {
    const isCurrentlyDisliked = dislikedQuestionIds.includes(id);

    if (isCurrentlyDisliked) {
      // Remove dislike
      setDislikedQuestionIds((prev) => prev.filter((qid) => qid !== id));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, isDisliked: false, dislikesCount: Math.max(0, (q.dislikesCount || 1) - 1) } : q
        )
      );
      showToast('Dislike removed', undefined, 'info');
    } else {
      // Add dislike & remove like if active (mutually exclusive)
      setDislikedQuestionIds((prev) => [...prev, id]);
      setLikedQuestionIds((prev) => prev.filter((qid) => qid !== id));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                isDisliked: true,
                isLiked: false,
                dislikesCount: (q.dislikesCount || 0) + 1,
                likesCount: q.isLiked ? Math.max(0, (q.likesCount || 1) - 1) : q.likesCount,
              }
            : q
        )
      );
      showToast('Disliked post', undefined, 'info');
    }
  }, [dislikedQuestionIds, showToast]);

  const toggleLikeAnswer = useCallback((questionId: string, answerId: string) => {
    const isCurrentlyLiked = likedAnswerIds.includes(answerId);

    if (isCurrentlyLiked) {
      setLikedAnswerIds((prev) => prev.filter((id) => id !== answerId));
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.answers) {
            return {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, isLiked: false, upvotes: Math.max(0, (a.upvotes || 1) - 1) } : a
              ),
            };
          }
          return q;
        })
      );
      showToast('Helpful vote removed', undefined, 'info');
    } else {
      setLikedAnswerIds((prev) => [...prev, answerId]);
      setDislikedAnswerIds((prev) => prev.filter((id) => id !== answerId));
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.answers) {
            return {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId
                  ? { ...a, isLiked: true, isDisliked: false, upvotes: (a.upvotes || 0) + 1 }
                  : a
              ),
            };
          }
          return q;
        })
      );
      showToast('Helpful vote recorded', undefined, 'success');
    }
  }, [likedAnswerIds, showToast]);

  const toggleDislikeAnswer = useCallback((questionId: string, answerId: string) => {
    const isCurrentlyDisliked = dislikedAnswerIds.includes(answerId);

    if (isCurrentlyDisliked) {
      setDislikedAnswerIds((prev) => prev.filter((id) => id !== answerId));
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.answers) {
            return {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, isDisliked: false } : a
              ),
            };
          }
          return q;
        })
      );
      showToast('Dislike removed', undefined, 'info');
    } else {
      setDislikedAnswerIds((prev) => [...prev, answerId]);
      setLikedAnswerIds((prev) => prev.filter((id) => id !== answerId));
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.answers) {
            return {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId
                  ? { ...a, isDisliked: true, isLiked: false, upvotes: a.isLiked ? Math.max(0, (a.upvotes || 1) - 1) : a.upvotes }
                  : a
              ),
            };
          }
          return q;
        })
      );
      showToast('Disliked answer', undefined, 'info');
    }
  }, [dislikedAnswerIds, showToast]);

  const createQuestion = useCallback((q: {
    title: string;
    description?: string;
    category: string;
    imageUrl?: string;
    videoUrl?: string;
  }) => {
    const newQuestion: ExpertQuestion = {
      id: `user-q-${Date.now()}`,
      title: q.title,
      description: q.description,
      author: CURRENT_USER.name,
      authorRole: CURRENT_USER.role,
      location: CURRENT_USER.location.split(',')[0],
      timeAgo: 'Just now',
      answersCount: 0,
      likesCount: 0,
      dislikesCount: 0,
      isLiked: false,
      isDisliked: false,
      category: q.category || 'General Discussion',
      imageUrl: q.imageUrl,
      videoUrl: q.videoUrl,
      answers: [],
      comments: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setUserQuestionIds((prev) => [newQuestion.id, ...prev]);
    showToast('Question Posted', 'Your question is now published to the PTIC Community Hub.', 'success');
    return newQuestion;
  }, [showToast]);

  const addAnswer = useCallback((questionId: string, content: string) => {
    const newAnswer: ExpertAnswer = {
      id: `ans-${Date.now()}`,
      author: `${CURRENT_USER.name} (${CURRENT_USER.role})`,
      authorRole: CURRENT_USER.category,
      authorLocation: CURRENT_USER.location.split(',')[0],
      content: content.trim(),
      timeAgo: 'Just now',
      upvotes: 0,
      isLiked: false,
      isDisliked: false,
      comments: [],
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedAnswers = [...(q.answers || []), newAnswer];
          return {
            ...q,
            answersCount: updatedAnswers.length,
            answers: updatedAnswers,
          };
        }
        return q;
      })
    );

    setContributedQuestionIds((prev) =>
      prev.includes(questionId) ? prev : [questionId, ...prev]
    );

    showToast('Answer Submitted', 'Thank you for contributing your expert insight.', 'success');
  }, [showToast]);

  const addComment = useCallback((questionId: string, answerId: string, content: string) => {
    const newComment: QuestionComment = {
      id: `comm-${Date.now()}`,
      author: CURRENT_USER.name,
      authorRole: CURRENT_USER.role,
      content: content.trim(),
      timeAgo: 'Just now',
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.answers) {
          return {
            ...q,
            answers: q.answers.map((a) => {
              if (a.id === answerId) {
                return {
                  ...a,
                  comments: [...(a.comments || []), newComment],
                };
              }
              return a;
            }),
          };
        }
        return q;
      })
    );

    setContributedQuestionIds((prev) =>
      prev.includes(questionId) ? prev : [questionId, ...prev]
    );

    showToast('Comment Posted', undefined, 'success');
  }, [showToast]);

  // 4. Share State
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const openShare = useCallback(async (data: ShareData) => {
    // If native Web Share API is supported, use it!
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });
        showToast('Shared successfully.', undefined, 'success');
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to modal
        if ((err as Error).name !== 'AbortError') {
          setShareData(data);
          setIsShareOpen(true);
        }
        return;
      }
    }

    // Desktop modal fallback
    setShareData(data);
    setIsShareOpen(true);
  }, [showToast]);

  const closeShare = useCallback(() => {
    setIsShareOpen(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        syncBusinessProducts,
        enquiries,
        recordEnquiry,
        questions,
        likedQuestionIds,
        dislikedQuestionIds,
        likedAnswerIds,
        dislikedAnswerIds,
        userQuestionIds,
        contributedQuestionIds,
        toggleLikeQuestion,
        toggleDislikeQuestion,
        toggleLikeAnswer,
        toggleDislikeAnswer,
        createQuestion,
        addAnswer,
        addComment,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        openShare,
        closeShare,
      }}
    >
      {children}
      {/* Global Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={closeShare}
        data={shareData}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
