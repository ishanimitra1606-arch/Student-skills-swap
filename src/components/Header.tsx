import React from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { Bell, Coins, LogIn, LogOut, ShieldCheck, MessageSquarePlus, User } from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const Header: React.FC = () => {
  const { currentUser, notifications, setActiveTab, setIsAuthModalOpen, openAuthModal, setIsFeedbackModalOpen, logoutUser, isAdminUnlocked } = useSkillsSwap();
  const unreadCount = notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;
  const isGuest = currentUser.isGuest || currentUser.id === 'guest_student' || currentUser.id.startsWith('guest');

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => setActiveTab(0)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform bg-slate-950 flex items-center justify-center shrink-0">
            <img
              src={appLogo}
              alt="SkillsSwap Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                <span>Student Skills Swap</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline-block">
                SBWAC Exclusive Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Shailabala Women's Autonomous College, Cuttack</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guest vs Logged In Account Display */}
          {isGuest ? (
            <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-indigo-500/30">
              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatarUrl}
                    alt="Guest Student"
                    className="w-7 h-7 rounded-full object-cover border-2 border-slate-600 shrink-0"
                  />
                  <span className="w-2 h-2 rounded-full bg-amber-400 border border-slate-900 absolute bottom-0 right-0" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-amber-300 leading-tight">
                    Guest Student
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">
                    Preview Mode
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-1 border-l border-slate-700/60 pl-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  title="Log in with Shailabala College ID"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hidden sm:flex items-center gap-1 shadow-sm"
                  title="Create Student Profile & Earn +100 Coins"
                >
                  <span>Register</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab(6)}
                className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
                title="Open My User Page / Profile"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-indigo-500/60 shrink-0"
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 absolute bottom-0 right-0" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-200 max-w-[100px] md:max-w-[140px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-indigo-300 font-mono font-medium truncate">
                    {currentUser.collegeId || 'User Page'}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1.5 ml-1 border-l border-slate-700/60 pl-2">
                <button
                  onClick={() => setActiveTab(6)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all hidden md:flex items-center gap-1"
                  title="View Full User Profile Page"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all hidden sm:flex items-center gap-1 border border-slate-600 shadow-sm"
                  title="Switch account or register student ID"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Switch</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  title="Log out to Guest Mode"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-300" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Skill Coin Wallet Pill */}
          <div
            onClick={() => (isGuest ? openAuthModal('login') : setActiveTab(6))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
            title={isGuest ? 'Log in to claim +100 Skill Coins Welcome Bonus' : 'Skill Coins Balance'}
          >
            <Coins className="w-4 h-4" />
            <span>{currentUser.coinBalance} Coins</span>
          </div>

          {/* Feedback & Problem Box Button */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all shadow-sm group"
            title="Student Problem & Feedback Box (Earn +5 Coins)"
          >
            <MessageSquarePlus className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Feedback Box</span>
          </button>

          {/* Admin Switch - ONLY visible when personal admin link is unlocked */}
          {isAdminUnlocked && (
            <button
              onClick={() => setActiveTab(7)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
              title="Personal Administrator Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Admin Suite</span>
            </button>
          )}

          {/* Notification Icon */}
          <button
            onClick={() => (isGuest ? openAuthModal('login') : setActiveTab(5))}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
