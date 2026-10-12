import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SkillItem,
  SwapRequest,
  ChatMessage,
  NotificationItem,
  ReviewItem,
  CoinTransaction,
  ReportItem,
  SmartMatchResult,
  SkillCategory,
  FormatType,
  SwapStatus,
  StudentFeedback,
  FeedbackCategory,
  FeedbackStatus,
  FeedbackPriority,
  LoginLogItem
} from '../types';

export interface ActiveVideoSession {
  swapId?: string;
  peerName: string;
  peerAvatar: string;
  topic: string;
  isOpen: boolean;
}

export const isValidShailabalaCollegeId = (id: string): boolean => {
  if (!id) return false;
  const clean = id.trim().toUpperCase().replace(/[\s\-_/]/g, '');
  if (clean.length < 3) return false;

  // Foreign college indicators to reject
  const foreignPrefixes = ['IIT', 'RAV', 'KIIT', 'ITER', 'DU', 'NIT', 'BITS', 'AMITY', 'SOA', 'OUTR', 'VSSUT'];
  for (const prefix of foreignPrefixes) {
    if (clean.startsWith(prefix) && !clean.includes('SBWC') && !clean.includes('SBWAC')) {
      return false;
    }
  }

  // Valid Shailabala prefixes & patterns: SB, SBWC, SBWAC, or valid alphanumeric student roll
  const isSbwcPattern = clean.startsWith('SB') || clean.includes('SBWC') || clean.includes('SBWAC');
  return isSbwcPattern || clean.length >= 4;
};

export const GUEST_USER: User = {
  id: 'guest_student',
  name: 'Guest Student',
  email: 'guest@student.shailabala.ac.in',
  college: "Shailabala Women's Autonomous College, Cuttack",
  city: 'Cuttack, Odisha',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  bio: "Visiting Shailabala Skill Barter Hub in Guest Mode. Log in with your College ID or create your profile to swap skills, earn coins, and join live study sessions!",
  skillsOffered: [],
  skillsWanted: [],
  coinBalance: 0,
  languages: ['Odia', 'English'],
  availability: 'Guest Mode',
  rating: 5.0,
  reviewCount: 0,
  isProfileComplete: false,
  isOnline: true,
  lastActive: 'Guest Session',
  dailyCheckInClaimed: false,
  isGuest: true
};

const DEFAULT_USER: User = {
  id: 'student_1',
  name: 'Priyanka Jena',
  email: 'priyanka.sbwc@shailabalawomenscollege.ac.in',
  collegeId: 'SBWAC-2023-CS042',
  password: 'password123',
  college: "Shailabala Women's Autonomous College, Cuttack",
  city: 'Cuttack, Odisha',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: "Computer Science student at Shailabala Women's Autonomous College, Cuttack. Excited to trade Python, Java, and Web Development skills with fellow SBWAC peers.",
  skillsOffered: ['Python', 'HTML', 'Java'],
  skillsWanted: ['Spoken English', 'Presentation', 'Project Management'],
  coinBalance: 100,
  languages: ['Odia', 'English', 'Hindi'],
  availability: 'Flexible',
  rating: 5.0,
  reviewCount: 12,
  isProfileComplete: true,
  isOnline: true,
  lastActive: 'Online Now',
  dailyCheckInClaimed: false,
  isGuest: false
};

const INITIAL_USERS: User[] = [
  DEFAULT_USER,
  {
    id: 'student_2',
    name: 'Subhashree Dash',
    email: 'subhashree.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-CS055',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    bio: "Computer Science 3rd Year student at Shailabala Women's College. Specialized in Core Java, OOPs, and CSS layouts. Looking to learn Python and Project Management.",
    skillsOffered: ['Java', 'CSS', 'HTML'],
    skillsWanted: ['Python', 'Project Management'],
    coinBalance: 140,
    languages: ['Odia', 'English', 'Hindi'],
    availability: 'Evenings & Weekends',
    rating: 4.9,
    reviewCount: 8,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false
  },
  {
    id: 'student_3',
    name: 'Ananya Pattnaik',
    email: 'ananya.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2024-ENG012',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: "English Department student at SBWAC. Passionate about helping fellow students master Spoken English fluency, interview communication, and stage presentation.",
    skillsOffered: ['Spoken English', 'Presentation'],
    skillsWanted: ['HTML', 'CSS'],
    coinBalance: 180,
    languages: ['English', 'Odia', 'Hindi'],
    availability: '4 PM - 7 PM Daily',
    rating: 5.0,
    reviewCount: 14,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false
  },
  {
    id: 'student_4',
    name: 'Sweta Mohanty',
    email: 'sweta.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-ECO034',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: "Economics Major & College Activity Coordinator. I teach Project Management, Agile group planning, and Excel Data Analysis.",
    skillsOffered: ['Project Management', 'Presentation'],
    skillsWanted: ['Python', 'Java'],
    coinBalance: 120,
    languages: ['Odia', 'English'],
    availability: 'Flexible / Weekends',
    rating: 4.8,
    reviewCount: 6,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: false,
    isGuest: false
  },
  {
    id: 'student_5',
    name: 'Tapaswini Behera',
    email: 'tapaswini.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2024-IT019',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: "IT student focusing on frontend web technologies: HTML5, modern CSS flex/grid, and JavaScript basics. Looking for Spoken English partners.",
    skillsOffered: ['HTML', 'CSS'],
    skillsWanted: ['Spoken English', 'Presentation'],
    coinBalance: 110,
    languages: ['Odia', 'English'],
    availability: '5 PM - 8 PM',
    rating: 4.9,
    reviewCount: 5,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false
  },
  {
    id: 'student_6',
    name: 'Lipsa Nayak',
    email: 'lipsa.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-MATH008',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    bio: "Mathematics Department student at Shailabala. Excited to teach Applied Mathematics, Probability, and Python math scripting.",
    skillsOffered: ['Python', 'Math & Statistics'],
    skillsWanted: ['Java', 'Spoken English'],
    coinBalance: 150,
    languages: ['Odia', 'English', 'Hindi'],
    availability: 'Morning & Evening slots',
    rating: 5.0,
    reviewCount: 9,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false
  }
];

const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill_sbwc_1',
    userId: 'student_1',
    userName: 'Priyanka Jena',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'Python Programming & Algorithm Fundamentals',
    description: 'Learn Python syntax, functions, OOP, and data structures step-by-step with practical assignments tailored for Shailabala CS students.',
    category: 'Programming & Tech',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 5.0,
    tags: ['Python', 'Algorithms', 'CS Practical'],
    createdAt: Date.now() - 3600000 * 20
  },
  {
    id: 'skill_sbwc_2',
    userId: 'student_2',
    userName: 'Subhashree Dash',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    title: 'Core Java OOP Concepts & Problem Solving',
    description: 'Master Java classes, inheritance, polymorphism, interfaces, and exception handling for semester lab exams and campus coding interviews.',
    category: 'Programming & Tech',
    format: 'ONLINE',
    coinsCost: 25,
    rating: 4.9,
    tags: ['Java', 'OOP', 'Code Lab'],
    createdAt: Date.now() - 3600000 * 18
  },
  {
    id: 'skill_sbwc_3',
    userId: 'student_3',
    userName: 'Ananya Pattnaik',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'Spoken English Fluency & Confident Communication',
    description: '1-on-1 speaking practice, pronunciation refinement, daily conversation drills, and vocabulary expansion for students aiming for fluent English.',
    category: 'Languages & Linguistics',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 5.0,
    tags: ['Spoken English', 'Fluency', 'Viva Prep'],
    createdAt: Date.now() - 3600000 * 15
  },
  {
    id: 'skill_sbwc_4',
    userId: 'student_4',
    userName: 'Sweta Mohanty',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    title: 'Project Management & Seminar Presentation Mastery',
    description: 'Design captivating PowerPoint/Canva slide decks and master body language, voice modulation, and structured delivery for academic seminars.',
    category: 'Personal Growth & Soft Skills',
    format: 'ALL',
    coinsCost: 15,
    rating: 4.8,
    tags: ['Presentation', 'Project Management', 'Public Speaking'],
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: 'skill_sbwc_5',
    userId: 'student_5',
    userName: 'Tapaswini Behera',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    title: 'HTML5 & Responsive CSS UI Web Design',
    description: 'Hands-on practice building clean, responsive web pages from scratch using HTML5 semantic tags, CSS Flexbox, Grid, and mobile-friendly styling.',
    category: 'UI/UX & Graphic Design',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 4.9,
    tags: ['HTML', 'CSS', 'Web Design'],
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'skill_sbwc_6',
    userId: 'student_6',
    userName: 'Lipsa Nayak',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    userCity: 'Cuttack, Odisha',
    userAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    title: 'Applied Math, Statistics & Python Numerical Scripts',
    description: 'Clear your doubts in Calculus, Probability, and Statistical computing with Python NumPy for semester exams and research projects.',
    category: 'Math & Statistics',
    format: 'ONLINE',
    coinsCost: 25,
    rating: 5.0,
    tags: ['Math & Statistics', 'Python', 'Calculus'],
    createdAt: Date.now() - 3600000 * 5
  }
];
const INITIAL_SWAPS: SwapRequest[] = [];
const INITIAL_CHATS: ChatMessage[] = [];
const INITIAL_NOTIFS: NotificationItem[] = [];
const INITIAL_TRANSACTIONS: CoinTransaction[] = [];

const INITIAL_FEEDBACKS: StudentFeedback[] = [
  {
    id: 'fb_1',
    userId: 'student_2',
    userName: 'Subhashree Dash',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    collegeId: 'SBWAC-2023-CS055',
    title: 'Need dedicated evening swap slots due to college practical lab timings',
    description: 'Many students have daily science and computer lab practicals till 4:30 PM. Having automatic filtering for 6:00 PM - 9:00 PM and weekend swap schedules would help us trade skills without missing classes.',
    category: 'Timetable & Scheduling',
    priority: 'HIGH',
    status: 'PLANNED',
    adminResponse: 'Planned for next release: Adding default evening (6-9 PM) and weekend study barter slots directly into the swap scheduler!',
    adminResolvedAt: Date.now() - 3600000 * 24,
    upvotes: 18,
    upvotedBy: ['student_1'],
    createdAt: Date.now() - 3600000 * 48
  },
  {
    id: 'fb_2',
    userId: 'student_3',
    userName: 'Ananya Pattnaik',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    collegeId: 'SBWAC-2024-ENG012',
    title: 'Add interactive code snippet / syntax viewer in chat for Java & Python swaps',
    description: 'When exchanging programming lessons, sending multi-line code in standard chat wraps awkwardly. A formatted code block box with a copy button would make technical learning 10x smoother.',
    category: 'Platform Feature Request',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW',
    adminResponse: 'Under review by student tech leads: Prototyping lightweight syntax block formatting for code swaps.',
    upvotes: 24,
    upvotedBy: ['student_1', 'student_2'],
    createdAt: Date.now() - 3600000 * 72
  },
  {
    id: 'fb_3',
    userId: 'student_4',
    userName: 'Sweta Mohanty',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    collegeId: 'SBWAC-2023-ECO034',
    title: 'Host group presentation & viva barter sessions before semester mid-terms',
    description: 'Could we introduce a multi-student group swap room so 3-4 students can practice viva voce and presentation slides together?',
    category: 'Learning Material & Content',
    priority: 'HIGH',
    status: 'PLANNED',
    adminResponse: 'Approved! Group Study & Mock Viva rooms are being scheduled ahead of the upcoming term exams.',
    upvotes: 15,
    upvotedBy: [],
    createdAt: Date.now() - 3600000 * 96
  },
  {
    id: 'fb_4',
    userId: 'student_1',
    userName: 'Priyanka Jena',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    userCollege: "Shailabala Women's Autonomous College, Cuttack",
    collegeId: 'SBWAC-2023-CS042',
    title: 'Low bandwidth mode for virtual classroom video calls on college mobile data',
    description: 'Inside certain classroom corners, mobile data speed drops. Having an audio-only mode switch or dynamic resolution helps prevent sudden call drops.',
    category: 'Technical & Video Issue',
    priority: 'HIGH',
    status: 'RESOLVED',
    adminResponse: 'Resolved: Integrated adaptive bandwidth optimizer and quick audio-only toggle into video classroom.',
    adminResolvedAt: Date.now() - 3600000 * 12,
    upvotes: 31,
    upvotedBy: ['student_2', 'student_3', 'student_4'],
    createdAt: Date.now() - 3600000 * 120
  }
];

interface SkillsSwapContextType {
  currentUser: User;
  users: User[];
  skills: SkillItem[];
  swaps: SwapRequest[];
  chats: ChatMessage[];
  notifications: NotificationItem[];
  transactions: CoinTransaction[];
  reports: ReportItem[];
  feedbacks: StudentFeedback[];
  activeTab: number;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  activeVideoSession: ActiveVideoSession | null;
  isFeedbackModalOpen: boolean;
  isAdminUnlocked: boolean;
  adminNotice: string | null;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  setActiveTab: (tab: number) => void;
  setIsFeedbackModalOpen: (open: boolean) => void;
  openVideoClassroom: (data?: { swapId?: string; peerName?: string; peerAvatar?: string; topic?: string }) => void;
  closeVideoClassroom: () => void;
  logoutUser: () => void;
  updateUserAvatar: (newAvatarUrl: string) => void;
  switchUser: (userId: string) => void;
  loginUserByEmail: (
    email: string,
    password?: string,
    collegeInput?: string,
    collegeIdInput?: string,
    skillsOfferedSelected?: string[],
    skillsWantedSelected?: string[]
  ) => { success: boolean; message?: string };
  registerUser: (data: {
    name: string;
    email: string;
    collegeId: string;
    password?: string;
    college: string;
    city: string;
    bio: string;
    skillOffered: string;
    skillWanted: string;
    category: SkillCategory;
    avatarUrl?: string;
  }) => User;
  claimDailyCheckIn: () => void;
  addSkill: (title: string, description: string, category: SkillCategory, format: FormatType, tags: string[]) => void;
  createSwapRequest: (recipientId: string, skillOffered: string, skillRequested: string, message: string) => void;
  acceptSwapRequest: (swapId: string) => void;
  rejectSwapRequest: (swapId: string) => void;
  completeSwap: (swapId: string, rating: number, comment: string) => void;
  sendMessage: (swapId: string, receiverId: string, text: string) => void;
  computeSmartMatches: () => SmartMatchResult[];
  reportUser: (reportedUserId: string, reason: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  markNotificationsRead: () => void;
  submitFeedback: (data: {
    title: string;
    description: string;
    category: FeedbackCategory;
    priority?: FeedbackPriority;
    isAnonymous?: boolean;
  }) => { success: boolean; message?: string };
  toggleUpvoteFeedback: (feedbackId: string) => void;
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus, adminResponse?: string) => void;
  deleteFeedback: (feedbackId: string) => void;
  unlockAdmin: (passcode?: string) => boolean;
  lockAdmin: () => void;
  setAdminNotice: (notice: string | null) => void;
  adminCreateStudent: (studentData: Partial<User>) => User;
  adminUpdateStudent: (userId: string, updates: Partial<User>) => void;
  adminDeleteStudent: (userId: string) => void;
  adminAdjustCoins: (userId: string, amount: number, reason: string) => void;
  adminDeleteSkill: (skillId: string) => void;
  adminUpdateSwapStatus: (swapId: string, status: SwapStatus) => void;
  adminBroadcastAlert: (title: string, message: string) => void;
  loginLogs: LoginLogItem[];
  refreshUsers: () => Promise<void>;
  isSyncingWithServer: boolean;
}

const SkillsSwapContext = createContext<SkillsSwapContextType | undefined>(undefined);

export const SkillsSwapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const safeSetItem = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn(`localStorage quota exceeded while saving ${key}:`, err);
    }
  };

  // Automatically purge legacy mock data from previous sessions if present
  useEffect(() => {
    const savedUsersStr = localStorage.getItem('skills_swap_users') || '';
    const savedSkillsStr = localStorage.getItem('skills_swap_skills') || '';
    if (savedUsersStr.includes('aarav.s@iitd.ac.in') || savedSkillsStr.includes('skill_1')) {
      localStorage.removeItem('skills_swap_users');
      localStorage.removeItem('skills_swap_current_user');
      localStorage.removeItem('skills_swap_skills');
      localStorage.removeItem('skills_swap_swaps');
      localStorage.removeItem('skills_swap_chats');
      localStorage.removeItem('skills_swap_notifications');
      localStorage.removeItem('skills_swap_transactions');
      setUsers([DEFAULT_USER]);
      setCurrentUser(DEFAULT_USER);
      setSkills([]);
      setSwaps([]);
      setChats([]);
      setNotifications([]);
      setTransactions([]);
    }
  }, []);

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadStored<User[]>('skills_swap_users', INITIAL_USERS);
    const existingIds = new Set(loaded.map((u) => u.id));
    const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
    return [...loaded, ...missing];
  });
  const [currentUser, setCurrentUser] = useState<User>(() => loadStored('skills_swap_current_user', GUEST_USER));
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const loaded = loadStored<SkillItem[]>('skills_swap_skills', INITIAL_SKILLS);
    if (!loaded || loaded.length === 0) return INITIAL_SKILLS;
    const existingIds = new Set(loaded.map((s) => s.id));
    const missing = INITIAL_SKILLS.filter((s) => !existingIds.has(s.id));
    return [...loaded, ...missing];
  });
  const [swaps, setSwaps] = useState<SwapRequest[]>(() => loadStored('skills_swap_swaps', INITIAL_SWAPS));
  const [chats, setChats] = useState<ChatMessage[]>(() => loadStored('skills_swap_chats', INITIAL_CHATS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('skills_swap_notifications', INITIAL_NOTIFS));
  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => loadStored('skills_swap_transactions', INITIAL_TRANSACTIONS));
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(() => loadStored('skills_swap_feedbacks', INITIAL_FEEDBACKS));
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [activeVideoSession, setActiveVideoSession] = useState<ActiveVideoSession | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [loginLogs, setLoginLogs] = useState<LoginLogItem[]>([]);
  const [isSyncingWithServer, setIsSyncingWithServer] = useState<boolean>(false);

  // Synchronize users and activity logs with central server
  const refreshUsers = async () => {
    try {
      setIsSyncingWithServer(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers((prev) => {
            const map = new Map<string, User>();
            // Add server users first (source of truth)
            data.users.forEach((u: User) => map.set(u.id, u));
            // Add local users if any are not yet synced
            prev.forEach((u) => {
              if (!map.has(u.id)) {
                map.set(u.id, u);
              }
            });
            return Array.from(map.values());
          });
        }
      }

      const logsRes = await fetch('/api/users/login-activity');
      if (logsRes.ok) {
        const data = await logsRes.json();
        if (data.success && Array.isArray(data.logs)) {
          setLoginLogs(data.logs);
        }
      }
    } catch (err) {
      console.warn('Network sync with server:', err);
    } finally {
      setIsSyncingWithServer(false);
    }
  };

  // Poll for new accounts created by any user across the college
  useEffect(() => {
    refreshUsers();
    const interval = setInterval(refreshUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Admin security and broadcast states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('skills_swap_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [adminNotice, setAdminNoticeState] = useState<string | null>(() => {
    return loadStored<string | null>(
      'skills_swap_admin_notice',
      "Welcome Shailabala Students! Swap Python, Java, Spoken English, and Project skills with peers. Earn +100 Skill Coins on student verification."
    );
  });

  const setAdminNotice = (notice: string | null) => {
    setAdminNoticeState(notice);
    safeSetItem('skills_swap_admin_notice', notice);
  };

  const unlockAdmin = (passcode?: string): boolean => {
    const validCodes = ['sbwac2024', 'admin123', 'ishani2024', '2024', 'admin', 'ishani'];
    const cleanCode = (passcode || '').trim().toLowerCase();
    
    // Allow unlock if passcode is valid OR currentUser is already an admin
    if (validCodes.includes(cleanCode) || currentUser.isAdmin || currentUser.email === 'ishanimitraishu@gmail.com') {
      setIsAdminUnlocked(true);
      try {
        sessionStorage.setItem('skills_swap_admin_unlocked', 'true');
      } catch (e) {
        console.warn(e);
      }
      setActiveTab(7);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('skills_swap_admin_unlocked');
    } catch (e) {
      console.warn(e);
    }
    setActiveTab(0);
  };

  // Check URL query parameters and hash on load & listen for secret admin triggers
  useEffect(() => {
    const checkUrlForAdminSecret = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const adminParam = urlParams.get('admin') || urlParams.get('secret') || urlParams.get('key');
        const hash = window.location.hash.toLowerCase();

        const validSecrets = ['sbwac2024', 'ishani', 'admin123', '2024', 'ishani2024', 'true', '1'];
        if (
          (adminParam && validSecrets.includes(adminParam.toLowerCase().trim())) ||
          hash.includes('admin') ||
          hash.includes('secret')
        ) {
          setIsAdminUnlocked(true);
          try {
            sessionStorage.setItem('skills_swap_admin_unlocked', 'true');
          } catch {}
          setActiveTab(7);
        }
      } catch (err) {
        console.warn('Secret URL check error', err);
      }
    };

    checkUrlForAdminSecret();
    window.addEventListener('hashchange', checkUrlForAdminSecret);
    window.addEventListener('popstate', checkUrlForAdminSecret);

    // Global keyboard secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const code = window.prompt('Confidential Administration Suite - Enter Passcode:');
        if (code) {
          const success = unlockAdmin(code);
          if (!success) {
            window.alert('Invalid admin passcode.');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkUrlForAdminSecret);
      window.removeEventListener('popstate', checkUrlForAdminSecret);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalTab(mode);
    setIsAuthModalOpen(true);
  };

  // Sync to localStorage safely
  useEffect(() => {
    safeSetItem('skills_swap_users', users);
  }, [users]);

  useEffect(() => {
    safeSetItem('skills_swap_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('skills_swap_skills', skills);
  }, [skills]);

  useEffect(() => {
    safeSetItem('skills_swap_swaps', swaps);
  }, [swaps]);

  useEffect(() => {
    safeSetItem('skills_swap_chats', chats);
  }, [chats]);

  useEffect(() => {
    safeSetItem('skills_swap_feedbacks', feedbacks);
  }, [feedbacks]);

  useEffect(() => {
    safeSetItem('skills_swap_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetItem('skills_swap_transactions', transactions);
  }, [transactions]);

  const openVideoClassroom = (data?: { swapId?: string; peerName?: string; peerAvatar?: string; topic?: string }) => {
    setActiveVideoSession({
      isOpen: true,
      swapId: data?.swapId,
      peerName: data?.peerName || 'Peer Student',
      peerAvatar: data?.peerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      topic: data?.topic || 'Interactive Skill Exchange Class'
    });
  };

  const closeVideoClassroom = () => {
    setActiveVideoSession(null);
  };

  const logoutUser = () => {
    setCurrentUser(GUEST_USER);
    setActiveTab(0); // Redirect to Home Page
    setAuthModalTab('login');
    setIsAuthModalOpen(false);
  };

  const updateUserAvatar = (newAvatarUrl: string) => {
    if (!newAvatarUrl) return;
    const updatedUser = { ...currentUser, avatarUrl: newAvatarUrl };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    // Also update avatar on skills posted by this user
    setSkills((prev) =>
      prev.map((s) => (s.userId === currentUser.id ? { ...s, userAvatarUrl: newAvatarUrl } : s))
    );
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const loginUserByEmail = (
    emailOrId: string,
    password?: string,
    collegeInput?: string,
    collegeIdInput?: string,
    skillsOfferedSelected?: string[],
    skillsWantedSelected?: string[]
  ): { success: boolean; message?: string } => {
    const cleanEmail = emailOrId.trim().toLowerCase();
    const cleanCollegeInput = (collegeInput || '').trim().toLowerCase();
    const cleanCollegeIdInput = (collegeIdInput || '').trim();

    // 1. Verify College Name written belongs to Shailabala Women's Autonomous College
    if (collegeInput && collegeInput.trim() !== '') {
      const isShailabalaInput =
        cleanCollegeInput.includes('shailabala') ||
        cleanCollegeInput.includes('sbwc') ||
        cleanCollegeInput.includes('sbwac');

      if (!isShailabalaInput) {
        return {
          success: false,
          message: `Access Denied: Only students who write Shailabala Women's Autonomous College are allowed to log in. "${collegeInput}" is not permitted.`
        };
      }
    }

    // 2. Verify College ID input
    if (!cleanCollegeIdInput) {
      return {
        success: false,
        message: "Please enter your Shailabala College ID / Roll Number (e.g. SBWAC-2023-CS042 or SBWC23-104) to confirm student identity."
      };
    }

    if (!isValidShailabalaCollegeId(cleanCollegeIdInput)) {
      return {
        success: false,
        message: `Access Denied: "${cleanCollegeIdInput}" is not a valid Shailabala Women's Autonomous College Student ID format. Example: SBWAC-2023-CS042, SBWC23-104.`
      };
    }

    // 3. Find account by Email, Name, or College ID
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.name.toLowerCase() === cleanEmail ||
        (u.collegeId && u.collegeId.toLowerCase() === cleanEmail) ||
        (u.collegeId && u.collegeId.toLowerCase() === cleanCollegeIdInput.toLowerCase())
    );

    if (!found) {
      return {
        success: false,
        message: "No account found. Access is restricted strictly to verified students of Shailabala Women's Autonomous College, Cuttack. Please register your student account."
      };
    }

    // 4. Verify student profile belongs to Shailabala Women's Autonomous College
    const userCollege = (found.college || '').toLowerCase();
    const userEmail = (found.email || '').toLowerCase();
    const isShailabalaStudent =
      userCollege.includes('shailabala') ||
      userCollege.includes('sbwc') ||
      userCollege.includes('sbwac') ||
      userEmail.includes('shailabala') ||
      userEmail.includes('sbwc') ||
      userEmail.includes('sbwac') ||
      found.id === 'student_1' ||
      found.isAdmin;

    if (!isShailabalaStudent) {
      return {
        success: false,
        message: "Access Denied: This portal is strictly restricted to students of Shailabala Women's Autonomous College, Cuttack. Other students are not permitted."
      };
    }

    // 5. Match College ID if account has a registered College ID
    if (found.collegeId) {
      const normalizedFoundId = found.collegeId.toUpperCase().replace(/[\s\-_/]/g, '');
      const normalizedInputId = cleanCollegeIdInput.toUpperCase().replace(/[\s\-_/]/g, '');
      if (normalizedFoundId !== normalizedInputId && !found.isAdmin && found.id !== 'student_1') {
        return {
          success: false,
          message: `Access Denied: The College ID "${cleanCollegeIdInput}" does not match the registered student ID for ${found.name}.`
        };
      }
    } else {
      found.collegeId = cleanCollegeIdInput.toUpperCase();
    }

    // 6. Verify Password
    if (!password) {
      return { success: false, message: 'Please enter your account password.' };
    }

    const expectedPassword = found.password || 'password123';
    if (password !== expectedPassword) {
      return { success: false, message: 'Incorrect password. Please verify your password and try again.' };
    }

    // 7. Update skills if provided at login time
    if (skillsOfferedSelected && skillsOfferedSelected.length > 0) {
      const mergedOffered = Array.from(new Set([...(found.skillsOffered || []), ...skillsOfferedSelected]));
      found.skillsOffered = mergedOffered;
    }
    if (skillsWantedSelected && skillsWantedSelected.length > 0) {
      const mergedWanted = Array.from(new Set([...(found.skillsWanted || []), ...skillsWantedSelected]));
      found.skillsWanted = mergedWanted;
    }

    const loggedInUser: User = {
      ...found,
      isGuest: false,
      isOnline: true,
      lastActive: 'Online Now',
      lastLoginAt: Date.now()
    };
    setUsers((prev) => prev.map((u) => (u.id === found.id ? loggedInUser : u)));
    setCurrentUser(loggedInUser);
    setActiveTab(0); // Open Home Page
    setIsAuthModalOpen(false);

    // Sync login event to central database immediately
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrId: cleanEmail,
        collegeId: cleanCollegeIdInput,
        userId: found.id,
        user: loggedInUser
      })
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.allUsers) {
          setUsers(resData.allUsers);
        }
        refreshUsers();
      })
      .catch((err) => console.warn('Server login sync error:', err));

    return { success: true };
  };

  const registerUser = (data: {
    name: string;
    email: string;
    collegeId: string;
    password?: string;
    college: string;
    city: string;
    bio: string;
    skillOffered: string;
    skillWanted: string;
    category: SkillCategory;
    avatarUrl?: string;
  }): User => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanCollege = (data.college || '').trim().toLowerCase();
    const cleanCollegeId = (data.collegeId || '').trim();

    // Verify registration is restricted to students who write Shailabala Women's Autonomous College
    const isShailabalaCollege =
      cleanCollege.includes('shailabala') ||
      cleanCollege.includes('sbwc') ||
      cleanCollege.includes('sbwac');

    const isShailabalaEmail =
      cleanEmail.includes('shailabala') ||
      cleanEmail.includes('sbwc') ||
      cleanEmail.includes('sbwac');

    // Reject non-Shailabala registrations
    if (!isShailabalaCollege && !isShailabalaEmail) {
      throw new Error(
        `Access Denied: Only students who write Shailabala Women's Autonomous College are allowed to register. "${data.college}" is not permitted.`
      );
    }

    // Verify valid Shailabala College ID
    if (!cleanCollegeId) {
      throw new Error("Please enter your Shailabala College ID / Roll Number.");
    }
    if (!isValidShailabalaCollegeId(cleanCollegeId)) {
      throw new Error(
        `Access Denied: College ID "${cleanCollegeId}" is not a valid Shailabala Women's Autonomous College format. Example: SBWAC-2024-045, SBWC23-108.`
      );
    }

    // Prevent duplicate email accounts
    const duplicateEmail = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (duplicateEmail) {
      throw new Error(`An account with email address "${data.email}" already exists! Please sign in with your email.`);
    }

    // Prevent duplicate college ID accounts
    const normalizedNewId = cleanCollegeId.toUpperCase().replace(/[\s\-_/]/g, '');
    const duplicateId = users.find(
      (u) => u.collegeId && u.collegeId.toUpperCase().replace(/[\s\-_/]/g, '') === normalizedNewId
    );
    if (duplicateId) {
      throw new Error(`A student with College ID "${cleanCollegeId}" is already registered. Please sign in instead.`);
    }

    const newId = `user_${Date.now()}`;
    const defaultAvatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`;
    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      collegeId: cleanCollegeId.toUpperCase(),
      password: data.password || 'password123',
      college: "Shailabala Women's Autonomous College, Cuttack",
      city: data.city || 'Cuttack, Odisha',
      avatarUrl: data.avatarUrl && data.avatarUrl.trim() !== '' ? data.avatarUrl.trim() : defaultAvatar,
      bio: data.bio || `Student at Shailabala Women's Autonomous College, Cuttack (ID: ${cleanCollegeId.toUpperCase()}) excited to exchange skills.`,
      skillsOffered: [data.skillOffered],
      skillsWanted: [data.skillWanted],
      coinBalance: 100, // 100 Skill Coins Welcome Bonus!
      languages: ['Odia', 'English'],
      availability: 'Weekdays & Weekends',
      rating: 5.0,
      reviewCount: 0,
      isProfileComplete: true,
      isOnline: true,
      lastActive: 'Online Now',
      dailyCheckInClaimed: false,
      isGuest: false,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };

    // Add user
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setActiveTab(0); // Open Home Page for newly registered student

    // Persist to central server immediately so personal admin page sees account
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.allUsers) {
          setUsers(resData.allUsers);
        }
        refreshUsers();
      })
      .catch((err) => console.warn('Server register sync error:', err));

    // Initial skill listing
    const newSkill: SkillItem = {
      id: `skill_${Date.now()}`,
      userId: newId,
      userName: newUser.name,
      userCollege: newUser.college,
      userAvatar: newUser.avatarUrl,
      userRating: 5.0,
      title: data.skillOffered,
      description: `Peer skill offer by ${newUser.name} at ${newUser.college}.`,
      category: data.category,
      format: 'BOTH',
      tags: [data.skillOffered, data.category, newUser.college],
      createdAt: Date.now()
    };
    setSkills((prev) => [newSkill, ...prev]);

    // Transaction for welcome bonus
    const newTx: CoinTransaction = {
      id: `tx_${Date.now()}`,
      userId: newId,
      amount: 100,
      reason: 'Welcome Bonus (+100 Skill Coins)',
      timestamp: Date.now()
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Welcome Notification
    const welcomeNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: newId,
      title: 'Welcome to Skills Swap! 🎉',
      message: 'You received 100 Skill Coins welcome bonus to start trading skills.',
      type: 'COIN_REWARD',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    setIsAuthModalOpen(false);
    return newUser;
  };

  const claimDailyCheckIn = () => {
    if (currentUser.dailyCheckInClaimed) return;
    const updatedUser = {
      ...currentUser,
      coinBalance: currentUser.coinBalance + 10,
      dailyCheckInClaimed: true
    };
    setCurrentUser(updatedUser);
    setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    const newTx: CoinTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.id,
      amount: 10,
      reason: 'Daily Login Bonus (+10 Coins)',
      timestamp: Date.now()
    };
    setTransactions([newTx, ...transactions]);

    const newNotif: NotificationItem = {
      id: `notif_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.id,
      title: 'Daily Check-in Claimed! 🪙',
      message: 'You earned +10 Skill Coins for checking in today.',
      type: 'COIN_REWARD',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const addSkill = (
    title: string,
    description: string,
    category: SkillCategory,
    format: FormatType,
    tags: string[]
  ) => {
    const newSkill: SkillItem = {
      id: `skill_${Math.random().toString(36).substr(2, 6)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userCollege: currentUser.college,
      userCity: currentUser.city,
      userAvatarUrl: currentUser.avatarUrl,
      title,
      description,
      category,
      format,
      coinsCost: 20,
      rating: 5.0,
      tags,
      createdAt: Date.now()
    };
    setSkills([newSkill, ...skills]);

    if (!currentUser.skillsOffered.includes(title)) {
      const updatedUser = {
        ...currentUser,
        skillsOffered: [...currentUser.skillsOffered, title]
      };
      setCurrentUser(updatedUser);
      setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  const createSwapRequest = (
    recipientId: string,
    skillOffered: string,
    skillRequested: string,
    message: string
  ) => {
    const recipient = users.find((u) => u.id === recipientId);
    if (!recipient) return;

    const newSwap: SwapRequest = {
      id: `swap_${Math.random().toString(36).substr(2, 6)}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatarUrl,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientAvatar: recipient.avatarUrl,
      skillOffered,
      skillRequested,
      message,
      status: 'PENDING',
      createdAt: Date.now()
    };

    setSwaps([newSwap, ...swaps]);

    const notif: NotificationItem = {
      id: `notif_${Math.random().toString(36).substr(2, 6)}`,
      userId: recipient.id,
      title: 'New Swap Request Received! 🤝',
      message: `${currentUser.name} wants to swap '${skillOffered}' for your '${skillRequested}'.`,
      type: 'SWAP_REQUEST',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications([notif, ...notifications]);
  };

  const acceptSwapRequest = (swapId: string) => {
    setSwaps(
      swaps.map((s) => {
        if (s.id === swapId) {
          const updated = { ...s, status: 'ACCEPTED' as SwapStatus };
          const notif: NotificationItem = {
            id: `notif_${Math.random().toString(36).substr(2, 6)}`,
            userId: s.requesterId,
            title: 'Swap Request Accepted! ✅',
            message: `${s.recipientName} accepted your swap request for '${s.skillRequested}'!`,
            type: 'SWAP_ACCEPTED',
            timestamp: Date.now(),
            isRead: false
          };
          setNotifications((prev) => [notif, ...prev]);
          return updated;
        }
        return s;
      })
    );
  };

  const rejectSwapRequest = (swapId: string) => {
    setSwaps(
      swaps.map((s) => {
        if (s.id === swapId) {
          const updated = { ...s, status: 'REJECTED' as SwapStatus };
          const notif: NotificationItem = {
            id: `notif_${Math.random().toString(36).substr(2, 6)}`,
            userId: s.requesterId,
            title: 'Swap Request Declined',
            message: `${s.recipientName} declined the swap request.`,
            type: 'SWAP_REJECTED',
            timestamp: Date.now(),
            isRead: false
          };
          setNotifications((prev) => [notif, ...prev]);
          return updated;
        }
        return s;
      })
    );
  };

  const completeSwap = (swapId: string, rating: number, comment: string) => {
    const swap = swaps.find((s) => s.id === swapId);
    if (!swap) return;

    setSwaps(
      swaps.map((s) =>
        s.id === swapId ? { ...s, status: 'COMPLETED' as SwapStatus, completedAt: Date.now() } : s
      )
    );

    // Update balances
    const teacherId = swap.recipientId;
    const learnerId = swap.requesterId;

    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === learnerId) {
          return { ...u, coinBalance: Math.max(0, u.coinBalance - 20) };
        }
        if (u.id === teacherId) {
          return { ...u, coinBalance: u.coinBalance + 20 + (rating === 5 ? 5 : 0) };
        }
        return u;
      })
    );

    if (currentUser.id === learnerId) {
      setCurrentUser((prev) => ({ ...prev, coinBalance: Math.max(0, prev.coinBalance - 20) }));
    } else if (currentUser.id === teacherId) {
      setCurrentUser((prev) => ({ ...prev, coinBalance: prev.coinBalance + 20 + (rating === 5 ? 5 : 0) }));
    }

    const txLearner: CoinTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 6)}`,
      userId: learnerId,
      amount: -20,
      reason: `Learned '${swap.skillRequested}'`,
      counterpartyName: swap.recipientName,
      timestamp: Date.now()
    };
    const txTeacher: CoinTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 6)}`,
      userId: teacherId,
      amount: 20 + (rating === 5 ? 5 : 0),
      reason: `Taught '${swap.skillRequested}'`,
      counterpartyName: swap.requesterName,
      timestamp: Date.now()
    };
    setTransactions((prev) => [txLearner, txTeacher, ...prev]);
  };

  const sendMessage = (swapId: string, receiverId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 6)}`,
      swapId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      timestamp: Date.now(),
      isRead: false
    };
    setChats((prev) => [...prev, newMsg]);

    const notif: NotificationItem = {
      id: `notif_${Math.random().toString(36).substr(2, 6)}`,
      userId: receiverId,
      title: `Message from ${currentUser.name}`,
      message: text.slice(0, 45),
      type: 'MESSAGE',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const computeSmartMatches = (): SmartMatchResult[] => {
    const otherUsers = users.filter((u) => u.id !== currentUser.id && !u.isAdmin && !u.isBlocked);
    return otherUsers
      .map((other) => {
        let score = 35;
        const reasons: string[] = [];

        const matchOffered =
          other.skillsOffered.find((offered) =>
            currentUser.skillsWanted.some(
              (w) => offered.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(offered.toLowerCase())
            )
          ) || other.skillsOffered[0] || 'General Tutoring';

        const matchWanted =
          other.skillsWanted.find((wanted) =>
            currentUser.skillsOffered.some(
              (o) => wanted.toLowerCase().includes(o.toLowerCase()) || o.toLowerCase().includes(wanted.toLowerCase())
            )
          ) || currentUser.skillsOffered[0] || 'Skill Exchange';

        if (
          currentUser.skillsWanted.some((w) =>
            other.skillsOffered.some((o) => o.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(o.toLowerCase()))
          )
        ) {
          score += 35;
          reasons.push(`Teaches '${matchOffered}' which you want to learn`);
        }

        if (
          currentUser.skillsOffered.some((o) =>
            other.skillsWanted.some((w) => w.toLowerCase().includes(o.toLowerCase()) || o.toLowerCase().includes(w.toLowerCase()))
          )
        ) {
          score += 20;
          reasons.push(`Wants to learn '${matchWanted}' which you offer`);
        }

        if (other.college.toLowerCase() === currentUser.college.toLowerCase()) {
          score += 10;
          reasons.push(`Same Campus (${currentUser.college})`);
        }

        if (other.rating >= 4.8) {
          score += 5;
          reasons.push(`Top Rated Student (${other.rating} ★)`);
        }

        return {
          student: other,
          matchScore: Math.min(99, Math.max(45, score)),
          matchedOfferedSkill: matchOffered,
          matchedWantedSkill: matchWanted,
          matchReasons: reasons.length ? reasons : ['Nearby student with complementary skill interests']
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const reportUser = (reportedUserId: string, reason: string) => {
    const reportedUser = users.find((u) => u.id === reportedUserId);
    if (!reportedUser) return;

    const rep: ReportItem = {
      id: `rep_${Math.random().toString(36).substr(2, 6)}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId: reportedUser.id,
      reportedUserName: reportedUser.name,
      reason,
      status: 'PENDING',
      timestamp: Date.now()
    };
    setReports([rep, ...reports]);
  };

  const banUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: true } : u)));
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: true })
    }).catch(console.warn);
  };

  const unbanUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u)));
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: false })
    }).catch(console.warn);
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n)));
  };

  const submitFeedback = (data: {
    title: string;
    description: string;
    category: FeedbackCategory;
    priority?: FeedbackPriority;
    isAnonymous?: boolean;
  }): { success: boolean; message?: string } => {
    if (!data.title.trim() || !data.description.trim()) {
      return { success: false, message: 'Please provide both a problem title and detailed description.' };
    }

    const newFeedback: StudentFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser.id,
      userName: data.isAnonymous ? 'Anonymous Student' : currentUser.name,
      userAvatar: data.isAnonymous
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        : currentUser.avatarUrl,
      userCollege: currentUser.college,
      collegeId: data.isAnonymous ? undefined : currentUser.collegeId,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      priority: data.priority || 'MEDIUM',
      status: 'SUBMITTED',
      upvotes: 1,
      upvotedBy: [currentUser.id],
      createdAt: Date.now(),
      isAnonymous: data.isAnonymous
    };

    // Reward student with 5 Skill Coins for constructive feedback/problem reporting
    const updatedUser = {
      ...currentUser,
      coinBalance: currentUser.coinBalance + 5
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    const tx: CoinTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      amount: 5,
      reason: 'Bonus: Reported student problem / platform feedback',
      timestamp: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Problem Report Received (+5 Coins)',
      message: `Thank you for sharing "${data.title.trim()}". Our college dev & admin team has recorded it to plan solutions!`,
      type: 'COIN_CREDIT',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications((prev) => [notif, ...prev]);

    setFeedbacks((prev) => [newFeedback, ...prev]);
    return { success: true, message: 'Problem submitted successfully! You earned +5 Skill Coins.' };
  };

  const toggleUpvoteFeedback = (feedbackId: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) => {
        if (fb.id !== feedbackId) return fb;
        const alreadyUpvoted = fb.upvotedBy.includes(currentUser.id);
        const newUpvotedBy = alreadyUpvoted
          ? fb.upvotedBy.filter((id) => id !== currentUser.id)
          : [...fb.upvotedBy, currentUser.id];
        return {
          ...fb,
          upvotes: newUpvotedBy.length,
          upvotedBy: newUpvotedBy
        };
      })
    );
  };

  const updateFeedbackStatus = (feedbackId: string, status: FeedbackStatus, adminResponse?: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) => {
        if (fb.id !== feedbackId) return fb;
        const updated = {
          ...fb,
          status,
          adminResponse: adminResponse !== undefined ? adminResponse : fb.adminResponse,
          adminResolvedAt: status === 'RESOLVED' || status === 'PLANNED' ? Date.now() : fb.adminResolvedAt
        };

        // Notify author if status changed to planned or resolved
        if (fb.userId && fb.userId !== 'guest') {
          const statusLabels: Record<FeedbackStatus, string> = {
            SUBMITTED: 'Submitted',
            UNDER_REVIEW: 'Under Active Review',
            PLANNED: 'Planned for Future Update',
            RESOLVED: 'Resolved & Solved'
          };
          const notif: NotificationItem = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            userId: fb.userId,
            title: `Feedback Update: ${statusLabels[status]}`,
            message: `Your submitted problem "${fb.title}" is now marked as "${statusLabels[status]}". ${adminResponse ? `Response: ${adminResponse}` : ''}`,
            type: 'SWAP_ACCEPTED',
            timestamp: Date.now(),
            isRead: false
          };
          setNotifications((nPrev) => [notif, ...nPrev]);
        }

        return updated;
      })
    );
  };

  const deleteFeedback = (feedbackId: string) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
  };

  const adminCreateStudent = (studentData: Partial<User>): User => {
    const id = studentData.id || `student_${Date.now()}`;
    const newStudent: User = {
      id,
      name: studentData.name || 'New Shailabala Student',
      email: studentData.email || `student.${Date.now()}@shailabalawomenscollege.ac.in`,
      collegeId: studentData.collegeId || `SBWAC-${new Date().getFullYear()}-GEN${Math.floor(100 + Math.random() * 900)}`,
      password: studentData.password || 'password123',
      college: studentData.college || "Shailabala Women's Autonomous College, Cuttack",
      city: studentData.city || 'Cuttack, Odisha',
      avatarUrl:
        studentData.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: studentData.bio || "Student at Shailabala Women's Autonomous College, Cuttack.",
      skillsOffered: studentData.skillsOffered && studentData.skillsOffered.length > 0 ? studentData.skillsOffered : ['General Tutoring'],
      skillsWanted: studentData.skillsWanted && studentData.skillsWanted.length > 0 ? studentData.skillsWanted : ['Spoken English'],
      coinBalance: studentData.coinBalance !== undefined ? studentData.coinBalance : 100,
      languages: studentData.languages || ['Odia', 'English'],
      availability: studentData.availability || 'Flexible',
      rating: studentData.rating || 5.0,
      reviewCount: studentData.reviewCount || 0,
      isProfileComplete: true,
      isOnline: true,
      lastActive: 'Online Now',
      isBlocked: false,
      isGuest: false,
      dailyCheckInClaimed: false
    };

    setUsers((prev) => [...prev, newStudent]);

    // Sync created student to central database
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.allUsers) setUsers(resData.allUsers);
        refreshUsers();
      })
      .catch(console.warn);

    return newStudent;
  };

  const adminUpdateStudent = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(console.warn);
  };

  const adminDeleteStudent = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSkills((prev) => prev.filter((s) => s.userId !== userId));
    setSwaps((prev) => prev.filter((s) => s.requesterId !== userId && s.recipientId !== userId));

    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    }).catch(console.warn);
  };

  const adminAdjustCoins = (userId: string, amount: number, reason: string) => {
    let finalBal = 0;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBal = Math.max(0, u.coinBalance + amount);
          finalBal = newBal;
          const updated = { ...u, coinBalance: newBal };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coinBalance: finalBal })
    }).catch(console.warn);

    const tx: CoinTransaction = {
      id: `tx_admin_${Date.now()}`,
      userId,
      amount,
      reason: `Admin Adjustment: ${reason}`,
      timestamp: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    const notif: NotificationItem = {
      id: `notif_admin_coin_${Date.now()}`,
      userId,
      title: amount >= 0 ? `+${amount} Skill Coins Awarded` : `${amount} Skill Coins Adjusted`,
      message: `Admin Update: ${reason}`,
      type: 'COIN_REWARD',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const adminDeleteSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const adminUpdateSwapStatus = (swapId: string, status: SwapStatus) => {
    setSwaps((prev) =>
      prev.map((s) => (s.id === swapId ? { ...s, status, completedAt: status === 'COMPLETED' ? Date.now() : s.completedAt } : s))
    );
  };

  const adminBroadcastAlert = (title: string, message: string) => {
    const alertNotifs: NotificationItem[] = users.map((u) => ({
      id: `broadcast_${u.id}_${Date.now()}`,
      userId: u.id,
      title: `Campus Announcement: ${title}`,
      message,
      type: 'SWAP_ACCEPTED',
      timestamp: Date.now(),
      isRead: false
    }));
    setNotifications((prev) => [...alertNotifs, ...prev]);
  };

  return (
    <SkillsSwapContext.Provider
      value={{
        currentUser,
        users,
        skills,
        swaps,
        chats,
        notifications,
        transactions,
        reports,
        feedbacks,
        activeTab,
        isAuthModalOpen,
        authModalTab,
        activeVideoSession,
        isFeedbackModalOpen,
        isAdminUnlocked,
        adminNotice,
        setIsAuthModalOpen,
        openAuthModal,
        setActiveTab,
        setIsFeedbackModalOpen,
        openVideoClassroom,
        closeVideoClassroom,
        logoutUser,
        updateUserAvatar,
        switchUser,
        loginUserByEmail,
        registerUser,
        claimDailyCheckIn,
        addSkill,
        createSwapRequest,
        acceptSwapRequest,
        rejectSwapRequest,
        completeSwap,
        sendMessage,
        computeSmartMatches,
        reportUser,
        banUser,
        unbanUser,
        markNotificationsRead,
        submitFeedback,
        toggleUpvoteFeedback,
        updateFeedbackStatus,
        deleteFeedback,
        unlockAdmin,
        lockAdmin,
        setAdminNotice,
        adminCreateStudent,
        adminUpdateStudent,
        adminDeleteStudent,
        adminAdjustCoins,
        adminDeleteSkill,
        adminUpdateSwapStatus,
        adminBroadcastAlert,
        loginLogs,
        refreshUsers,
        isSyncingWithServer
      }}
    >
      {children}
    </SkillsSwapContext.Provider>
  );
};

export const useSkillsSwap = () => {
  const context = useContext(SkillsSwapContext);
  if (!context) throw new Error('useSkillsSwap must be used within a SkillsSwapProvider');
  return context;
};
