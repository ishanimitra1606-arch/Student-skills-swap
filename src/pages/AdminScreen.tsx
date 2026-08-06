import React from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import {
  ShieldAlert,
  Users,
  Store,
  ArrowLeftRight,
  Coins,
  CheckCircle,
  Ban
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const {
    users,
    skills,
    swaps,
    reports,
    banUser,
    unbanUser
  } = useSkillsSwap();

  const totalStudents = users.filter((u) => !u.isAdmin).length;
  const totalListings = skills.length;
  const completedSwaps = swaps.filter((s) => s.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            System Admin Safety Console
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Monitor platform integrity, enforce peer safety guidelines, and handle community reports.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Users</span>
          </div>
          <p className="text-2xl font-heading font-extrabold text-white">{totalStudents}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Skills Posted</span>
          </div>
          <p className="text-2xl font-heading font-extrabold text-white">{totalListings}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-violet-400 mb-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Swaps Done</span>
          </div>
          <p className="text-2xl font-heading font-extrabold text-white">{completedSwaps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <Coins className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Coins Economy</span>
          </div>
          <p className="text-2xl font-heading font-extrabold text-white">
            {users.reduce((acc, u) => acc + u.coinBalance, 0)}
          </p>
        </div>
      </div>

      {/* User Moderation Management */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Student Account Moderation
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">College & City</th>
                <th className="py-2.5 px-3">Skill Coins</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {users.filter((u) => !u.isAdmin).map((student) => (
                <tr key={student.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-bold flex items-center gap-2">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    {student.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{student.college}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{student.coinBalance}</td>
                  <td className="py-3 px-3 font-semibold">{student.rating} ★</td>
                  <td className="py-3 px-3">
                    {student.isBlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Banned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {student.isBlocked ? (
                      <button
                        onClick={() => unbanUser(student.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => banUser(student.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-[11px] font-bold border border-rose-500/30 flex items-center gap-1 ml-auto"
                      >
                        <Ban className="w-3 h-3" /> Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
        <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Community Safety Tickets & Reports
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No active safety reports. Platform integrity clean!
          </p>
        ) : (
          <div className="space-y-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">
                    Reporter: {rep.reporterName} → Reported: {rep.reportedUserName}
                  </p>
                  <p className="text-slate-400 mt-0.5">Reason: {rep.reason}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {rep.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
