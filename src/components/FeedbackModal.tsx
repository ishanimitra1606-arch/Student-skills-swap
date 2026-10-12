import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import {
  FeedbackCategory,
  FeedbackPriority,
  FeedbackStatus,
  StudentFeedback
} from '../types';
import {
  X,
  MessageSquarePlus,
  Lightbulb,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertCircle,
  ShieldCheck,
  Filter,
  Search,
  Sparkles,
  Coins,
  ChevronRight,
  Calendar,
  Layers,
  Send,
  HelpCircle,
  Check,
  Flame,
  User as UserIcon,
  EyeOff,
  Wrench,
  Compass
} from 'lucide-react';

const CATEGORIES: { label: FeedbackCategory; icon: string; desc: string }[] = [
  { label: 'Timetable & Scheduling', icon: '⏰', desc: 'Class practicals, clashes & swap timing' },
  { label: 'Skill Swap Experience', icon: '🤝', desc: 'Barter session flow, matching & rules' },
  { label: 'Platform Feature Request', icon: '✨', desc: 'New tools, study rooms & features' },
  { label: 'Technical & Video Issue', icon: '💻', desc: 'Bugs, camera/mic, lag & mobile data' },
  { label: 'Learning Material & Content', icon: '📚', desc: 'Notes, viva prep & study materials' },
  { label: 'Campus & Safety Concern', icon: '🛡️', desc: 'Student verification, safety & ethics' },
  { label: 'Other Problem', icon: '💡', desc: 'General queries or college ideas' }
];

export const FeedbackModal: React.FC = () => {
  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    feedbacks,
    submitFeedback,
    toggleUpvoteFeedback,
    updateFeedbackStatus,
    currentUser
  } = useSkillsSwap();

  const [activeTab, setActiveTab] = useState<'submit' | 'board'>('board');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('Timetable & Scheduling');
  const [priority, setPriority] = useState<FeedbackPriority>('MEDIUM');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [adminReplyText, setAdminReplyText] = useState<{ [feedbackId: string]: string }>({});

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!title.trim()) {
      setFormErrorMessage('Please write a brief title summarizing the problem.');
      return;
    }
    if (!description.trim()) {
      setFormErrorMessage('Please describe the problem details so we can understand and resolve it.');
      return;
    }

    const res = submitFeedback({
      title,
      description,
      category,
      priority,
      isAnonymous
    });

    if (res.success) {
      setFormSuccessMessage(res.message || 'Problem report submitted! +5 Skill Coins added.');
      setTitle('');
      setDescription('');
      setIsAnonymous(false);
      setTimeout(() => {
        setFormSuccessMessage('');
        setActiveTab('board');
      }, 1600);
    } else {
      setFormErrorMessage(res.message || 'Could not submit. Please try again.');
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filterStatus === 'MINE' && fb.userId !== currentUser.id) return false;
    if (filterStatus !== 'ALL' && filterStatus !== 'MINE' && fb.status !== filterStatus) return false;
    if (selectedCategory !== 'ALL' && fb.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = fb.title.toLowerCase().includes(q);
      const matchDesc = fb.description.toLowerCase().includes(q);
      const matchAuthor = fb.userName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/80 text-slate-300 border border-slate-600 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Submitted
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-amber-400 animate-pulse" />
            Under Review
          </span>
        );
      case 'PLANNED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Planned for Solution
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Solved / Implemented
          </span>
        );
    }
  };

  const getPriorityBadge = (p: FeedbackPriority) => {
    switch (p) {
      case 'URGENT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
            Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700/60">
            Low
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-extrabold text-white">
                  Student Problem & Feedback Box
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" /> +5 Coins Reward
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Share issues, schedule clashes, or feature requests so we can solve them in upcoming updates
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 bg-slate-950 border-b border-slate-800 p-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'board'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Community Problem Tracker ({feedbacks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Submit a Problem / Idea</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: SUBMISSION FORM */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-white mb-0.5">Your Voice Shapes Campus Learning!</p>
                  Describe any obstacle you encounter (e.g. lab timetable conflicts, barter exchange rules, audio lag, or missing courses). Every approved problem gets recorded on the roadmap.
                </div>
              </div>

              {formSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              {formErrorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formErrorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <span>Problem Summary / Title *</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Need evening barter slots due to practical lab classes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Problem Category *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSel = category === cat.label;
                    return (
                      <button
                        type="button"
                        key={cat.label}
                        onClick={() => setCategory(cat.label)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSel
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <div>
                          <p className={`text-xs font-bold ${isSel ? 'text-indigo-300' : 'text-slate-300'}`}>
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-tight">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Urgency Level</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as FeedbackPriority[]).map((p) => {
                    const isSel = priority === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                          isSel
                            ? p === 'URGENT'
                              ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                              : p === 'HIGH'
                              ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                              : 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <span>Detailed Explanation & Suggested Solution *</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what is causing the issue and how solving it will help your college study sessions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Submit Anonymously</p>
                    <p className="text-[10px] text-slate-400">Hide your student name and avatar on the public board</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('board')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Problem (+5 Coins)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: COMMUNITY PROBLEM BOARD & ROADMAP */}
          {activeTab === 'board' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student problems, keywords, or topics..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setActiveTab('submit')}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Report New</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
                {[
                  { id: 'ALL', label: 'All Issues' },
                  { id: 'PLANNED', label: '🔵 Planned for Solution' },
                  { id: 'RESOLVED', label: '🟢 Solved & Resolved' },
                  { id: 'UNDER_REVIEW', label: '🟡 Under Review' },
                  { id: 'SUBMITTED', label: '⚪ New Submissions' },
                  { id: 'MINE', label: '👤 My Problems' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setFilterStatus(st.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      filterStatus === st.id
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Problems List */}
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6">
                  <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">No problem records found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Have you experienced a challenge on campus or during skill barter? Submit it now so our student team can solve it.
                  </p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    Write a Problem Report (+5 Coins)
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredFeedbacks.map((fb) => {
                    const hasUpvoted = fb.upvotedBy?.includes(currentUser.id);
                    return (
                      <div
                        key={fb.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                      >
                        {/* Header: Title & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {getStatusBadge(fb.status)}
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {fb.category}
                              </span>
                              {getPriorityBadge(fb.priority)}
                            </div>
                            <h4 className="font-heading font-extrabold text-sm text-white pt-1">
                              {fb.title}
                            </h4>
                          </div>

                          {/* Upvote Button */}
                          <button
                            type="button"
                            onClick={() => toggleUpvoteFeedback(fb.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start ${
                              hasUpvoted
                                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-500 hover:bg-slate-800'
                            }`}
                            title="I have this problem too! Upvote to prioritize solution."
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : ''}`} />
                            <span>{fb.upvotes}</span>
                            <span className="text-[10px] hidden sm:inline">
                              {hasUpvoted ? 'Upvoted' : 'I face this too'}
                            </span>
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          {fb.description}
                        </p>

                        {/* Admin / Solution Response Box (If present) */}
                        {fb.adminResponse && (
                          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Official Response & Future Solution Plan:
                              </span>
                              {fb.adminResolvedAt && (
                                <span className="text-[10px] text-slate-400">
                                  Updated recently
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed pl-5 font-medium">
                              {fb.adminResponse}
                            </p>
                          </div>
                        )}

                        {/* Author and Date Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <img
                              src={fb.userAvatar}
                              alt={fb.userName}
                              className="w-5 h-5 rounded-full object-cover border border-slate-700"
                            />
                            <span className="font-medium text-slate-300">{fb.userName}</span>
                            {fb.collegeId && (
                              <span className="text-[10px] text-slate-500">• {fb.collegeId}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(fb.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Admin Action Bar (Only visible if currentUser is admin) */}
                        {currentUser.isAdmin && (
                          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 space-y-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                Admin Moderator Resolution Control
                              </span>
                              <div className="flex items-center gap-1">
                                {(['SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'RESOLVED'] as FeedbackStatus[]).map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => updateFeedbackStatus(fb.id, st, fb.adminResponse)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                      fb.status === st
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={adminReplyText[fb.id] || ''}
                                onChange={(e) =>
                                  setAdminReplyText((prev) => ({ ...prev, [fb.id]: e.target.value }))
                                }
                                placeholder="Add official reply / planned release note for this student issue..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (adminReplyText[fb.id]?.trim()) {
                                    updateFeedbackStatus(
                                      fb.id,
                                      fb.status === 'SUBMITTED' ? 'UNDER_REVIEW' : fb.status,
                                      adminReplyText[fb.id].trim()
                                    );
                                    setAdminReplyText((prev) => ({ ...prev, [fb.id]: '' }));
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                              >
                                Save Solution Plan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
