import React from 'react';
import { SkillsSwapProvider, useSkillsSwap } from './context/SkillsSwapContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { VideoClassroomModal } from './components/VideoClassroomModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HomeScreen } from './pages/HomeScreen';
import { MarketplaceScreen } from './pages/MarketplaceScreen';
import { SmartMatchScreen } from './pages/SmartMatchScreen';
import { SwapsScreen } from './pages/SwapsScreen';
import { ChatScreen } from './pages/ChatScreen';
import { NotificationsScreen } from './pages/NotificationsScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { AdminScreen } from './pages/AdminScreen';

const MainContent: React.FC = () => {
  const { activeTab } = useSkillsSwap();

  return (
    <main className="max-w-6xl mx-auto px-4 pt-6">
      {activeTab === 0 && <HomeScreen />}
      {activeTab === 1 && <MarketplaceScreen />}
      {activeTab === 2 && <SmartMatchScreen />}
      {activeTab === 3 && <SwapsScreen />}
      {activeTab === 4 && <ChatScreen />}
      {activeTab === 5 && <NotificationsScreen />}
      {activeTab === 6 && <ProfileScreen />}
      {activeTab === 7 && <AdminScreen />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <SkillsSwapProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        <MainContent />
        <Navigation />
        <AuthModal />
        <VideoClassroomModal />
        <FeedbackModal />
      </div>
    </SkillsSwapProvider>
  );
};

export default App;
