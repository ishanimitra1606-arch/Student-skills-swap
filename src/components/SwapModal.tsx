import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SkillItem } from '../types';
import { X, ArrowRightLeft } from 'lucide-react';

interface SwapModalProps {
  skill: SkillItem;
  onClose: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({ skill, onClose }) => {
  const { currentUser, createSwapRequest, setActiveTab } = useSkillsSwap();

  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState(
    currentUser.skillsOffered[0] || 'Peer Tutoring'
  );
  const [message, setMessage] = useState(
    `Hi ${skill.userName}! I am interested in swapping my ${selectedOfferedSkill} skill for your ${skill.title}. Let me know if you are open to exchange!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSwapRequest(skill.userId, selectedOfferedSkill, skill.title, message);
    onClose();
    setActiveTab(3); // Navigate to Swaps screen
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-heading font-bold text-white">
              Request Skill Swap
            </h2>
            <p className="text-xs text-slate-400">
              Exchange skills with {skill.userName} ({skill.userCollege})
            </p>
          </div>
        </div>

        {/* Skill requested summary */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 mb-4">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
            You will learn:
          </span>
          <p className="text-sm font-bold text-white mt-0.5">{skill.title}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{skill.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Skill You Offer to Teach *
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {currentUser.skillsOffered.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
              <option value="Custom Skill Exchange">Custom Skill Exchange</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Message to {skill.userName}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
            💡 <strong>No Cash Required:</strong> 20 Skill Coins are held in escrow and transferred only when both parties complete the session.
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
