import React from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { Bell, Coins, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const Header: React.FC = () => {
  const { currentUser, notifications, setActiveTab, setIsAuthModalOpen, logoutUser } = useSkillsSwap();
  const unreadCount = notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;

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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                Verified Exchange
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">No Money • Pure Skill Barter</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current Logged In Account Badge with Logout Option */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-indigo-500/50 shrink-0"
            />
            <span className="text-xs font-bold text-slate-200 max-w-[90px] sm:max-w-[120px] md:max-w-[150px] truncate">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                title="Sign in or register a new account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button
                onClick={logoutUser}
                className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                title="Log out of current account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Skill Coin Wallet Pill */}
          <div
            onClick={() => setActiveTab(6)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
            title="Skill Coins Balance"
          >
            <Coins className="w-4 h-4" />
            <span>{currentUser.coinBalance} Coins</span>
          </div>

          {/* Admin Switch */}
          {currentUser.isAdmin && (
            <button
              onClick={() => setActiveTab(7)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}

          {/* Notification Icon */}
          <button
            onClick={() => setActiveTab(5)}
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
