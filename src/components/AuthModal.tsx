import React, { useState, useEffect } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SkillCategory } from '../types';
import { X, LogIn, UserPlus, Coins, GraduationCap, CheckCircle2, Sparkles, Mail, User as UserIcon, MapPin, BookOpen, Lightbulb, Camera, Upload, Link, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import appLogo from '../assets/images/app_logo_1785872616953.jpg';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTab, loginUserByEmail, registerUser, users, switchUser, currentUser } = useSkillsSwap();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  
  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginCollege, setLoginCollege] = useState("Shailabala Women's Autonomous College, Cuttack");
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [college, setCollege] = useState("Shailabala Women's Autonomous College, Cuttack");
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [category, setCategory] = useState<SkillCategory>('TECH');
  const [regAvatarUrl, setRegAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [regError, setRegError] = useState('');

  // Reset form inputs whenever modal opens or tab mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalTab || 'register');
      setName('');
      setEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowRegPassword(false);
      setCollege("Shailabala Women's Autonomous College, Cuttack");
      setCity('Cuttack, Odisha');
      setBio('');
      setSkillOffered('');
      setSkillWanted('');
      setRegAvatarUrl(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
      setLoginInput('');
      setLoginCollege("Shailabala Women's Autonomous College, Cuttack");
      setLoginPassword('');
      setShowLoginPassword(false);
      setLoginError('');
      setRegError('');
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginInput.trim()) {
      setLoginError("Please enter your student email or name.");
      return;
    }
    if (!loginCollege.trim()) {
      setLoginError("Please write your college name.");
      return;
    }

    // Verify college name typed in login form
    const cleanCollege = loginCollege.trim().toLowerCase();
    const isShailabala = cleanCollege.includes('shailabala') || cleanCollege.includes('sbwc') || cleanCollege.includes('sbwac');
    if (!isShailabala) {
      setLoginError(`Access Restricted: Login is allowed ONLY for students who write "Shailabala Women's Autonomous College". "${loginCollege}" is not permitted.`);
      return;
    }

    if (!loginPassword) {
      setLoginError('Please enter your account password.');
      return;
    }
    const result = loginUserByEmail(loginInput, loginPassword, loginCollege);
    if (!result.success) {
      setLoginError(result.message || 'Incorrect credentials. Please try again!');
    } else {
      setLoginInput('');
      setLoginPassword('');
    }
  };

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
            setRegAvatarUrl(compressedDataUrl);
          }
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!name.trim()) return setRegError('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setRegError('Please enter a valid student email.');
    if (!regPassword || regPassword.length < 6) return setRegError('Password must be at least 6 characters long.');
    if (regPassword !== regConfirmPassword) return setRegError('Passwords do not match. Please verify your password.');
    if (!college.trim()) return setRegError('Please enter your college name.');
    
    // Validate that the college written is Shailabala Women's Autonomous College
    const cleanCollege = college.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const isShailabala = cleanCollege.includes('shailabala') || cleanCollege.includes('sbwc') || cleanCollege.includes('sbwac') || cleanEmail.includes('shailabala') || cleanEmail.includes('sbwc') || cleanEmail.includes('sbwac');

    if (!isShailabala) {
      return setRegError(`Access Restricted: Registration is allowed ONLY for students who write "Shailabala Women's Autonomous College". "${college}" is not permitted.`);
    }

    if (!skillOffered.trim()) return setRegError('Please specify at least one skill you can teach.');
    if (!skillWanted.trim()) return setRegError('Please specify at least one skill you want to learn.');

    try {
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password: regPassword,
        college: college.trim(),
        city: city.trim() || 'Campus',
        bio: bio.trim(),
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim(),
        category,
        avatarUrl: regAvatarUrl
      });
      // Clear inputs upon successful registration
      setName('');
      setEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setCollege('');
      setCity('');
      setBio('');
      setSkillOffered('');
      setSkillWanted('');
      setRegError('');
    } catch (err: any) {
      setRegError(err.message || 'An account with this email address already exists!');
    }
  };

  const categories: SkillCategory[] = [
    'TECH', 'DESIGN', 'ACADEMICS', 'LANGUAGES', 
    'MUSIC', 'BUSINESS', 'FITNESS', 'CREATIVE'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Student Account Access
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-2 bg-slate-950 border-b border-slate-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setLoginError(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setRegError(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {mode === 'login' ? (
            <div className="space-y-6">
              <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">🏛️ Shailabala Women's Autonomous College, Cuttack</span>
                  Login is strictly restricted to verified students of SBWAC. Non-Shailabala college accounts will be restricted.
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    Student Email or Name
                  </label>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. priyanka.sbwc@shailabalawomenscollege.ac.in or Priyanka Jena"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      College / Institution Name *
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Only SBWAC Allowed</span>
                  </label>
                  <input
                    type="text"
                    value={loginCollege}
                    onChange={(e) => setLoginCollege(e.target.value)}
                    placeholder="e.g. Shailabala Women's Autonomous College, Cuttack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    🔒 Must write <strong className="text-indigo-300">Shailabala Women's Autonomous College</strong>. Entries from other colleges will be blocked.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      Account Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Password: <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded font-mono">password123</code></span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginInput('priyanka.sbwc@shailabalawomenscollege.ac.in');
                      setLoginCollege("Shailabala Women's Autonomous College, Cuttack");
                      setLoginPassword('password123');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors"
                  >
                    Quick fill Priyanka
                  </button>
                </div>

                {loginError && (
                  <div className="text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to My Account
                </button>
              </form>

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-2">Don't have a student account yet?</p>
                <button
                  onClick={() => { setMode('register'); setRegError(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Create a New Student Account (+100 Coins)
                </button>
              </div>
            </div>
          ) : (
            /* Sign Up Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
                <Coins className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-300">Welcome Bonus Included! 🎁</div>
                  <div className="text-[11px] text-amber-200/80">
                    Get 100 Skill Coins instantly upon registration to start peer skill trading!
                  </div>
                </div>
              </div>

              {regError && (
                <div className="text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  {regError}
                </div>
              )}

              {/* Profile Photo Selection Section */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    Profile Photo
                  </span>
                  <span className="text-[10px] text-slate-400">Upload or Pick Avatar</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={regAvatarUrl}
                      alt="Profile Avatar"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
                    />
                    <img
                      src={appLogo}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-full border border-slate-900 absolute -bottom-1 -right-1"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-colors w-fit">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Avatars preset row */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRegAvatarUrl(url)}
                          className={`relative rounded-lg overflow-hidden w-7 h-7 shrink-0 border transition-all ${
                            regAvatarUrl === url ? 'border-indigo-400 ring-2 ring-indigo-500/40 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Riya Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    Student Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@shailabalawomenscollege.ac.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                      College / Institution Name *
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Only SBWAC Allowed</span>
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Shailabala Women's Autonomous College, Cuttack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    ⚠️ Must write <strong className="text-indigo-300">Shailabala Women's Autonomous College</strong>. Students from other colleges will be blocked.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Cuttack, Odisha"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                  Primary Skill You Can Teach *
                </label>
                <input
                  type="text"
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                  placeholder="e.g. Python Programming, Graphic Design, Piano Basics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Skill Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    Skill You Want to Learn *
                  </label>
                  <input
                    type="text"
                    value={skillWanted}
                    onChange={(e) => setSkillWanted(e.target.value)}
                    placeholder="e.g. Public Speaking, Spanish"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Bio / Academic Background
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe your background, interests, and preferred schedule..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Register Account & Claim 100 Coins
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
