import React, { useState, useRef, useEffect } from 'react';
import { useAstrologyChat } from '../hooks/useAstrologyChat';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ProfileModal } from './ProfileModal';
import { ChatSidebar } from './ChatSidebar';
import { AuthModal } from '../../auth/components/AuthModal';
import {
  Sparkles,
  Settings,
  Sun,
  Moon,
  PanelLeft,
  LogIn,
  LogOut,
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  'What is my Sidereal Sun and Moon sign?',
  'Analyze my career dharma based on my Nakshatra',
  'What celestial transits are influencing my love life?',
  'Explain the difference between my Tropical and Sidereal charts',
];

export const ChatContainer: React.FC = () => {
  const {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    profile,
    setProfile,
    sendMessage,
    selectSession,
    startNewChat,
    clearChat,
  } = useAstrologyChat();

  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Allow sidebar to be flipped between Left and Right
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>(() => {
    const saved = localStorage.getItem('sidereal_sidebar_side');
    return saved === 'right' ? 'right' : 'left';
  });

  const toggleSidebarSide = () => {
    const next = sidebarSide === 'left' ? 'right' : 'left';
    setSidebarSide(next);
    localStorage.setItem('sidereal_sidebar_side', next);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      className={`flex h-screen w-full overflow-hidden ${
        sidebarSide === 'right' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* History Sidebar (Flippable left/right & collapsible) */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={selectSession}
        onNewChat={startNewChat}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        sidebarSide={sidebarSide}
        onFlipSide={toggleSidebarSide}
      />

      {/* Main Chat Work Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <header
          className={`flex items-center justify-between py-3 px-4 border-b transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title={isSidebarOpen ? 'Hide History Sidebar' : 'Show History Sidebar'}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-cinzel tracking-wide truncate">
                  Sidereal Astrologer
                </h1>
              </div>
              <div
                className={`text-[11px] flex items-center gap-2 truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <span className="truncate">Nirayana (Lahiri Ayanamsa)</span>
                <span className="font-medium truncate text-indigo-500">
                  {isAuthenticated && user ? user.name : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* User Auth: Login / Logout */}
            {isAuthenticated && user ? (
              <button
                onClick={logout}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-rose-950/40 border-slate-700 text-slate-300 hover:text-rose-300'
                    : 'bg-slate-100 hover:bg-rose-50 border-slate-200 text-slate-700 hover:text-rose-600'
                }`}
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Birth Chart Settings Modal Trigger */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Edit Birth Chart Coordinates"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Chart</span>
            </button>

            {/* Reset Chat Button */}
            <button
              onClick={clearChat}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
              title="Reset Chat"
            >
           {/* <RotateCcw className="w-3.5 h-3.5" /> */}
            </button>
          </div>
        </header>

        {/* Chat Messages Timeline */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-2 scrollbar-thin max-w-4xl w-full mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Real-time Typing Indicator (US-102) */}
          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </main>

        {/* Bottom Area */}
        <footer
          className={`p-3 sm:p-4 border-t transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Quick Prompts Bar (when few messages) */}
            {messages.length <= 3 && !isLoading && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <span
                  className={`text-xs flex items-center gap-1 shrink-0 font-medium ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Suggestions:
                </span>
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className={`px-2.5 py-1 text-xs rounded-lg shrink-0 transition border ${
                      isDark
                        ? 'text-slate-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
                        : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar (US-101) */}
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </footer>
      </div>

      {/* User Profile Coordinates Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      {/* User Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};
