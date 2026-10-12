import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { AddSkillModal } from '../components/AddSkillModal';
import { SwapModal } from '../components/SwapModal';
import { SkillItem } from '../types';
import {
  Sparkles,
  PlusCircle,
  Coins,
  CheckCircle2,
  TrendingUp,
  MapPin,
  GraduationCap,
  Star,
  Users,
  Gift,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  User,
  ArrowLeftRight,
  MessageSquare,
  Award,
  MessageSquarePlus,
  ThumbsUp,
  Clock,
  Wrench,
  ChevronRight,
  LogOut
} from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    claimDailyCheckIn,
    skills,
    swaps,
    feedbacks,
    setActiveTab,
    setIsAuthModalOpen,
    openAuthModal,
    logoutUser,
    setIsFeedbackModalOpen,
    toggleUpvoteFeedback,
    adminNotice
  } = useSkillsSwap();

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<SkillItem | null>(null);
  const [viewMode, setViewMode] = useState<'profile_hub' | 'market_feed'>('profile_hub');

  const isGuest = currentUser.isGuest || currentUser.id === 'guest_student' || currentUser.id.startsWith('guest');

  const activeSwapsCount = swaps.filter(
    (s) =>
      (s.requesterId === currentUser.id || s.recipientId === currentUser.id) &&
      s.status === 'ACCEPTED'
  ).length;

  const myListedSkills = skills.filter((s) => s.userId === currentUser.id);

  const handleInitiateSwap = (skill: SkillItem) => {
    if (isGuest) {
      openAuthModal('login');
    } else {
      setSelectedSkillForSwap(skill);
    }
  };

  const handleAddSkillClick = () => {
    if (isGuest) {
      openAuthModal('register');
    } else {
      setShowAddSkill(true);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* College Campus Administrator Announcement Notice */}
      {adminNotice && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-emerald-500/15 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <p className="leading-snug text-white">
              <span className="font-extrabold text-amber-400 mr-1.5 uppercase text-[10px] tracking-wider bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                Official Campus Notice:
              </span>
              {adminNotice}
            </p>
          </div>
          <button
            onClick={() => setActiveTab(1)}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] whitespace-nowrap transition-colors shrink-0 hidden sm:block"
          >
            Explore Now
          </button>
        </div>
      )}
      {/* Guest Student Welcome & Access Gateway Banner */}
      {isGuest ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-6 sm:p-8 border-2 border-indigo-500/50 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl}
                  alt="Guest Student"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-500/40 shadow-xl"
                />
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 font-heading absolute -bottom-2 -right-1 shadow-md">
                  GUEST
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    Welcome, Guest Student!
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Preview Mode
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-indigo-200 font-medium flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                  Shailabala Women's Autonomous College, Cuttack • Student Skills Barter Hub
                </p>

                <p className="text-xs text-slate-300 max-w-2xl pt-1 leading-relaxed">
                  Log in with your Shailabala College ID or create your student profile to unlock peer skill exchanges, claim your <strong className="text-amber-400 font-bold">+100 Skill Coins Welcome Bonus</strong>, and join live 1-on-1 virtual classrooms.
                </p>
              </div>
            </div>

            {/* Quick Login / Create Profile Action Panel */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <button
                onClick={() => openAuthModal('login')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Log In with College ID</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Student Profile (+100 Coins)</span>
              </button>
            </div>
          </div>

          {/* Guest Feature Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-500/20">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">100 Free Skill Coins</div>
                <div className="text-[10px] text-slate-400">Awarded immediately on profile creation</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">SBWAC Verified Students</div>
                <div className="text-[10px] text-slate-400">Exclusive campus barter community</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Zero Real Money</div>
                <div className="text-[10px] text-slate-400">Trade knowledge: Python, Java, English, Art</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Comprehensive Student User Profile Page & ID Card Hub for Logged In Students */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 p-6 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Row of Student Profile */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
                />
                <img
                  src={appLogo}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full border-2 border-slate-900 absolute -bottom-1 -right-1 shadow-md"
                  title="SkillsSwap Verified Student Member"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified SBWAC Student
                  </span>
                  {currentUser.collegeId && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      ID: {currentUser.collegeId}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap font-medium">
                  <span className="flex items-center gap-1 text-indigo-300">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {currentUser.college}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    {currentUser.city}
                  </span>
                </p>

                <p className="text-xs text-slate-400 max-w-xl line-clamp-2 pt-0.5">
                  {currentUser.bio}
                </p>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {currentUser.rating} ({currentUser.reviewCount} peer ratings)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-medium">
                    {currentUser.completedSwaps || 0} Swaps Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Student Coins & Daily Claim Box */}
            <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col justify-between gap-3 min-w-[240px] shadow-lg shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Skill Coin Balance</div>
                    <div className="text-base font-extrabold text-amber-400 font-heading">
                      {currentUser.coinBalance} Coins
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  +10 Daily
                </span>
              </div>

              <button
                onClick={claimDailyCheckIn}
                disabled={currentUser.dailyCheckInClaimed}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currentUser.dailyCheckInClaimed
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 font-extrabold'
                }`}
              >
                {currentUser.dailyCheckInClaimed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Daily Reward Claimed
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" /> Claim 10 Bonus Coins
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student Skills & Portfolio Summary Cards on Front Page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            {/* Skills Offered Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Skills I Can Teach (Offered)
                  </h4>
                </div>
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                  currentUser.skillsOffered.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills listed yet.</span>
                )}
              </div>
            </div>

            {/* Skills Wanted Card */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Skills I Want to Learn (Wanted)
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab(2)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Find Tutors
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentUser.skillsWanted && currentUser.skillsWanted.length > 0 ? (
                  currentUser.skillsWanted.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No target learning skills set.</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick User Navigation Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(6)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <User className="w-3.5 h-3.5" /> Open Full User Profile
              </button>
              <button
                onClick={() => setShowAddSkill(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" /> Post New Skill
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <button
                onClick={() => setActiveTab(3)}
                className="hover:text-white transition-colors underline flex items-center gap-1"
              >
                <ArrowLeftRight className="w-3 h-3 text-indigo-400" /> {activeSwapsCount} Active Swaps
              </button>
              <span>•</span>
              <button
                onClick={() => openAuthModal('login')}
                className="hover:text-indigo-300 transition-colors font-bold"
              >
                Switch ID
              </button>
              <span>•</span>
              <button
                onClick={logoutUser}
                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1"
                title="Log out of account"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab(2)}
          className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-white font-heading">AI Smart Match</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Find student matches</p>
        </button>

        <button
          onClick={handleAddSkillClick}
          className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-white font-heading">Offer a Skill</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Post new listing</p>
        </button>

        <button
          onClick={() => setActiveTab(1)}
          className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-white font-heading">Explore Market</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Browse all categories</p>
        </button>

        <button
          onClick={() => setActiveTab(3)}
          className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-white font-heading">Active Swaps</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{activeSwapsCount} ongoing</p>
        </button>
      </div>

      {/* Student Problem & Feedback Box Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-heading font-extrabold text-white">
                  Student Problem & Feedback Box
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" /> +5 Coins Reward
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Write your campus challenges, timetable clashes, or platform ideas — we review and solve them in future updates!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Problem</span>
            </button>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>View All ({feedbacks.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Highlighted Student Problems List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {feedbacks.slice(0, 2).map((fb) => {
            const hasUpvoted = fb.upvotedBy?.includes(currentUser.id);
            return (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {fb.category}
                    </span>
                    {fb.status === 'PLANNED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" /> Planned for Solution
                      </span>
                    ) : fb.status === 'RESOLVED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Solved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> Under Review
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-xs text-white line-clamp-1">{fb.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{fb.description}</p>
                </div>

                {fb.adminResponse && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2"><strong>Solution:</strong> {fb.adminResponse}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-medium">{fb.userName}</span>
                  <button
                    onClick={() => toggleUpvoteFeedback(fb.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      hasUpvoted
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasUpvoted ? 'fill-white' : ''}`} />
                    <span>{fb.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Recommended Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Trending Peer Skills
            </h3>
            <p className="text-xs text-slate-400">Available for barter session exchange at SBWAC</p>
          </div>
          <button
            onClick={() => setActiveTab(1)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">No skills listed yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">Be the pioneer! Post a skill you can teach to start swapping and earning Skill Coins with your peers.</p>
            </div>
            <button
              onClick={handleAddSkillClick}
              className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Offer a Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.slice(0, 4).map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {skill.category}
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> {skill.coinsCost} Coins
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white">{skill.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{skill.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <img
                      src={skill.userAvatarUrl}
                      alt={skill.userName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{skill.userName}</p>
                      <p className="text-[10px] text-slate-400">{skill.userCollege}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiateSwap(skill)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
                  >
                    Swap Skill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && <AddSkillModal onClose={() => setShowAddSkill(false)} />}

      {/* Request Swap Modal */}
      {selectedSkillForSwap && (
        <SwapModal
          skill={selectedSkillForSwap}
          onClose={() => setSelectedSkillForSwap(null)}
        />
      )}
    </div>
  );
};
