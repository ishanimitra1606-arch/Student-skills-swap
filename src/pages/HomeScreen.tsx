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
  Gift
} from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    claimDailyCheckIn,
    skills,
    swaps,
    setActiveTab
  } = useSkillsSwap();

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<SkillItem | null>(null);

  const activeSwapsCount = swaps.filter(
    (s) =>
      (s.requesterId === currentUser.id || s.recipientId === currentUser.id) &&
      s.status === 'ACCEPTED'
  ).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
              />
              <img
                src={appLogo}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full border border-slate-900 absolute -bottom-1 -right-1"
                title="SkillsSwap Official Website Member"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-1.5">
                  <span>Welcome back, {currentUser.name}!</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <img src={appLogo} alt="" className="w-3 h-3 rounded-full" />
                    Verified
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {currentUser.college}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {currentUser.bio}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {currentUser.city}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {currentUser.rating} ({currentUser.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Daily Bonus Claim Card */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col justify-between gap-3 min-w-[220px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-xs">
                <Gift className="w-4 h-4" />
                <span>Daily Rewards</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">+10 Coins</span>
            </div>
            <button
              onClick={claimDailyCheckIn}
              disabled={currentUser.dailyCheckInClaimed}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                currentUser.dailyCheckInClaimed
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20'
              }`}
            >
              {currentUser.dailyCheckInClaimed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Claimed Today
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" /> Claim Daily Bonus
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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
          onClick={() => setShowAddSkill(true)}
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

      {/* Featured Recommended Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Trending Peer Skills
            </h3>
            <p className="text-xs text-slate-400">Available for barter session exchange</p>
          </div>
          <button
            onClick={() => setActiveTab(1)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View All →
          </button>
        </div>

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
                  onClick={() => setSelectedSkillForSwap(skill)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
                >
                  Swap Skill
                </button>
              </div>
            </div>
          ))}
        </div>
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
