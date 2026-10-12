import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SkillCategory, FormatType, SkillItem, User } from '../types';
import { AddSkillModal } from '../components/AddSkillModal';
import { SwapModal } from '../components/SwapModal';
import {
  Search,
  Plus,
  Filter,
  Coins,
  Star,
  MapPin,
  Tag,
  ShieldCheck,
  Users,
  UserCheck,
  Sparkles,
  ArrowRightLeft,
  Video,
  CreditCard,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Eye,
  Clock,
  ArrowUpRight
} from 'lucide-react';
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
  const {
    skills,
    users,
    currentUser,
    openAuthModal,
    setActiveTab,
    openVideoClassroom,
    adminNotice
  } = useSkillsSwap();

  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All Categories');
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillForSwap, setSelectedSkillForSwap] = useState<SkillItem | null>(null);

  // Student directory search & filter states
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentSkillFilter, setStudentSkillFilter] = useState<'ALL' | 'TECH' | 'LANGUAGE' | 'WEB' | 'MATH'>('ALL');

  const isGuest = currentUser.isGuest || currentUser.id === 'guest_student' || currentUser.id.startsWith('guest');

  const handlePostSkill = () => {
    if (isGuest) {
      openAuthModal('register');
    } else {
      setShowAddModal(true);
    }
  };

  const handleSwapSkill = (skill: SkillItem) => {
    if (isGuest) {
      openAuthModal('login');
    } else {
      setSelectedSkillForSwap(skill);
    }
  };

  const handleSwapWithStudent = (student: User) => {
    if (isGuest) {
      openAuthModal('login');
      return;
    }
    const matchingSkill = skills.find((s) => s.userId === student.id);
    if (matchingSkill) {
      setSelectedSkillForSwap(matchingSkill);
    } else {
      const fallbackSkill: SkillItem = {
        id: `peer_skill_${student.id}_${Date.now()}`,
        userId: student.id,
        userName: student.name,
        userCollege: student.college,
        userCity: student.city,
        userAvatarUrl: student.avatarUrl,
        title: student.skillsOffered[0] ? `${student.skillsOffered[0]} Peer Exchange` : 'Peer Skill Mentorship',
        description: student.bio || `Interactive peer skill swap session with ${student.name}.`,
        category: 'Programming & Tech',
        format: 'ONLINE',
        coinsCost: 20,
        rating: student.rating,
        tags: student.skillsOffered.length > 0 ? student.skillsOffered : ['Skill Swap', 'Peer Mentorship'],
        createdAt: Date.now()
      };
      setSelectedSkillForSwap(fallbackSkill);
    }
  };

  const handleFilterByStudentSkills = (studentName: string) => {
    setSearchQuery(studentName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Filter verified active students
  const activeStudents = users.filter((u) => !u.isGuest && u.id !== 'guest_student');

  const filteredStudents = activeStudents.filter((student) => {
    const query = studentSearchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      student.name.toLowerCase().includes(query) ||
      (student.collegeId && student.collegeId.toLowerCase().includes(query)) ||
      student.skillsOffered.some((sk) => sk.toLowerCase().includes(query)) ||
      student.skillsWanted.some((sk) => sk.toLowerCase().includes(query)) ||
      student.bio.toLowerCase().includes(query);

    let matchesFilter = true;
    if (studentSkillFilter === 'TECH') {
      matchesFilter = student.skillsOffered.some((sk) =>
        ['python', 'java', 'programming', 'c++', 'tech'].some((kw) => sk.toLowerCase().includes(kw))
      );
    } else if (studentSkillFilter === 'LANGUAGE') {
      matchesFilter = student.skillsOffered.some((sk) =>
        ['english', 'spoken english', 'presentation', 'communication', 'soft skills'].some((kw) => sk.toLowerCase().includes(kw))
      );
    } else if (studentSkillFilter === 'WEB') {
      matchesFilter = student.skillsOffered.some((sk) =>
        ['html', 'css', 'web', 'ui', 'design', 'graphic'].some((kw) => sk.toLowerCase().includes(kw))
      );
    } else if (studentSkillFilter === 'MATH') {
      matchesFilter = student.skillsOffered.some((sk) =>
        ['math', 'statistics', 'calculus', 'science'].some((kw) => sk.toLowerCase().includes(kw))
      );
    }

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-24">
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
        </div>
      )}

      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-extrabold text-white">
              Skill Marketplace
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {skills.length} Available Skills
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse skills offered by verified Shailabala students & connect with active peers below
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              const el = document.getElementById('logged-in-students-directory');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            title="Jump to Logged-in Students Directory"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Active Peers ({activeStudents.length})</span>
          </button>

          <button
            onClick={handlePostSkill}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Post a Skill
          </button>
        </div>
      </div>

      {/* Search Bar & Mode Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search skills, topics, tags (e.g. Python, Java, Spoken English, HTML)..."
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
          <p className="text-sm font-bold text-slate-300">No skills found matching filter</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or check the active students directory below.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-4 shadow-lg hover:shadow-indigo-500/5"
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
                        <span>SBWAC</span>
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
                    onClick={() => handleSwapSkill(skill)}
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

      {/* ========================================================================= */}
      {/* LOGGED-IN STUDENTS & ACTIVE PEERS DIRECTORY SECTION (UNDER MARKETPLACE) */}
      {/* ========================================================================= */}
      <div id="logged-in-students-directory" className="pt-8 border-t border-slate-800 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                    Logged-in Students & Active Peers
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {activeStudents.length} Students Online
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Connect with verified Shailabala students currently logged in. Review their offered skills, college IDs, and request instant barter swaps!
                  </p>
                </div>
              </div>
            </div>

            {/* Current user login status indicator */}
            <div className="flex items-center gap-2">
              {isGuest ? (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Log In to Swap with Peers</span>
                </button>
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>You are online as {currentUser.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Search & Quick Category Filters */}
          <div className="space-y-3 mb-6 relative z-10">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search logged-in students by Name, College ID (e.g. SBWAC-2023-CS042), or Skill..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" /> Filter by Skill:
              </span>
              {[
                { id: 'ALL', label: 'All Active Peers' },
                { id: 'TECH', label: 'Java & Python' },
                { id: 'LANGUAGE', label: 'Spoken English & Presentation' },
                { id: 'WEB', label: 'HTML & CSS Design' },
                { id: 'MATH', label: 'Math & Statistics' }
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  onClick={() => setStudentSkillFilter(filterTab.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    studentSkillFilter === filterTab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logged-in Students Grid */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-slate-700/60">
              <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-300">No active students match your search</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a broader keyword or resetting the filter.</p>
              <button
                onClick={() => {
                  setStudentSearchQuery('');
                  setStudentSkillFilter('ALL');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {filteredStudents.map((student) => {
                const isCurrent = student.id === currentUser.id;
                return (
                  <div
                    key={student.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/30'
                        : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card: Avatar, Name, College ID, Online Badge */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/40"
                            />
                            {/* Online Beacon */}
                            <span
                              className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute -bottom-0.5 -right-0.5 flex items-center justify-center"
                              title="Online Now"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-heading font-bold text-sm text-white">
                                {student.name}
                              </h4>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500 text-white">
                                  You
                                </span>
                              )}
                            </div>

                            {/* Verified Shailabala Student & Roll ID */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30 flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                                <span>Verified</span>
                              </span>
                              {student.collegeId && (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.2 rounded border border-indigo-500/30 font-semibold flex items-center gap-0.5">
                                  <CreditCard className="w-2.5 h-2.5 text-indigo-400" />
                                  <span>{student.collegeId}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rating & Availability */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{student.rating || 5.0}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{student.availability || 'Online'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                        {student.bio || `Student at Shailabala Women's Autonomous College, Cuttack.`}
                      </p>

                      {/* Skills Offered (Can Teach) */}
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Can Teach (Offered):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {student.skillsOffered && student.skillsOffered.length > 0 ? (
                            student.skillsOffered.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                              >
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">General Peer Tutoring</span>
                          )}
                        </div>
                      </div>

                      {/* Skills Wanted (Wants to Learn) */}
                      <div className="mt-2.5">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-400" /> Wants to Learn:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {student.skillsWanted && student.skillsWanted.length > 0 ? (
                            student.skillsWanted.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-medium"
                              >
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">Open to Any Skill</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-extrabold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{student.coinBalance || 100} Coins</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFilterByStudentSkills(student.name)}
                          className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          title={`View marketplace listings by ${student.name}`}
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span className="hidden sm:inline">Skills</span>
                        </button>

                        {isCurrent ? (
                          <button
                            onClick={() => setActiveTab(6)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1"
                          >
                            <span>My Profile</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSwapWithStudent(student)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Swap Skill</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Guest Mode Onboarding Banner */}
          {isGuest && (
            <div className="mt-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-white">
                    Want to swap skills with these active Shailabala students?
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Log in with your Shailabala College ID or create your student profile to get +100 bonus Skill Coins!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
                >
                  Log In with College ID
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Create Student Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

