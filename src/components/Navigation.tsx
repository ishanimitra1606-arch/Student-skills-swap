import React from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import {
  Home,
  Store,
  Sparkles,
  ArrowLeftRight,
  MessageSquare,
  User,
  ShieldAlert
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, chats, swaps } = useSkillsSwap();

  const unreadChats = chats.filter(
    (c) => c.receiverId === currentUser.id && !c.isRead
  ).length;

  const pendingSwaps = swaps.filter(
    (s) => s.recipientId === currentUser.id && s.status === 'PENDING'
  ).length;

  const navItems = [
    { id: 0, label: 'Home', icon: Home },
    { id: 1, label: 'Marketplace', icon: Store },
    { id: 2, label: 'Smart Match', icon: Sparkles, badge: 'AI' },
    { id: 3, label: 'Swaps', icon: ArrowLeftRight, badgeCount: pendingSwaps },
    { id: 4, label: 'Chat', icon: MessageSquare, badgeCount: unreadChats },
    { id: 6, label: 'Profile', icon: User }
  ];

  if (currentUser.isAdmin) {
    navItems.push({ id: 7, label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2 px-3">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-3 px-1 py-0.2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-[8px] font-black text-white">
                    {item.badge}
                  </span>
                )}
                {item.badgeCount ? item.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
