import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { User, SkillItem, SwapRequest, FeedbackStatus, SkillCategory, FormatType } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Store,
  ArrowLeftRight,
  Coins,
  CheckCircle,
  Ban,
  MessageSquarePlus,
  Sparkles,
  Clock,
  CheckCircle2,
  ThumbsUp,
  Trash2,
  Wrench,
  Send,
  Lock,
  Unlock,
  Plus,
  Edit3,
  Search,
  Filter,
  KeyRound,
  BookOpen,
  HelpCircle,
  Megaphone,
  CreditCard,
  Mail,
  UserCheck,
  Award,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const AdminScreen: React.FC = () => {
  const {
    users,
    skills,
    swaps,
    reports,
    feedbacks,
    currentUser,
    isAdminUnlocked,
    adminNotice,
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
    banUser,
    unbanUser,
    updateFeedbackStatus,
    deleteFeedback,
    setIsFeedbackModalOpen,
    openVideoClassroom,
    loginLogs,
    refreshUsers,
    isSyncingWithServer
  } = useSkillsSwap();

  // Admin access state
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Active Admin Tabs
  const [adminTab, setAdminTab] = useState<'students' | 'needs' | 'activities' | 'marketplace' | 'feedback' | 'broadcast'>('students');

  // Search & Filters for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'ALL' | 'CREATED' | 'RECENT_LOGINS' | 'VERIFIED' | 'ACTIVE' | 'BANNED' | 'GUESTS'>('ALL');
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Modals inside Admin
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [coinAdjustStudent, setCoinAdjustStudent] = useState<User | null>(null);
  const [coinAdjustAmount, setCoinAdjustAmount] = useState<number>(50);
  const [coinAdjustReason, setCoinAdjustReason] = useState('College activity participation bonus');
  const [passwordViewId, setPasswordViewId] = useState<string | null>(null);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentCollegeId, setNewStudentCollegeId] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('password123');
  const [newStudentOffered, setNewStudentOffered] = useState('');
  const [newStudentWanted, setNewStudentWanted] = useState('');
  const [newStudentBio, setNewStudentBio] = useState('');
  const [newStudentCoins, setNewStudentCoins] = useState(100);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [noticeInput, setNoticeInput] = useState(adminNotice || '');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  // Swaps search & filter
  const [swapSearch, setSwapSearch] = useState('');
  const [swapStatusFilter, setSwapStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED'>('ALL');

  // Feedback reply state
  const [feedbackReply, setFeedbackReply] = useState<{ [id: string]: string }>({});
  const [linkCopied, setLinkCopied] = useState(false);

  const getPersonalAdminLink = () => {
    try {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}?admin=sbwac2024`;
    } catch {
      return '?admin=sbwac2024';
    }
  };

  const handleCopyAdminLink = () => {
    try {
      const link = getPersonalAdminLink();
      navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(passcodeInput);
    if (!success) {
      setPasscodeError('Invalid Admin Passcode. Try "sbwac2024" or "admin123"');
    } else {
      setPasscodeError('');
      setPasscodeInput('');
    }
  };

  const handleQuickUnlockIshani = () => {
    unlockAdmin('sbwac2024');
  };

  // If not unlocked and not admin, show password security gate
  if (!isAdminUnlocked && !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 pb-28">
        <div className="p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-heading font-extrabold text-white">
              Confidential Admin Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              This management suite is strictly restricted to maintain all students, inspect learning needs, manage barter activities, and resolve issues.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Enter Administrator Passcode / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode (e.g. sbwac2024)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
              {passcodeError && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Quick One-Click Owner Access for Ishani Mitra */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              Are you Ishani Mitra (College App Administrator)?
            </p>
            <button
              onClick={handleQuickUnlockIshani}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>One-Click Unlock as Ishani Mitra</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const registeredStudents = users.filter((u) => !u.isGuest && u.id !== 'guest_student');
  const targetAccountsList = studentFilter === 'GUESTS' ? users : registeredStudents;
  const totalStudentsCount = registeredStudents.length;
  const verifiedCount = registeredStudents.filter((u) => u.collegeId).length;
  const createdCount = registeredStudents.filter((u) => u.createdAt || u.id.startsWith('user_')).length;
  const totalSwapsCount = swaps.length;
  const completedSwapsCount = swaps.filter((s) => s.status === 'COMPLETED').length;
  const totalCoinsInCirculation = users.reduce((acc, u) => acc + (u.coinBalance || 0), 0);

  // Aggregate All Student Needs (Skills Wanted)
  const skillsWantedMap: { [skill: string]: { count: number; studentNames: string[] } } = {};
  registeredStudents.forEach((student) => {
    student.skillsWanted.forEach((skill) => {
      const clean = skill.trim();
      if (!clean) return;
      if (!skillsWantedMap[clean]) {
        skillsWantedMap[clean] = { count: 0, studentNames: [] };
      }
      skillsWantedMap[clean].count += 1;
      skillsWantedMap[clean].studentNames.push(student.name);
    });
  });

  const studentNeedsRanked = Object.entries(skillsWantedMap).sort(
    (a, b) => b[1].count - a[1].count
  );

  // Filtered & Sorted Students Table
  const filteredStudents = targetAccountsList
    .filter((student) => {
      const q = studentSearch.toLowerCase();
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        (student.collegeId && student.collegeId.toLowerCase().includes(q)) ||
        student.email.toLowerCase().includes(q) ||
        student.skillsOffered.some((s) => s.toLowerCase().includes(q)) ||
        student.skillsWanted.some((s) => s.toLowerCase().includes(q));

      let matchesFilter = true;
      if (studentFilter === 'ACTIVE') matchesFilter = !student.isBlocked && !student.isGuest;
      if (studentFilter === 'VERIFIED') matchesFilter = !!student.collegeId;
      if (studentFilter === 'BANNED') matchesFilter = !!student.isBlocked;
      if (studentFilter === 'CREATED') matchesFilter = !!student.createdAt || student.id.startsWith('user_');
      if (studentFilter === 'RECENT_LOGINS') matchesFilter = !!student.lastLoginAt;
      if (studentFilter === 'GUESTS') matchesFilter = !!student.isGuest || student.id === 'guest_student';

      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => {
      // If sorting by recent logins
      if (studentFilter === 'RECENT_LOGINS') {
        return (b.lastLoginAt || 0) - (a.lastLoginAt || 0);
      }
      // If sorting by created accounts
      if (studentFilter === 'CREATED') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      // Default: sort newly created or updated accounts to the top
      const aScore = Math.max(a.createdAt || 0, a.lastLoginAt || 0);
      const bScore = Math.max(b.createdAt || 0, b.lastLoginAt || 0);
      return bScore - aScore;
    });

  // Filtered Swaps Table
  const filteredSwaps = swaps.filter((swap) => {
    const q = swapSearch.toLowerCase();
    const matchesQuery =
      !q ||
      swap.requesterName.toLowerCase().includes(q) ||
      swap.recipientName.toLowerCase().includes(q) ||
      swap.skillOffered.toLowerCase().includes(q) ||
      swap.skillRequested.toLowerCase().includes(q) ||
      swap.message.toLowerCase().includes(q);

    let matchesStatus = true;
    if (swapStatusFilter !== 'ALL') matchesStatus = swap.status === swapStatusFilter;

    return matchesQuery && matchesStatus;
  });

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    adminUpdateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    adminCreateStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `student.${Date.now()}@shailabalawomenscollege.ac.in`,
      collegeId: newStudentCollegeId.trim() || `SBWAC-2024-STU${Math.floor(100 + Math.random() * 900)}`,
      password: newStudentPassword || 'password123',
      skillsOffered: newStudentOffered.split(',').map((s) => s.trim()).filter(Boolean),
      skillsWanted: newStudentWanted.split(',').map((s) => s.trim()).filter(Boolean),
      bio: newStudentBio.trim() || "Student at Shailabala Women's Autonomous College, Cuttack.",
      coinBalance: Number(newStudentCoins) || 100
    });

    setIsAddStudentOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentCollegeId('');
    setNewStudentOffered('');
    setNewStudentWanted('');
    setNewStudentBio('');
    setNewStudentCoins(100);
  };

  const handleApplyCoinAdjust = () => {
    if (!coinAdjustStudent) return;
    adminAdjustCoins(coinAdjustStudent.id, coinAdjustAmount, coinAdjustReason);
    setCoinAdjustStudent(null);
  };

  const handleSaveNotice = () => {
    setAdminNotice(noticeInput);
    setBroadcastSuccess('Campus notification banner updated successfully!');
    setTimeout(() => setBroadcastSuccess(''), 3000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    adminBroadcastAlert(broadcastTitle.trim(), broadcastMsg.trim());
    setBroadcastTitle('');
    setBroadcastMsg('');
    setBroadcastSuccess('Broadcast alert sent to all student inboxes!');
    setTimeout(() => setBroadcastSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 pb-28 max-w-6xl mx-auto">
      {/* Top Admin Navigation & Identification Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/40 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-extrabold text-white">
                  Personal Administration Suite
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  CONFIDENTIAL • ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Maintain all Shailabala students, inspect skill demands & unmet needs, oversee barter exchanges, and manage college broadcasts.
              </p>
            </div>
          </div>

          {/* Top Actions: Lock Session */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-semibold hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin: Ishani Mitra</span>
            </div>

            <button
              onClick={lockAdmin}
              className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Lock Admin session and return to student view"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock & Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Secret Link Card for Ishani */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-2 border-indigo-500/50 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 mt-0.5">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-heading font-extrabold text-white">
                  Your Personal Secret Admin Link (Bookmark This URL)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRIVATE TO YOU
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Other students and visitors will <strong>never see</strong> this Admin page or any buttons. Only you can access this panel by opening your personal bookmark link below.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyAdminLink}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg ${
              linkCopied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-1 ring-indigo-400'
            }`}
          >
            {linkCopied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Copy Personal Secret Link</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono text-indigo-300 break-all select-all">
          <span className="truncate">{getPersonalAdminLink()}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            Auto-Unlock URL
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Admin buttons are completely hidden from all other students
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Shortcut: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px] text-white">Ctrl + Shift + A</kbd> anywhere
          </span>
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-indigo-400 mb-1.5">
            <Users className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Total Students</span>
          </div>
          <p className="text-xl font-heading font-extrabold text-white">{totalStudentsCount}</p>
          <span className="text-[10px] text-emerald-400 font-medium">{verifiedCount} Verified with ID</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-emerald-400 mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Demands Logged</span>
          </div>
          <p className="text-xl font-heading font-extrabold text-white">{studentNeedsRanked.length} Topics</p>
          <span className="text-[10px] text-slate-400">Skills wanted by peers</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-violet-400 mb-1.5">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Swap Barters</span>
          </div>
          <p className="text-xl font-heading font-extrabold text-white">{totalSwapsCount}</p>
          <span className="text-[10px] text-violet-300">{completedSwapsCount} Settled & Finished</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-amber-400 mb-1.5">
            <Store className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Marketplace</span>
          </div>
          <p className="text-xl font-heading font-extrabold text-white">{skills.length} Courses</p>
          <span className="text-[10px] text-slate-400">Student offerings</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center justify-between text-amber-400 mb-1.5">
            <Coins className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Coin Pool</span>
          </div>
          <p className="text-xl font-heading font-extrabold text-amber-400">{totalCoinsInCirculation}</p>
          <span className="text-[10px] text-slate-400">Total circulating</span>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'students', label: '👥 Student Directory', count: totalStudentsCount },
          { id: 'needs', label: '🎯 Student Needs & Demands', count: studentNeedsRanked.length },
          { id: 'activities', label: '⚡ Live Barters & Swaps', count: totalSwapsCount },
          { id: 'marketplace', label: '🛍️ Marketplace Listings', count: skills.length },
          { id: 'feedback', label: '💡 Problems & Roadmaps', count: feedbacks.length },
          { id: 'broadcast', label: '📢 Campus Broadcasts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              adminTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  adminTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL STUDENTS MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          {/* Central Cloud Database Sync & Live Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-4 rounded-2xl border border-emerald-500/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
                <Users className="w-4 h-4 text-emerald-300 relative" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-extrabold text-xs text-white">
                    Central User Accounts Registry (Live Multi-Device Sync)
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Every student account created or logged in on any mobile phone, tablet, or laptop appears here in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowAuditLogs(!showAuditLogs)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showAuditLogs
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-indigo-500/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{showAuditLogs ? 'Hide Audit Log' : `Login & Sign-up Audit (${loginLogs.length})`}</span>
              </button>

              <button
                onClick={() => refreshUsers()}
                disabled={isSyncingWithServer}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                title="Refresh user accounts from central server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithServer ? 'animate-spin' : ''}`} />
                <span>{isSyncingWithServer ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Login & Registration Audit Log Viewer */}
          {showAuditLogs && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-heading font-bold text-xs text-white">
                    Live Student Activity & Account Creation Ledger
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {loginLogs.length} events recorded
                </span>
              </div>

              {loginLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No login or registration activity recorded yet in this session.
                </p>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {loginLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            log.type === 'REGISTRATION'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {log.type === 'REGISTRATION' ? 'Created Account' : 'Logged In'}
                        </span>
                        <div>
                          <p className="font-bold text-white leading-tight">
                            {log.userName}
                            {log.collegeId && (
                              <span className="ml-1.5 font-mono text-[10px] text-emerald-400">
                                ({log.collegeId})
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{log.userEmail}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-300 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                        <p className="text-[9px] text-slate-500">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Directory Title Bar & Add Student Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <div>
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                All User Accounts ({filteredStudents.length} of {targetAccountsList.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                View all students who created accounts, inspect passwords for support, edit details, and adjust Skill Coins.
              </p>
            </div>

            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search accounts by Name, College Roll ID, Email, or Skills..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: `All Students (${totalStudentsCount})` },
                { id: 'CREATED', label: `Newly Created (${createdCount})` },
                { id: 'RECENT_LOGINS', label: 'Recent Logins' },
                { id: 'VERIFIED', label: `Verified (${verifiedCount})` },
                { id: 'ACTIVE', label: 'Active' },
                { id: 'BANNED', label: 'Suspended' },
                { id: 'GUESTS', label: 'Guest Visitors' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStudentFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    studentFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Students Directory Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-3">Roll ID & Credentials</th>
                  <th className="py-3 px-3">Account Activity</th>
                  <th className="py-3 px-3">Can Teach</th>
                  <th className="py-3 px-3">Wants to Learn</th>
                  <th className="py-3 px-3">Coins</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No accounts found matching your filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isNewlyCreated = !!student.createdAt || student.id.startsWith('user_');
                    return (
                      <tr key={student.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Name, Avatar & Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-bold text-white leading-snug">{student.name}</p>
                                {isNewlyCreated && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    CREATED ACCOUNT
                                  </span>
                                )}
                                {student.isGuest && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    GUEST
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* College Roll ID & Password */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                              <CreditCard className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{student.collegeId || 'NO ROLL ID'}</span>
                            </div>

                            <button
                              onClick={() =>
                                setPasswordViewId(passwordViewId === student.id ? null : student.id)
                              }
                              className="flex items-center gap-1 text-[10px] font-mono text-amber-300/80 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/20 transition-colors"
                              title="Click to view registered password"
                            >
                              <KeyRound className="w-2.5 h-2.5 text-amber-400" />
                              <span>
                                {passwordViewId === student.id
                                  ? (student.password || 'password123')
                                  : '••••••••'}
                              </span>
                              {passwordViewId === student.id ? (
                                <EyeOff className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                              ) : (
                                <Eye className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Account Created & Last Login Time */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5 text-[10px]">
                            <p className="text-slate-300 flex items-center gap-1 font-mono">
                              <span className="text-slate-500">Created:</span>
                              {student.createdAt
                                ? new Date(student.createdAt).toLocaleDateString([], {
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'Pre-registered'}
                            </p>
                            <p className="text-slate-400 flex items-center gap-1 font-mono">
                              <span className="text-slate-500">Active:</span>
                              {student.lastLoginAt
                                ? new Date(student.lastLoginAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : student.lastActive || 'Online'}
                            </p>
                          </div>
                        </td>

                        {/* Skills Offered */}
                        <td className="py-3.5 px-3 max-w-[130px]">
                          <div className="flex flex-wrap gap-1">
                            {student.skillsOffered && student.skillsOffered.length > 0 ? (
                              student.skillsOffered.slice(0, 2).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 truncate"
                                >
                                  {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 text-[10px]">None listed</span>
                            )}
                            {student.skillsOffered && student.skillsOffered.length > 2 && (
                              <span className="text-[9px] text-slate-400 font-bold">
                                +{student.skillsOffered.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Skills Wanted */}
                        <td className="py-3.5 px-3 max-w-[130px]">
                          <div className="flex flex-wrap gap-1">
                            {student.skillsWanted && student.skillsWanted.length > 0 ? (
                              student.skillsWanted.slice(0, 2).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20 truncate"
                                >
                                  {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 text-[10px]">None listed</span>
                            )}
                            {student.skillsWanted && student.skillsWanted.length > 2 && (
                              <span className="text-[9px] text-slate-400 font-bold">
                                +{student.skillsWanted.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Coins */}
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => setCoinAdjustStudent(student)}
                            className="flex items-center gap-1 text-amber-400 font-extrabold hover:text-amber-300 transition-colors bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
                            title="Click to adjust Skill Coins"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                            <span>{student.coinBalance || 0}</span>
                            <Edit3 className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                          </button>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          {student.isBlocked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Full Profile */}
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                              title="Edit Student Profile"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            </button>

                            {/* Ban / Unban */}
                            {student.isBlocked ? (
                              <button
                                onClick={() => unbanUser(student.id)}
                                className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
                                title="Unban Student"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() => banUser(student.id)}
                                className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 transition-colors border border-rose-500/30"
                                title="Suspend Account"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Account */}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to permanently delete student ${student.name}?`
                                  )
                                ) {
                                  adminDeleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 transition-colors border border-rose-500/20"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT NEEDS & DEMANDS TRACKER */}
      {/* ========================================================================= */}
      {adminTab === 'needs' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Student Needs & Learning Demands Intelligence
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Aggregated overview of every skill requested by Shailabala students. Use this to identify campus skill shortages, organize college workshops, or pair learners directly with student mentors.
            </p>
          </div>

          {/* Demands Frequency Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentNeedsRanked.map(([skillName, info], idx) => {
              // Find mentors in the database who teach this skill
              const availableMentors = nonAdminStudents.filter((s) =>
                s.skillsOffered.some((offered) =>
                  offered.toLowerCase().includes(skillName.toLowerCase()) ||
                  skillName.toLowerCase().includes(offered.toLowerCase())
                )
              );

              return (
                <div
                  key={skillName}
                  className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between gap-3 shadow-md hover:border-indigo-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Rank #{idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {info.count} Students In Need
                      </span>
                    </div>

                    <h4 className="font-heading font-extrabold text-sm text-white">
                      {skillName}
                    </h4>

                    {/* Students who need this */}
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Requested by:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {info.studentNames.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Available Peer Mentors */}
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Available Peer Tutors ({availableMentors.length}):
                      </span>
                      {availableMentors.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {availableMentors.map((m) => (
                            <span
                              key={m.id}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          High Shortage: No student currently teaching this!
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBroadcastTitle(`Tutors Needed: ${skillName}`);
                      setBroadcastMsg(
                        `Calling all Shailabala students who know ${skillName}! ${info.count} fellow peers are looking for barter sessions. Post your skill to earn Skill Coins.`
                      );
                      setAdminTab('broadcast');
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-700/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    <Megaphone className="w-3 h-3" />
                    <span>Call for Tutors</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVE STUDENT ACTIVITIES & SWAPS */}
      {/* ========================================================================= */}
      {adminTab === 'activities' && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-violet-400" />
                Live Barters, Swaps & Virtual Classroom Activity
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect all 1-on-1 swap negotiations, virtual classroom sessions, and force complete or settle disputes.
              </p>
            </div>
          </div>

          {/* Search & Filter Swaps */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search swap exchanges by student names or skill keywords..."
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSwapStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    swapStatusFilter === st
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Swaps Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">Requester (Learner)</th>
                  <th className="py-3 px-3">Recipient (Teacher)</th>
                  <th className="py-3 px-3">Skills Traded</th>
                  <th className="py-3 px-3">Message</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Admin Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {filteredSwaps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No swap requests matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredSwaps.map((swap) => (
                    <tr key={swap.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Requester */}
                      <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                        <img
                          src={swap.requesterAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span>{swap.requesterName}</span>
                      </td>

                      {/* Recipient */}
                      <td className="py-3.5 px-3 font-bold">
                        <div className="flex items-center gap-2">
                          <img
                            src={swap.recipientAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{swap.recipientName}</span>
                        </div>
                      </td>

                      {/* Skills Exchanged */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1 text-[11px]">
                          <div className="text-emerald-300 font-semibold flex items-center gap-1">
                            <span>Learns:</span> <span className="font-bold">{swap.skillRequested}</span>
                          </div>
                          <div className="text-indigo-300 font-semibold flex items-center gap-1">
                            <span>Offers:</span> <span>{swap.skillOffered}</span>
                          </div>
                        </div>
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-3 max-w-[180px]">
                        <p className="text-slate-300 text-[11px] truncate" title={swap.message}>
                          {swap.message || 'Standard peer barter swap request'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            swap.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : swap.status === 'ACCEPTED'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : swap.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {swap.status}
                        </span>
                      </td>

                      {/* Admin Override Controls */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {swap.status === 'ACCEPTED' && (
                            <button
                              onClick={() =>
                                openVideoClassroom({
                                  swapId: swap.id,
                                  peerName: swap.recipientName,
                                  peerAvatar: swap.recipientAvatar,
                                  topic: swap.skillRequested
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 hover:bg-indigo-600/50"
                              title="Join Video Session as Moderator"
                            >
                              Join Video
                            </button>
                          )}

                          {swap.status !== 'COMPLETED' && (
                            <button
                              onClick={() => adminUpdateSwapStatus(swap.id, 'COMPLETED')}
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 hover:bg-emerald-600/30"
                              title="Force complete and settle coin rewards"
                            >
                              Settle & Complete
                            </button>
                          )}

                          {swap.status !== 'CANCELLED' && (
                            <button
                              onClick={() => adminUpdateSwapStatus(swap.id, 'CANCELLED')}
                              className="p-1 rounded-lg bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Cancel / Void Swap"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MARKETPLACE LISTINGS MODERATION */}
      {/* ========================================================================= */}
      {adminTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                Marketplace Skill Listings ({skills.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Review all courses, delete spam or duplicate listings, and moderate skill content.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {skill.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" /> {skill.coinsCost} Coins
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
                    <img
                      src={skill.userAvatarUrl}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-200">{skill.userName}</span>
                    <span className="text-[10px] text-slate-400 ml-auto font-mono">
                      {new Date(skill.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {skill.format} Session
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete listing "${skill.title}"?`)) {
                        adminDeleteSkill(skill.id);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Listing</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROBLEMS & ROADMAPS */}
      {/* ========================================================================= */}
      {adminTab === 'feedback' && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
                Student Problems & Feature Roadmaps ({feedbacks.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Review student-reported bottlenecks and publish official resolution plans.
              </p>
            </div>

            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Issue</span>
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-slate-700/60">
              <p className="text-xs text-slate-400">No student problems recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {fb.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300">
                          {fb.priority} Priority
                        </span>
                        <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {fb.upvotes} upvotes
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white">{fb.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        By {fb.userName} • {new Date(fb.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {(['SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'RESOLVED'] as FeedbackStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateFeedbackStatus(fb.id, st, fb.adminResponse)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            fb.status === st
                              ? st === 'RESOLVED'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : st === 'PLANNED'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : st === 'UNDER_REVIEW'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-slate-700 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteFeedback(fb.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {fb.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={feedbackReply[fb.id] !== undefined ? feedbackReply[fb.id] : (fb.adminResponse || '')}
                      onChange={(e) =>
                        setFeedbackReply((prev) => ({ ...prev, [fb.id]: e.target.value }))
                      }
                      placeholder="Write administrator resolution roadmap..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        const text = feedbackReply[fb.id] !== undefined ? feedbackReply[fb.id] : fb.adminResponse;
                        if (text) {
                          updateFeedbackStatus(
                            fb.id,
                            fb.status === 'SUBMITTED' ? 'UNDER_REVIEW' : fb.status,
                            text
                          );
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Save Response</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CAMPUS BROADCASTS */}
      {/* ========================================================================= */}
      {adminTab === 'broadcast' && (
        <div className="space-y-6">
          {broadcastSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          {/* Campus Header Notice Banner */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              Campus-Wide Top Banner Notice
            </h3>
            <p className="text-xs text-slate-400">
              This message appears at the very top of the student home screen and marketplace for all logged-in and guest students.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={noticeInput}
                onChange={(e) => setNoticeInput(e.target.value)}
                placeholder="Enter campus notice text..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveNotice}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shrink-0"
              >
                Update Banner
              </button>
            </div>
          </div>

          {/* Send Broadcast Notification to Inboxes */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              Broadcast Notification to All Student Inboxes
            </h3>
            <p className="text-xs text-slate-400">
              Instantly sends a high-priority system alert to every registered student on the platform.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g., Shailabala Python & Spoken English Workshop this Saturday"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Provide all guidelines, room numbers, or skill incentives..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast to All Students</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW STUDENT */}
      {/* ========================================================================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Register New Shailabala Student
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Barshashree Mohapatra"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    College Roll ID
                  </label>
                  <input
                    type="text"
                    value={newStudentCollegeId}
                    onChange={(e) => setNewStudentCollegeId(e.target.value)}
                    placeholder="e.g. SBWAC-2024-CS088"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="student@shailabalawomenscollege.ac.in"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Initial Skill Coins
                  </label>
                  <input
                    type="number"
                    value={newStudentCoins}
                    onChange={(e) => setNewStudentCoins(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Default Password
                  </label>
                  <input
                    type="text"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">
                  Skills Offered (comma separated)
                </label>
                <input
                  type="text"
                  value={newStudentOffered}
                  onChange={(e) => setNewStudentOffered(e.target.value)}
                  placeholder="e.g. Python, Machine Learning, Odia Writing"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-400 block mb-1">
                  Skills Wanted / Needs (comma separated)
                </label>
                <input
                  type="text"
                  value={newStudentWanted}
                  onChange={(e) => setNewStudentWanted(e.target.value)}
                  placeholder="e.g. Spoken English, Viva Preparation"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Bio / Student Department
                </label>
                <textarea
                  rows={2}
                  value={newStudentBio}
                  onChange={(e) => setNewStudentBio(e.target.value)}
                  placeholder="e.g. Computer Science 2nd Year student..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Create Student Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT STUDENT PROFILE */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Edit Profile: {editingStudent.name}
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    College Roll ID
                  </label>
                  <input
                    type="text"
                    value={editingStudent.collegeId || ''}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, collegeId: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, email: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">
                  Skills Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingStudent.skillsOffered.join(', ')}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      skillsOffered: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-400 block mb-1">
                  Skills Wanted (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingStudent.skillsWanted.join(', ')}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      skillsWanted: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Bio / Department Info
                </label>
                <textarea
                  rows={2}
                  value={editingStudent.bio}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, bio: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COIN BALANCE ADJUSTMENT */}
      {/* ========================================================================= */}
      {coinAdjustStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                Adjust Coins: {coinAdjustStudent.name}
              </h3>
              <button
                onClick={() => setCoinAdjustStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">Current Balance:</span>{' '}
              <span className="font-extrabold text-amber-400">{coinAdjustStudent.coinBalance} Coins</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Coin Adjustment Amount (+ or -)
                </label>
                <input
                  type="number"
                  value={coinAdjustAmount}
                  onChange={(e) => setCoinAdjustAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  value={coinAdjustReason}
                  onChange={(e) => setCoinAdjustReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCoinAdjustStudent(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCoinAdjust}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
                >
                  Apply Coin Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
