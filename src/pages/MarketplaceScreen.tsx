import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SkillCategory, FormatType, SkillItem } from '../types';
import { AddSkillModal } from '../components/AddSkillModal';
import { SwapModal } from '../components/SwapModal';
import { Search, Plus, Filter, Coins, Star, MapPin, Tag, ShieldCheck } from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

const CATEGORIES: SkillCategory[] = [
  'All Categories',
  'Programming & Tech',
  'UI/UX & Graphic Design',
  'Music & Instruments',
  'Languages & Linguistics',
  'Math & Statistics',
  'Science & Engineering',
  'Marketing & Business',
  'Photo & Video Editing',
  'Personal Growth & Soft Skills'
];

export const MarketplaceScreen: React.FC = () => {
  const { skills } = useSkillsSwap();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All Categories');
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<SkillItem | null>(null);

  const filteredSkills = skills.filter((skill) => {
    const matchesCat =
      selectedCategory === 'All Categories' || skill.category === selectedCategory;
    const matchesFormat =
      selectedFormat === 'ALL' || skill.format === selectedFormat;
    const matchesQuery =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      skill.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.userCollege.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesFormat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            Skill Marketplace
          </h2>
          <p className="text-xs text-slate-400">
            Browse skills offered by verified college students
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Post a Skill
        </button>
      </div>

      {/* Search Bar & Mode Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search skills, topics, tags (e.g. Figma, Python, Spanish)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 p-1 rounded-xl">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {(['ALL', 'ONLINE', 'OFFLINE'] as FormatType[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedFormat === fmt
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {fmt === 'ALL' ? 'All Modes' : fmt === 'ONLINE' ? 'Online' : 'Offline'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Items Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/60">
          <p className="text-sm font-bold text-slate-300">No skills found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {skill.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700 text-slate-300">
                    {skill.format}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-white">{skill.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {skill.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-400 text-[10px] font-medium flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={skill.userAvatarUrl}
                      alt={skill.userName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
                    />
                    <img
                      src={appLogo}
                      alt="SkillsSwap Logo"
                      referrerPolicy="no-referrer"
                      className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-900 absolute -bottom-0.5 -right-0.5"
                      title="SkillsSwap Verified Student"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-200">{skill.userName}</p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5" title="Verified Member on SkillsSwap Platform">
                        <img src={appLogo} alt="" className="w-2.5 h-2.5 rounded-full inline" />
                        <span>Member</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-rose-400" /> {skill.userCollege}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" /> {skill.coinsCost}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold flex items-center justify-end gap-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {skill.rating}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSkillForSwap(skill)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-colors"
                  >
                    Swap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddSkillModal onClose={() => setShowAddModal(false)} />}
      {selectedSkillForSwap && (
        <SwapModal
          skill={selectedSkillForSwap}
          onClose={() => setSelectedSkillForSwap(null)}
        />
      )}
    </div>
  );
};
