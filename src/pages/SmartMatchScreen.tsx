import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SmartMatchResult, SkillItem } from '../types';
import { SwapModal } from '../components/SwapModal';
import { Sparkles, MapPin, GraduationCap, ArrowRightLeft, CheckCircle } from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

export const SmartMatchScreen: React.FC = () => {
  const { computeSmartMatches, skills } = useSkillsSwap();
  const matches: SmartMatchResult[] = computeSmartMatches();
  const [selectedMatch, setSelectedMatch] = useState<SmartMatchResult | null>(null);

  const handleOpenSwapModal = (match: SmartMatchResult) => {
    // Find skill offered by match.student
    const skill = skills.find(
      (s) => s.userId === match.student.id && s.title.includes(match.matchedOfferedSkill)
    ) || skills.find((s) => s.userId === match.student.id) || {
      id: `skill_synthetic_${match.student.id}`,
      userId: match.student.id,
      userName: match.student.name,
      userCollege: match.student.college,
      userCity: match.student.city,
      userAvatarUrl: match.student.avatarUrl,
      title: match.matchedOfferedSkill,
      description: `Peer skill exchange for ${match.matchedOfferedSkill}`,
      category: 'Programming & Tech',
      format: 'ONLINE',
      coinsCost: 20,
      rating: match.student.rating,
      tags: [match.matchedOfferedSkill],
      createdAt: Date.now()
    };

    setSelectedSkillForSwap(skill);
  };

  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<SkillItem | null>(null);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900/80 via-indigo-900/70 to-slate-900 border border-violet-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            AI Smart Skill Matcher
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-xl">
          Our intelligent algorithm analyzes your offered & wanted skills, campus location, and reviews to recommend high-affinity student exchange partners.
        </p>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.student.id}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-violet-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={match.student.avatarUrl}
                  alt={match.student.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/40"
                />
                <img
                  src={appLogo}
                  alt="SkillsSwap Logo"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full ring-2 ring-slate-900 absolute -bottom-1 -right-1 shadow-md"
                  title="SkillsSwap Verified Student"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-1.5">
                    <span>{match.student.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <img src={appLogo} alt="" className="w-3 h-3 rounded-full" />
                      SkillsSwap Verified
                    </span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {match.matchScore}% Match Score
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    {match.student.college}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {match.student.city}
                  </span>
                </div>

                {/* Skill exchange preview */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    Offers: {match.matchedOfferedSkill}
                  </span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold">
                    Wants: {match.matchedWantedSkill}
                  </span>
                </div>

                {/* Match Reasons */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {match.matchReasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900/80 text-slate-300 flex items-center gap-1 border border-slate-700/50"
                    >
                      <CheckCircle className="w-3 h-3 text-violet-400" />
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700/60">
              <button
                onClick={() => handleOpenSwapModal(match)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" /> Propose Swap
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedSkillForSwap && (
        <SwapModal
          skill={selectedSkillForSwap}
          onClose={() => setSelectedSkillForSwap(null)}
        />
      )}
    </div>
  );
};
