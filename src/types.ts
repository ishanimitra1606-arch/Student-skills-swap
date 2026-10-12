export type SkillCategory =
  | 'All Categories'
  | 'Programming & Tech'
  | 'UI/UX & Graphic Design'
  | 'Music & Instruments'
  | 'Languages & Linguistics'
  | 'Math & Statistics'
  | 'Science & Engineering'
  | 'Marketing & Business'
  | 'Photo & Video Editing'
  | 'Personal Growth & Soft Skills';

export type FormatType = 'ALL' | 'ONLINE' | 'OFFLINE';

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export type NotificationType = 'SWAP_REQUEST' | 'SWAP_ACCEPTED' | 'SWAP_REJECTED' | 'MESSAGE' | 'COIN_REWARD';

export interface User {
  id: string;
  name: string;
  email: string;
  collegeId?: string;
  password?: string;
  college: string;
  city: string;
  avatarUrl: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
  coinBalance: number;
  languages: string[];
  availability: string;
  rating: number;
  reviewCount: number;
  isProfileComplete: boolean;
  isOnline: boolean;
  lastActive: string;
  isReported?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  isGuest?: boolean;
  dailyCheckInClaimed?: boolean;
  createdAt?: number;
  lastLoginAt?: number;
  registrationDevice?: string;
}

export interface LoginLogItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  collegeId?: string;
  type: 'REGISTRATION' | 'LOGIN' | 'SIGN_IN';
  timestamp: number;
  details?: string;
}

export interface SkillItem {
  id: string;
  userId: string;
  userName: string;
  userCollege: string;
  userCity: string;
  userAvatarUrl: string;
  title: string;
  description: string;
  category: SkillCategory;
  format: FormatType;
  coinsCost: number;
  rating: number;
  tags: string[];
  createdAt: number;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  skillOffered: string;
  skillRequested: string;
  message: string;
  status: SwapStatus;
  createdAt: number;
  completedAt?: number;
}

export interface ChatMessage {
  id: string;
  swapId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  isRead: boolean;
}

export interface ReviewItem {
  id: string;
  swapId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  skillName: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  counterpartyName?: string;
  timestamp: number;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  timestamp: number;
}

export interface SmartMatchResult {
  student: User;
  matchScore: number;
  matchedOfferedSkill: string;
  matchedWantedSkill: string;
  matchReasons: string[];
}

export type FeedbackCategory =
  | 'Skill Swap Experience'
  | 'Timetable & Scheduling'
  | 'Platform Feature Request'
  | 'Technical & Video Issue'
  | 'Campus & Safety Concern'
  | 'Learning Material & Content'
  | 'Other Problem';

export type FeedbackStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'PLANNED' | 'RESOLVED';
export type FeedbackPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface StudentFeedback {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  collegeId?: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  adminResponse?: string;
  adminResolvedAt?: number;
  upvotes: number;
  upvotedBy: string[];
  createdAt: number;
  isAnonymous?: boolean;
}

