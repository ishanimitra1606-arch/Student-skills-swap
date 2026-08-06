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
  SwapStatus
} from '../types';

export interface ActiveVideoSession {
  swapId?: string;
  peerName: string;
  peerAvatar: string;
  topic: string;
  isOpen: boolean;
}

const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Aarav Sharma',
    email: 'aarav.s@iitd.ac.in',
    password: 'password123',
    college: 'IIT Delhi',
    city: 'Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'CS Senior passionate about Full Stack Web Dev, Machine Learning, and Competitive Programming. Always eager to exchange tech skills!',
    skillsOffered: ['Python & Data Science', 'React & Next.js', 'Data Structures & Algorithms'],
    skillsWanted: ['Spanish Speaking', 'Guitar Fundamentals', 'UI/UX Design in Figma'],
    coinBalance: 140,
    languages: ['English', 'Hindi'],
    availability: 'Mon, Wed, Sat (6 PM - 9 PM)',
    rating: 4.9,
    reviewCount: 12,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online',
    dailyCheckInClaimed: false
  },
  {
    id: 'user_2',
    name: 'Priya Patel',
    email: 'priya.p@mu.ac.in',
    college: 'Mumbai University',
    city: 'Mumbai',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: 'Design enthusiast & acoustic guitarist. I craft clean user interfaces and teach acoustic guitar basics to beginners.',
    skillsOffered: ['UI/UX Design in Figma', 'Acoustic Guitar Basics', 'Digital Illustration'],
    skillsWanted: ['Python & Data Science', 'Public Speaking', 'Financial Literacy'],
    coinBalance: 120,
    languages: ['English', 'Hindi', 'Gujarati'],
    availability: 'Tue, Thu, Sun (4 PM - 8 PM)',
    rating: 4.8,
    reviewCount: 8,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_3',
    name: 'Rahul Verma',
    email: 'rahul.v@du.ac.in',
    college: 'Delhi University (SRCC)',
    city: 'Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Finance major with 3+ years experience in stock market basics, Excel financial modeling, and spoken Spanish.',
    skillsOffered: ['Financial Literacy & Stocks', 'Advanced Excel & PowerBI', 'Spanish Speaking'],
    skillsWanted: ['React & Next.js', 'Video Editing in Premiere', 'Data Structures & Algorithms'],
    coinBalance: 90,
    languages: ['English', 'Hindi', 'Spanish'],
    availability: 'Weekends All Day',
    rating: 4.7,
    reviewCount: 6,
    isProfileComplete: true,
    isOnline: false,
    lastActive: '15 mins ago'
  },
  {
    id: 'user_4',
    name: 'Ananya Sen',
    email: 'ananya.sen@ju.ac.in',
    college: 'Jadavpur University',
    city: 'Kolkata',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Media & Communications student creating YouTube video tutorials. Fluent in German and video editing.',
    skillsOffered: ['Video Editing in Premiere', 'German Language Level A2', 'Creative Content Writing'],
    skillsWanted: ['UI/UX Design in Figma', 'Acoustic Guitar Basics', 'Public Speaking'],
    coinBalance: 160,
    languages: ['English', 'Bengali', 'German'],
    availability: 'Mon - Fri (7 PM - 10 PM)',
    rating: 5.0,
    reviewCount: 15,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_5',
    name: 'Vikram Reddy',
    email: 'vikram.r@bits-pilani.ac.in',
    college: 'BITS Pilani',
    city: 'Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Mechanical Engineering student loving calculus, physics problem solving, and public speaking coaching.',
    skillsOffered: ['Calculus & Differential Equations', 'Public Speaking', 'Physics Problem Solving'],
    skillsWanted: ['Python & Data Science', 'German Language Level A2', 'Financial Literacy & Stocks'],
    coinBalance: 110,
    languages: ['English', 'Telugu', 'Hindi'],
    availability: 'Everyday after 8 PM',
    rating: 4.6,
    reviewCount: 5,
    isProfileComplete: true,
    isOnline: false,
    lastActive: '1 hour ago'
  },
  {
    id: 'admin_user',
    name: 'Platform Administrator',
    email: 'admin@studentskillsswap.edu',
    college: 'Student Skills Swap HQ',
    city: 'Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Official System Administrator monitoring platform safety, Skill Coin integrity, and swap analytics.',
    skillsOffered: ['Community Management', 'Platform Safety'],
    skillsWanted: ['User Feedback'],
    coinBalance: 999,
    languages: ['English', 'Hindi'],
    availability: '24/7',
    rating: 5.0,
    reviewCount: 50,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online',
    isAdmin: true
  }
];

const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill_1',
    userId: 'user_1',
    userName: 'Aarav Sharma',
    userCollege: 'IIT Delhi',
    userCity: 'Delhi',
    userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'Python for Machine Learning & Data Science',
    description: 'Learn pandas, numpy, matplotlib, and scikit-learn hands-on with real dataset projects.',
    category: 'Programming & Tech',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 4.9,
    tags: ['Python', 'AI', 'Data Science', 'Machine Learning'],
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'skill_2',
    userId: 'user_2',
    userName: 'Priya Patel',
    userCollege: 'Mumbai University',
    userCity: 'Mumbai',
    userAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    title: 'UI/UX Design Basics with Figma',
    description: 'Master wireframing, auto-layout, interactive prototyping, and mobile design systems.',
    category: 'UI/UX & Graphic Design',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 4.8,
    tags: ['Figma', 'UI Design', 'UX', 'Web Design'],
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'skill_3',
    userId: 'user_2',
    userName: 'Priya Patel',
    userCollege: 'Mumbai University',
    userCity: 'Mumbai',
    userAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    title: 'Acoustic Guitar for Beginners',
    description: 'Chords, strumming patterns, and playing popular acoustic songs in just 4 sessions.',
    category: 'Music & Instruments',
    format: 'OFFLINE',
    coinsCost: 20,
    rating: 4.9,
    tags: ['Guitar', 'Music', 'Acoustic', 'Chords'],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'skill_4',
    userId: 'user_3',
    userName: 'Rahul Verma',
    userCollege: 'Delhi University (SRCC)',
    userCity: 'Delhi',
    userAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    title: 'Conversational Spanish Speaking',
    description: 'Practice everyday dialogues, pronunciation, and essential vocabulary with native-paced guidance.',
    category: 'Languages & Linguistics',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 4.7,
    tags: ['Spanish', 'Languages', 'Conversation'],
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'skill_5',
    userId: 'user_4',
    userName: 'Ananya Sen',
    userCollege: 'Jadavpur University',
    userCity: 'Kolkata',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'Video Editing in Adobe Premiere Pro',
    description: 'Color grading, audio tuning, jump cuts, and motion graphics for YouTube & social reels.',
    category: 'Photo & Video Editing',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 5.0,
    tags: ['Premiere Pro', 'Video Editing', 'Reels', 'YouTube'],
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'skill_6',
    userId: 'user_5',
    userName: 'Vikram Reddy',
    userCollege: 'BITS Pilani',
    userCity: 'Bengaluru',
    userAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    title: 'Engineering Calculus & Differential Equations',
    description: 'Clear step-by-step concepts, exam prep techniques, and intuition for complex engineering math.',
    category: 'Math & Statistics',
    format: 'ONLINE',
    coinsCost: 20,
    rating: 4.6,
    tags: ['Math', 'Calculus', 'Engineering', 'Exams'],
    createdAt: Date.now()
  }
];

const INITIAL_SWAPS: SwapRequest[] = [
  {
    id: 'swap_1',
    requesterId: 'user_1',
    requesterName: 'Aarav Sharma',
    requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    recipientId: 'user_2',
    recipientName: 'Priya Patel',
    recipientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    skillOffered: 'Python for Machine Learning & Data Science',
    skillRequested: 'UI/UX Design Basics with Figma',
    message: 'Hey Priya! I can teach you Python ML modeling in exchange for learning Figma design. Let me know!',
    status: 'ACCEPTED',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'swap_2',
    requesterId: 'user_4',
    requesterName: 'Ananya Sen',
    requesterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    recipientId: 'user_1',
    recipientName: 'Aarav Sharma',
    recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skillOffered: 'Video Editing in Adobe Premiere Pro',
    skillRequested: 'Python for Machine Learning & Data Science',
    message: 'Hi Aarav! Loved your Python syllabus. Want to exchange with Premiere Pro editing?',
    status: 'PENDING',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'swap_3',
    requesterId: 'user_3',
    requesterName: 'Rahul Verma',
    requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    recipientId: 'user_1',
    recipientName: 'Aarav Sharma',
    recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skillOffered: 'Conversational Spanish Speaking',
    skillRequested: 'Python for Machine Learning & Data Science',
    message: 'Hola Aarav! I completed a 2-hour session teaching Spanish basics to you.',
    status: 'COMPLETED',
    createdAt: Date.now() - 86400000 * 5,
    completedAt: Date.now() - 86400000 * 1
  }
];

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg_1',
    swapId: 'swap_1',
    senderId: 'user_1',
    senderName: 'Aarav Sharma',
    receiverId: 'user_2',
    text: 'Hi Priya! Thanks for accepting the swap. When are you free for our first Figma session?',
    timestamp: Date.now() - 7200000,
    isRead: true
  },
  {
    id: 'msg_2',
    swapId: 'swap_1',
    senderId: 'user_2',
    senderName: 'Priya Patel',
    receiverId: 'user_1',
    text: 'Hey Aarav! I am available this Thursday at 5 PM. I can share my Figma starter template link beforehand!',
    timestamp: Date.now() - 3600000,
    isRead: true
  },
  {
    id: 'msg_3',
    swapId: 'swap_1',
    senderId: 'user_1',
    senderName: 'Aarav Sharma',
    receiverId: 'user_2',
    text: 'Sounds awesome! I prepared a Python Jupyter notebook for you too 🚀',
    timestamp: Date.now() - 1800000,
    isRead: false
  }
];

const INITIAL_NOTIFS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_1',
    title: 'New Swap Request Received!',
    message: 'Ananya Sen wants to swap Video Editing for your Python skill.',
    type: 'SWAP_REQUEST',
    timestamp: Date.now() - 3600000 * 4,
    isRead: false
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    title: 'Swap Request Accepted',
    message: 'Priya Patel accepted your UI/UX Design swap request!',
    type: 'SWAP_ACCEPTED',
    timestamp: Date.now() - 86400000,
    isRead: true
  },
  {
    id: 'notif_3',
    userId: 'user_1',
    title: 'Skill Coins Received (+20)',
    message: 'You earned 20 Skill Coins for completing Spanish-Python swap with Rahul Verma.',
    type: 'COIN_REWARD',
    timestamp: Date.now() - 86400000 * 1,
    isRead: true
  }
];

const INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'tx_1',
    userId: 'user_1',
    amount: 100,
    reason: 'Registration Bonus (+100 Coins)',
    timestamp: Date.now() - 86400000 * 10
  },
  {
    id: 'tx_2',
    userId: 'user_1',
    amount: 10,
    reason: 'Completed Profile Bonus (+10 Coins)',
    timestamp: Date.now() - 86400000 * 9
  },
  {
    id: 'tx_3',
    userId: 'user_1',
    amount: 20,
    reason: 'Completed Teaching Session (Python ML)',
    counterpartyName: 'Rahul Verma',
    timestamp: Date.now() - 86400000 * 1
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
  activeTab: number;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  activeVideoSession: ActiveVideoSession | null;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  setActiveTab: (tab: number) => void;
  openVideoClassroom: (data?: { swapId?: string; peerName?: string; peerAvatar?: string; topic?: string }) => void;
  closeVideoClassroom: () => void;
  logoutUser: () => void;
  updateUserAvatar: (newAvatarUrl: string) => void;
  switchUser: (userId: string) => void;
  loginUserByEmail: (email: string, password?: string) => { success: boolean; message?: string };
  registerUser: (data: {
    name: string;
    email: string;
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

  const [users, setUsers] = useState<User[]>(() => loadStored('skills_swap_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => loadStored('skills_swap_current_user', INITIAL_USERS[0]));
  const [skills, setSkills] = useState<SkillItem[]>(() => loadStored('skills_swap_skills', INITIAL_SKILLS));
  const [swaps, setSwaps] = useState<SwapRequest[]>(() => loadStored('skills_swap_swaps', INITIAL_SWAPS));
  const [chats, setChats] = useState<ChatMessage[]>(() => loadStored('skills_swap_chats', INITIAL_CHATS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('skills_swap_notifications', INITIAL_NOTIFS));
  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => loadStored('skills_swap_transactions', INITIAL_TRANSACTIONS));
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [activeVideoSession, setActiveVideoSession] = useState<ActiveVideoSession | null>(null);

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
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Guest Student',
      email: 'guest@student.ac.in',
      college: 'Student Campus',
      city: 'Campus',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Logged out mode. Create a new account or log in to trade skills!',
      skillsOffered: [],
      skillsWanted: [],
      coinBalance: 0,
      languages: ['English'],
      availability: 'Not set',
      rating: 5.0,
      reviewCount: 0,
      isProfileComplete: false,
      isOnline: false,
      lastActive: 'Just now'
    };
    setCurrentUser(guestUser);
    setActiveTab(0); // Redirect to Home Page
    setAuthModalTab('register'); // Show blank Create Account sign up page
    setIsAuthModalOpen(true); // Open auth modal
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

  const loginUserByEmail = (email: string, password?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail
    );
    if (!found) {
      return { success: false, message: 'No student account found with this email or name. Please try registering!' };
    }

    if (!password) {
      return { success: false, message: 'Please enter your account password.' };
    }

    const expectedPassword = found.password || 'password123';
    if (password !== expectedPassword) {
      return { success: false, message: 'Incorrect password. Please verify your password and try again.' };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerUser = (data: {
    name: string;
    email: string;
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
    // Prevent duplicate email accounts
    const duplicate = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      throw new Error(`An account with email address "${data.email}" already exists! Please sign in with your email.`);
    }

    const newId = `user_${Date.now()}`;
    const defaultAvatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`;
    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      password: data.password || 'password123',
      college: data.college,
      city: data.city || 'Campus',
      avatarUrl: data.avatarUrl && data.avatarUrl.trim() !== '' ? data.avatarUrl.trim() : defaultAvatar,
      bio: data.bio || `Student at ${data.college} excited to exchange skills.`,
      skillsOffered: [data.skillOffered],
      skillsWanted: [data.skillWanted],
      coinBalance: 100, // 100 Skill Coins Welcome Bonus!
      languages: ['English'],
      availability: 'Weekdays & Weekends',
      rating: 5.0,
      reviewCount: 0,
      isProfileComplete: true,
      isOnline: true,
      lastActive: 'Online',
      dailyCheckInClaimed: false
    };

    // Add user
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

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
  };

  const unbanUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u)));
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n)));
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
        activeTab,
        isAuthModalOpen,
        authModalTab,
        activeVideoSession,
        setIsAuthModalOpen,
        openAuthModal,
        setActiveTab,
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
        markNotificationsRead
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
