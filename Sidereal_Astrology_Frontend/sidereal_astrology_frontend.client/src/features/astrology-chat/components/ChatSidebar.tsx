import React from 'react';
import { ChatSession, UserProfile } from '../types/chat.types';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Plus,
  MessageSquare,
  Clock,
  X,
  User,
  LogIn,
  LogOut,
  ArrowLeftRight,
} from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  sidebarSide: 'left' | 'right';
  onFlipSide: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  profile,
  onOpenProfile,
  onOpenAuth,
  sidebarSide,
  onFlipSide,
}) => {
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 z-50 w-72 flex flex-col transition-all duration-300 ${
          sidebarSide === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        } ${
          isOpen
            ? 'translate-x-0'
            : sidebarSide === 'left'
            ? '-translate-x-full md:hidden'
            : 'translate-x-full md:hidden'
        } ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Top Header / New Chat & Flip Buttons */}
        <div
          className={`p-3.5 border-b flex items-center justify-between gap-2 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Reading</span>
          </button>

        

          {/* Close Button on Mobile */}
          <button
            onClick={onClose}
            className={`p-2 rounded-xl md:hidden transition ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Title & Flip button */}
        <div className="px-4 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Conversations</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded font-mono bg-slate-800/40 text-slate-400">
              {sessions.length}
            </span>
          </div>
          <button
            onClick={onFlipSide}
            className={`p-1 rounded-lg text-slate-400 transition ${
              isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={`Move Sidebar to ${sidebarSide === 'left' ? 'Right' : 'Left'}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1.5 scrollbar-thin">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p>No past conversations yet.</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Ask a question to start your astrological reading session.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isSelected = currentSessionId === session.sessionId;
              const formattedDate = new Date(session.lastUpdatedAt || session.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = new Date(session.lastUpdatedAt || session.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={session.sessionId}
                  onClick={() => {
                    onSelectSession(session);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex flex-col gap-1 border ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-800 text-indigo-300 border-indigo-700 font-medium'
                        : 'bg-indigo-50 text-indigo-900 border-indigo-300 font-medium'
                      : isDark
                      ? 'bg-transparent hover:bg-slate-800/60 text-slate-300 border-transparent'
                      : 'bg-transparent hover:bg-slate-100 text-slate-700 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isSelected ? 'text-indigo-500' : 'text-slate-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="truncate block font-medium leading-snug">{session.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-5 pt-0.5">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {formattedDate} • {formattedTime}
                      </span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        isDark ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {session.messageCount} {session.messageCount === 1 ? 'msg' : 'msgs'}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* User Auth & Profile Footer */}
        <div
          className={`p-3 border-t text-xs flex flex-col gap-2 ${
            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {isAuthenticated && user ? (
            /* Logged in state */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate flex-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenProfile}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Edit Birth Chart Coordinates"
                >
                  Chart
                </button>
                <button
                  onClick={logout}
                  className={`p-1.5 rounded-lg border transition ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300'
                      : 'border-slate-300 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Guest / Logged out state */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-medium text-xs text-slate-300 truncate">{profile.name} (Guest)</div>
                  <div className="text-[10px] text-slate-500 truncate">{profile.birthPlace}</div>
                </div>
              </div>

              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
