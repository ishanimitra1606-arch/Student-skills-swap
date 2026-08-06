import React from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { Bell, Coins, CheckCircle2, ArrowRightLeft, MessageSquare, CheckCheck } from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { notifications, currentUser, markNotificationsRead, setActiveTab } = useSkillsSwap();

  const myNotifs = notifications.filter((n) => n.userId === currentUser.id);

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            Notifications
          </h2>
          <p className="text-xs text-slate-400">
            Updates on swap requests, coin rewards, and messages
          </p>
        </div>

        <button
          onClick={markNotificationsRead}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-indigo-400" /> Mark All Read
        </button>
      </div>

      {myNotifs.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/60">
          <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-300">No notifications yet</p>
          <p className="text-xs text-slate-400 mt-1">
            When students send swap requests or rate your sessions, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.type === 'SWAP_REQUEST' || n.type === 'SWAP_ACCEPTED') {
                  setActiveTab(3);
                } else if (n.type === 'MESSAGE') {
                  setActiveTab(4);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.isRead
                  ? 'bg-slate-800/60 border-slate-700/60'
                  : 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-400 mt-0.5">
                {n.type === 'COIN_REWARD' && <Coins className="w-5 h-5 text-amber-400" />}
                {n.type === 'SWAP_REQUEST' && <ArrowRightLeft className="w-5 h-5 text-indigo-400" />}
                {n.type === 'SWAP_ACCEPTED' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {n.type === 'MESSAGE' && <MessageSquare className="w-5 h-5 text-violet-400" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-heading font-bold text-sm text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
