import React, { useState, useEffect, useRef } from 'react';
import { useSkillsSwap } from '../context/SkillsSwapContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Hand,
  PenTool,
  Code,
  MessageSquare,
  Coins,
  CheckCircle2,
  Sparkles,
  Users,
  Eraser,
  X,
  Send,
  Star,
  Award
} from 'lucide-react';

export const VideoClassroomModal: React.FC = () => {
  const { activeVideoSession, closeVideoClassroom, currentUser, completeSwap, swaps } = useSkillsSwap();

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard' | 'notes' | 'chat'>('video');
  const [classDuration, setClassDuration] = useState(0); // in seconds
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Local media stream ref
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Whiteboard refs & state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#6366f1');
  const [drawWidth, setDrawWidth] = useState(3);
  const [drawTool, setDrawTool] = useState<'pen' | 'eraser'>('pen');

  // Shared lesson notes state
  const [notesText, setNotesText] = useState(
    `// Live Classroom Lesson Notes & Code Snippets\n// Topic: ${activeVideoSession?.topic || 'Interactive Skill Exchange'}\n// Date: ${new Date().toLocaleDateString()}\n\nfunction main() {\n  console.log("Welcome to live peer skill swap class!");\n}`
  );

  // In-call chat messages state
  const [chatInput, setChatInput] = useState('');
  const [classChats, setClassChats] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean }>>([
    {
      sender: activeVideoSession?.peerName || 'Peer Student',
      text: `Hello ${currentUser?.name || 'Student'}! Excited for our session on ${activeVideoSession?.topic || 'Skill Swap'}.`,
      time: 'Just now',
      isMe: false
    }
  ]);

  // Reset/sync session data when activeVideoSession changes
  useEffect(() => {
    if (activeVideoSession?.isOpen) {
      setClassDuration(0);
      setNotesText(
        `// Live Classroom Lesson Notes & Code Snippets\n// Topic: ${activeVideoSession.topic}\n// Date: ${new Date().toLocaleDateString()}\n\nfunction main() {\n  console.log("Welcome to live peer skill swap class!");\n}`
      );
      setClassChats([
        {
          sender: activeVideoSession.peerName,
          text: `Hello ${currentUser.name}! Excited for our session on ${activeVideoSession.topic}.`,
          time: 'Just now',
          isMe: false
        }
      ]);
    }
  }, [activeVideoSession?.isOpen, activeVideoSession?.topic, activeVideoSession?.peerName, currentUser.name]);

  // Timer interval effect
  useEffect(() => {
    if (!activeVideoSession?.isOpen) return;
    const timer = setInterval(() => {
      setClassDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeVideoSession?.isOpen]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Webcam camera stream effect
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      if (isCameraOn && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (active) {
            mediaStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        } catch (err) {
          console.warn('Webcam or mic permission denied / unavailable, using avatar simulation:', err);
        }
      } else {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }
    }

    setupCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Whiteboard Drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = drawTool === 'eraser' ? '#0f172a' : drawColor;
    ctx.lineWidth = drawTool === 'eraser' ? 20 : drawWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setClassChats((prev) => [
      ...prev,
      {
        sender: currentUser.name,
        text: chatInput.trim(),
        time: 'Just now',
        isMe: true
      }
    ]);
    setChatInput('');
  };

  const handleFinishClass = () => {
    if (activeVideoSession?.swapId) {
      completeSwap(activeVideoSession.swapId, rating, feedback || 'Great video classroom session!');
    }
    setShowCompletionModal(false);
    closeVideoClassroom();
  };

  if (!activeVideoSession || !activeVideoSession.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full h-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Video Call Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Class Active
            </div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
              {activeVideoSession.topic}
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {formatTime(classDuration)}
            </div>

            <button
              onClick={closeVideoClassroom}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              Video Classroom
            </button>

            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'whiteboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4 text-emerald-400" />
              Live Whiteboard
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4 text-amber-400" />
              Lesson Code & Notes
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Class Chat
            </button>
          </div>

          <button
            onClick={() => setShowCompletionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Coins className="w-4 h-4" />
            Finish & Transfer 20 Coins
          </button>
        </div>

        {/* Main Classroom Content Area */}
        <div className="flex-1 overflow-hidden relative p-4 bg-slate-950 flex flex-col md:flex-row gap-4">
          
          {/* TAB 1: VIDEO CLASSROOM GRID */}
          {activeTab === 'video' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              
              {/* Partner Peer Video Window */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 group shadow-xl">
                <img
                  src={activeVideoSession.peerAvatar}
                  alt={activeVideoSession.peerName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-2xl animate-pulse"
                />
                <div className="mt-4 text-center">
                  <h4 className="font-heading font-extrabold text-white text-base flex items-center justify-center gap-2">
                    {activeVideoSession.peerName}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h4>
                  <p className="text-xs text-indigo-300 font-medium mt-1">
                    Teaching & Guiding • Active Audio Stream
                  </p>
                </div>

                {/* Animated Audio Equalizer Waveforms */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-emerald-400 h-2 animate-bounce" />
                    <span className="w-1 bg-emerald-400 h-3 animate-bounce delay-100" />
                    <span className="w-1 bg-emerald-400 h-1.5 animate-bounce delay-200" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono ml-1">Speaking</span>
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-xs font-bold">
                  Peer Instructor
                </div>
              </div>

              {/* Your Local Student Video Window */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xl">
                {isCameraOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-slate-700"
                    />
                    <p className="text-xs text-slate-400 mt-3 font-semibold">Camera Paused</p>
                  </div>
                )}

                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-bold">
                  {currentUser.name} (You)
                </div>

                {handRaised && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
                    <Hand className="w-4 h-4" />
                    Hand Raised!
                  </div>
                )}

                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  {isMicOn ? (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className="text-[10px] text-slate-300 font-mono">
                    {isMicOn ? 'Mic On' : 'Muted'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE COLLABORATIVE WHITEBOARD */}
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Tool:</span>
                  <button
                    onClick={() => setDrawTool('pen')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      drawTool === 'pen' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" /> Pen
                  </button>
                  <button
                    onClick={() => setDrawTool('eraser')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      drawTool === 'eraser' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" /> Eraser
                  </button>

                  <div className="flex items-center gap-1.5 ml-4">
                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => { setDrawColor(color); setDrawTool('pen'); }}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full ring-2 transition-all ${
                          drawColor === color && drawTool === 'pen' ? 'ring-white scale-110' : 'ring-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-xs font-bold border border-rose-500/30"
                >
                  Clear Board
                </button>
              </div>

              <div className="flex-1 relative mt-3 bg-slate-950 rounded-xl overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={500}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full block"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LESSON CODE & NOTES NOTEPAD */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Collaborative Class Scratchpad</span>
                </div>
                <span className="text-[11px] text-slate-400">Auto-saved in real-time</span>
              </div>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="flex-1 mt-3 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>
          )}

          {/* TAB 4: IN-CALL CLASS CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" /> Live Classroom Chat
                </span>
                <span className="text-[10px] text-slate-400">{classChats.length} messages</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
                {classChats.map((c, idx) => (
                  <div key={idx} className={`flex flex-col ${c.isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-400 mb-0.5">{c.sender} • {c.time}</div>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                        c.isMe ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question or share link..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Bottom Call Control Action Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-6">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
              isMicOn
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{isMicOn ? 'Mute Mic' : 'Unmute Mic'}</span>
          </button>

          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
              isCameraOn
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
            }`}
          >
            {isCameraOn ? <Video className="w-5 h-5 text-indigo-400" /> : <VideoOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{isCameraOn ? 'Stop Camera' : 'Start Camera'}</span>
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
              isScreenSharing
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Monitor className="w-5 h-5 text-sky-400" />
            <span className="hidden sm:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
          </button>

          <button
            onClick={() => setHandRaised(!handRaised)}
            className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
              handRaised
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Hand className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">Raise Hand</span>
          </button>

          <button
            onClick={closeVideoClassroom}
            className="p-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all ml-4"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Leave Class</span>
          </button>
        </div>

      </div>

      {/* Completion & Rating Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-extrabold text-xl text-white">
              Complete Class & Transfer Skill Coins!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You participated in {formatTime(classDuration)} of interactive peer learning. Rate your partner:
            </p>

            {/* Star Rating Selection */}
            <div className="flex items-center justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave a short review or thanks for your peer tutor..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 mb-4"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Back to Class
              </button>
              <button
                onClick={handleFinishClass}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Transfer 20 Coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
