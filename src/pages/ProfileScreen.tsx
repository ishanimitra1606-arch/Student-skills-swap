import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import {
  User,
  GraduationCap,
  MapPin,
  Star,
  Coins,
  History,
  ShieldAlert,
  Plus,
  Tag,
  Users,
  UserCheck,
  LogOut,
  Camera,
  Upload,
  Link,
  X,
  Check,
  CreditCard,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AddSkillModal } from '../components/AddSkillModal';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
];

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    transactions,
    setActiveTab,
    setIsAuthModalOpen,
    openAuthModal,
    logoutUser,
    updateUserAvatar
  } = useSkillsSwap();

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState(currentUser.avatarUrl);

  const isGuest = currentUser.isGuest || currentUser.id === 'guest_student' || currentUser.id.startsWith('guest');

  const myTransactions = transactions.filter((t) => t.userId === currentUser.id);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setPreviewAvatar(compressedDataUrl);
          }
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    updateUserAvatar(previewAvatar);
    setShowAvatarModal(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Logged In Account Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
            />
            <img
              src={appLogo}
              alt="Logo"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full border border-slate-900 absolute -bottom-0.5 -right-0.5"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {currentUser.name}
              {isGuest ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Guest Mode
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified Student
                </span>
              )}
              {currentUser.collegeId && !isGuest && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-md border border-indigo-500/30 font-semibold flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-indigo-400" />
                  ID: {currentUser.collegeId}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              {isGuest
                ? 'Create a profile to get your Shailabala student card & +100 Coins'
                : `${currentUser.email} • ${currentUser.college}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openAuthModal(isGuest ? 'register' : 'login')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isGuest ? 'Create Student Profile' : 'Switch Student Account'}</span>
          </button>
          {!isGuest && (
            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
              title="Log out to Guest Mode"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Interactive Avatar with Camera Upload Button */}
            <div className="relative group cursor-pointer" onClick={() => { setPreviewAvatar(currentUser.avatarUrl); setShowAvatarModal(true); }}>
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 rounded-2xl bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <Camera className="w-5 h-5" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 text-white shadow-md border border-slate-800 hover:bg-indigo-500 transition-colors"
                title="Change Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-heading font-extrabold text-white">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <img src={appLogo} alt="" className="w-3 h-3 rounded-full" />
                  SkillsSwap Member
                </span>
                {currentUser.collegeId && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-400" />
                    ID: {currentUser.collegeId}
                  </span>
                )}
                {currentUser.isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> System Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {currentUser.college}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {currentUser.city}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {currentUser.rating} ({currentUser.reviewCount} reviews)
                </span>
                <span className="text-[11px] text-slate-400">• Availability: {currentUser.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => { setPreviewAvatar(currentUser.avatarUrl); setShowAvatarModal(true); }}
              className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Photo</span>
            </button>

            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center">
              <span className="text-[10px] uppercase font-extrabold block text-amber-500">
                Wallet Balance
              </span>
              <span className="text-lg font-heading font-black flex items-center justify-center gap-1 mt-0.5">
                <Coins className="w-5 h-5" /> {currentUser.coinBalance}
              </span>
            </div>

            {currentUser.isAdmin && (
              <button
                onClick={() => setActiveTab(7)}
                className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Console
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-700/60">
          "{currentUser.bio}"
        </p>
      </div>

      {/* Skills Offered & Wanted Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offered */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              Skills You Teach / Offer
            </h3>
            <button
              onClick={() => setShowAddSkill(true)}
              className="p-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser.skillsOffered.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Wanted */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
            Skills You Want to Learn
          </h3>

          <div className="flex flex-wrap gap-2">
            {currentUser.skillsWanted.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-violet-400" />
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Coin Transaction Ledger */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <h3 className="font-heading font-bold text-sm text-white">
            Skill Coin Wallet Ledger
          </h3>
        </div>

        {myTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No transaction records yet.</p>
        ) : (
          <div className="space-y-2">
            {myTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-200">{tx.reason}</p>
                  {tx.counterpartyName && (
                    <p className="text-[10px] text-slate-400">Partner: {tx.counterpartyName}</p>
                  )}
                </div>

                <span
                  className={`font-heading font-extrabold text-xs ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Management & Security Zone */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Account & Session Management</h3>
              <p className="text-xs text-slate-400">
                {isGuest ? 'Currently browsing in Guest Student Mode' : `Signed in as ${currentUser.name} (${currentUser.collegeId || 'Student Member'})`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {isGuest ? (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Log In with Shailabala College ID</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Student Profile (+100 Coins)</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Switch / Register Student ID</span>
              </button>
              <button
                onClick={logoutUser}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                title="Log out to Guest Student Mode"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Student Account</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showAddSkill && <AddSkillModal onClose={() => setShowAddSkill(false)} />}

      {/* Profile Picture Change Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Update Profile Photo
                </h3>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current / Preview Image display */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative">
                <img
                  src={previewAvatar || currentUser.avatarUrl}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/50 shadow-xl"
                />
                <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Photo Preview</p>
            </div>

            {/* Option 1: File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                Upload Photo from Device
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl bg-slate-950 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Choose Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-indigo-400" />
                Or Paste Image Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    if (e.target.value.trim().startsWith('http')) {
                      setPreviewAvatar(e.target.value.trim());
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Option 3: Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Or Select a Preset Student Avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewAvatar(url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      previewAvatar === url
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-105'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Save Profile Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
