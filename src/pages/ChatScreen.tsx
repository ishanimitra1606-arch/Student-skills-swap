import React, { useState } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import { Send, Image, Video, CheckCheck, MessageSquare } from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const { chats, currentUser, swaps, sendMessage, openVideoClassroom } = useSkillsSwap();

  // Find active swaps for current user
  const activeSwaps = swaps.filter(
    (s) =>
      (s.requesterId === currentUser.id || s.recipientId === currentUser.id) &&
      s.status === 'ACCEPTED'
  );

  const [selectedSwapId, setSelectedSwapId] = useState<string>(
    activeSwaps[0]?.id || swaps[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  const currentSwap = swaps.find((s) => s.id === selectedSwapId);
  const partnerId = currentSwap
    ? currentSwap.requesterId === currentUser.id
      ? currentSwap.recipientId
      : currentSwap.requesterId
    : '';
  const partnerName = currentSwap
    ? currentSwap.requesterId === currentUser.id
      ? currentSwap.recipientName
      : currentSwap.requesterName
    : '';
  const partnerAvatar = currentSwap
    ? currentSwap.requesterId === currentUser.id
      ? currentSwap.recipientAvatar
      : currentSwap.requesterAvatar
    : '';

  const currentMessages = chats.filter((c) => c.swapId === selectedSwapId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSwapId || !partnerId) return;
    sendMessage(selectedSwapId, partnerId, inputText);
    setInputText('');
  };

  const handleInsertMeetingLink = () => {
    setInputText(
      (prev) =>
        prev +
        ` Here is our Zoom study room link: https://meet.jit.si/StudentSkillSwap-${selectedSwapId}`
    );
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-4 pb-20">
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="font-heading font-bold text-sm text-white">
            Swap Conversations
          </h3>
        </div>

        {activeSwaps.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No active swaps yet. Accept a swap to start chatting!
          </p>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-60 md:max-h-full">
            {activeSwaps.map((sw) => {
              const pName =
                sw.requesterId === currentUser.id ? sw.recipientName : sw.requesterName;
              const pAvatar =
                sw.requesterId === currentUser.id ? sw.recipientAvatar : sw.requesterAvatar;
              const isSelected = sw.id === selectedSwapId;

              return (
                <div
                  key={sw.id}
                  onClick={() => setSelectedSwapId(sw.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-900'
                  }`}
                >
                  <img
                    src={pAvatar}
                    alt={pName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{pName}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {sw.skillRequested}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col justify-between overflow-hidden">
        {/* Chat Top Bar */}
        {partnerName ? (
          <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <h4 className="font-heading font-bold text-sm text-white">{partnerName}</h4>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Swap Partner
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  openVideoClassroom({
                    swapId: currentSwap?.id,
                    peerName: partnerName,
                    peerAvatar: partnerAvatar,
                    topic: currentSwap ? `${currentSwap.skillOffered} / ${currentSwap.skillRequested}` : 'Skill Swap Class'
                  })
                }
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-4 h-4" /> Start Live Video Class
              </button>

              <button
                onClick={handleInsertMeetingLink}
                className="px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                Share Link
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900/90 border-b border-slate-700 text-xs text-slate-400 font-bold">
            Select a conversation to start messaging
          </div>
        )}

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
          {currentMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Say hello! Arrange session dates, syllabus topics, and study links.
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="mt-2 rounded-lg max-h-40 object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-700 flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700"
            title="Attach Image"
          >
            <Image className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Write a message to your swap partner..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
