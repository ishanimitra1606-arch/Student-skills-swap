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

const DEFAULT_USER: User = {
  id: 'student_1',
  name: 'Student Member',
  email: 'student@college.edu',
  password: 'password123',
  college: 'Your University',
  city: 'Campus',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  bio: 'Welcome to SkillsSwap! Register your account or post your first skill to start learning with fellow students.',
  skillsOffered: [],
  skillsWanted: [],
  coinBalance: 100,
  languages: ['English'],
  availability: 'Flexible',
  rating: 5.0,
  reviewCount: 0,
  isProfileComplete: false,
  isOnline: true,
  lastActive: 'Online',
  dailyCheckInClaimed: false
};

const INITIAL_USERS: User[] = [DEFAULT_USER];
const INITIAL_SKILLS: SkillItem[] = [];
const INITIAL_SWAPS: SwapRequest[] = [];
const INITIAL_CHATS: ChatMessage[] = [];
const INITIAL_NOTIFS: NotificationItem[] = [];
const INITIAL_TRANSACTIONS: CoinTransaction[] = [];

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
