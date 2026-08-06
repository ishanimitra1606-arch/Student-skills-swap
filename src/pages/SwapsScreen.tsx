import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { SwapRequest, SwapStatus } from '../types';
import {
  ArrowLeftRight,
  Check,
  X,
  MessageSquare,
  Star,
  Coins,
  Clock,
  CheckCircle2,
  Video
} from 'lucide-react';

export const SwapsScreen: React.FC = () => {
  const {
    swaps,
    currentUser,
    acceptSwapRequest,
    rejectSwapRequest,
    completeSwap,
    setActiveTab,
    openVideoClassroom
  } = useSkillsSwap();

  const [activeFilter, setActiveFilter] = useState<SwapStatus | 'ALL'>('ALL');
  const [reviewingSwap, setReviewingSwap] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const mySwaps = swaps.filter(
    (s) => s.requesterId === currentUser.id || s.recipientId === currentUser.id
  );

  const filteredSwaps = mySwaps.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.status === activeFilter;
  });

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSwap) return;
    completeSwap(reviewingSwap.id, rating, comment);
    setReviewingSwap(null);
    setComment('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-white">
            My Skill Swaps
          </h2>
          <p className="text-xs text-slate-400">
            Track your pending requests, active learning sessions, and history
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 p-1 rounded-xl overflow-x-auto">
          {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'All Swaps'
                : st === 'PENDING'
                ? 'Pending'
                : st === 'ACCEPTED'
                ? 'Active'
                : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* List of Swaps */}
      {filteredSwaps.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/60">
          <ArrowLeftRight className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-300">No swaps found</p>
          <p className="text-xs text-slate-400 mt-1">
            Browse the marketplace or use AI Smart Match to request a skill exchange!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const isRequester = swap.requesterId === currentUser.id;
            const partnerName = isRequester ? swap.recipientName : swap.requesterName;
            const partnerAvatar = isRequester ? swap.recipientAvatar : swap.requesterAvatar;

            return (
              <div
                key={swap.id}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">
                        {partnerName}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isRequester ? 'You sent request' : 'Received request from partner'}
                      </p>
                    </div>
                  </div>

                  {/* Offered vs Requested */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-indigo-400 font-semibold">Offering to teach:</span>
                      <span className="text-slate-200 font-bold">{swap.skillOffered}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-violet-400 font-semibold">Want to learn:</span>
                      <span className="text-slate-200 font-bold">{swap.skillRequested}</span>
                    </div>
                    {swap.message && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                        "{swap.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex flex-col items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      swap.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : swap.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : swap.status === 'COMPLETED'
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {swap.status === 'ACCEPTED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {swap.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                    {swap.status}
                  </span>

                  {/* Actions depending on status */}
                  <div className="flex items-center gap-2">
                    {!isRequester && swap.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => acceptSwapRequest(swap.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => rejectSwapRequest(swap.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs flex items-center gap-1 border border-rose-500/30"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}

                    {swap.status === 'ACCEPTED' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() =>
                            openVideoClassroom({
                              swapId: swap.id,
                              peerName: partnerName,
                              peerAvatar: partnerAvatar,
                              topic: `${swap.skillOffered} / ${swap.skillRequested}`
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <Video className="w-4 h-4" /> Join Video Class
                        </button>

                        <button
                          onClick={() => setActiveTab(4)}
                          className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4 text-indigo-400" /> Chat
                        </button>

                        <button
                          onClick={() => setReviewingSwap(swap)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-600/20"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Finish Session
                        </button>
                      </div>
                    )}

                    {swap.status === 'COMPLETED' && (
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" /> 20 Coins Transferred
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Finish Session Modal */}
      {reviewingSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setReviewingSwap(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-heading font-bold text-white mb-1">
              Complete Session & Rate Partner
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Rate your learning session for {reviewingSwap.skillRequested}. Completing this transfers 20 Skill Coins in escrow.
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Session Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl border transition-colors ${
                        rating >= star
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public Review Comment
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share how patient and helpful the teacher was during session..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingSwap(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Submit & Complete (+20 Coins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
