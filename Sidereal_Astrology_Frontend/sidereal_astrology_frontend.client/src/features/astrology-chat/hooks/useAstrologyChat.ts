import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, UserProfile, ChatReadingItem, ChatSession } from '../types/chat.types';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../../../context/AuthContext';

const DEFAULT_PROFILE: UserProfile = {
  userId: 1,
  name: 'Seeker',
  birthDate: '1995-06-21',
  birthTime: '10:30',
  birthPlace: 'Yangon, Myanmar',
};

const getWelcomeMessage = (userName: string = 'Seeker'): ChatMessage => ({
  id: 'welcome-1',
  role: 'assistant',
  content: `### 🌟 Welcome to Sidereal Astrology, ${userName}
I am your **Sidereal Astrological Assistant**, calculating planetary positions based on the true astronomical constellations using **Lahiri (Chitra Paksha) Ayanamsa**.

Unlike Western Tropical astrology (which ties signs to the seasons), Sidereal astrology accounts for the precession of the equinoxes (~24.16° shift), revealing your true Vedic cosmic blueprint.

Feel free to ask about your **karmic path, career direction, love & relationship dynamics, or current planetary transits**!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

const generateNewSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export function useAstrologyChat() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (user) {
      return {
        userId: user.userId,
        name: user.name,
        birthDate: user.birthDate || '1995-06-21',
        birthTime: user.birthTime || '12:00',
        birthPlace: user.birthPlace || 'Yangon, Myanmar',
      };
    }
    const saved = localStorage.getItem('sidereal_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Keep profile synchronized with authenticated user
  useEffect(() => {
    if (user) {
      setProfile({
        userId: user.userId,
        name: user.name,
        birthDate: user.birthDate || '1995-06-21',
        birthTime: user.birthTime || '12:00',
        birthPlace: user.birthPlace || 'Yangon, Myanmar',
      });
    }
  }, [user]);

  // Current session id
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateNewSessionId);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage(profile.name)]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidereal_user_profile', JSON.stringify(profile));
  }, [profile]);

  // Load chat history and sessions from EF Core backend
  const loadHistory = useCallback(async () => {
    try {
      const response = await chatApi.getHistory(profile.userId);
      if (response && response.sessions) {
        setSessions(response.sessions);
      }
    } catch (err) {
      console.warn('Could not load chat history from database:', err);
    }
  }, [profile.userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Select an entire session and render all its Q&A messages
  const selectSession = (session: ChatSession) => {
    setCurrentSessionId(session.sessionId);

    const loadedMessages: ChatMessage[] = [getWelcomeMessage(profile.name)];

    session.messages.forEach((item) => {
      let parsedData;
      if (item.calculatedSiderealData) {
        try {
          parsedData = JSON.parse(item.calculatedSiderealData);
        } catch {
          // ignore json parse error
        }
      }

      loadedMessages.push({
        id: `user-${item.readingId}`,
        role: 'user',
        content: item.question,
        timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readingId: item.readingId,
      });

      loadedMessages.push({
        id: `ai-${item.readingId}`,
        role: 'assistant',
        content: item.aiResponse,
        calculatedData: parsedData,
        timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readingId: item.readingId,
      });
    });

    setMessages(loadedMessages);
  };

  // Start a fresh session without deleting previous ones
  const startNewChat = () => {
    const newSessionId = generateNewSessionId();
    setCurrentSessionId(newSessionId);
    setMessages([getWelcomeMessage(profile.name)]);
  };

  const sendMessage = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || isLoading) {
      return;
    }

    setError(null);
    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: question,
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const activeSessionId = currentSessionId;

      const response = await chatApi.askQuestion({
        userId: profile.userId,
        question: question,
        userName: profile.name,
        birthDate: profile.birthDate || undefined,
        birthTime: profile.birthTime || undefined,
        birthPlace: profile.birthPlace || undefined,
        sessionId: activeSessionId,
      });

      let parsedData;
      if (response.calculatedSiderealData) {
        try {
          parsedData = JSON.parse(response.calculatedSiderealData);
        } catch {
          // ignore json parse error
        }
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${response.readingId || Date.now()}`,
        role: 'assistant',
        content: response.aiResponse,
        calculatedData: parsedData,
        timestamp: new Date(response.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readingId: response.readingId,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const newReadingItem: ChatReadingItem = {
        readingId: response.readingId,
        userId: response.userId,
        sessionId: response.sessionId || activeSessionId,
        question: response.question,
        calculatedSiderealData: response.calculatedSiderealData,
        aiResponse: response.aiResponse,
        createdAt: response.createdAt,
      };

      // Update session in sidebar immediately
      setSessions((prev) => {
        const existingSessionIndex = prev.findIndex((s) => s.sessionId === activeSessionId);
        if (existingSessionIndex >= 0) {
          const updated = [...prev];
          const curr = updated[existingSessionIndex];
          updated[existingSessionIndex] = {
            ...curr,
            lastUpdatedAt: response.createdAt,
            messageCount: curr.messageCount + 1,
            messages: [...curr.messages, newReadingItem],
          };
          // Move this session to top
          const [moved] = updated.splice(existingSessionIndex, 1);
          return [moved, ...updated];
        } else {
          // Create new session entry
          const newSession: ChatSession = {
            sessionId: activeSessionId,
            title: question,
            createdAt: response.createdAt,
            lastUpdatedAt: response.createdAt,
            messageCount: 1,
            messages: [newReadingItem],
          };
          return [newSession, ...prev];
        }
      });
    } catch (err: any) {
      const errorMsg = err.message || 'Unable to generate Sidereal astrological interpretation.';
      setError(errorMsg);

      const errorResponse: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Reading Error**: ${errorMsg}\n\nPlease check your question or backend connection and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    startNewChat();
  };

  return {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    error,
    profile,
    setProfile,
    sendMessage,
    selectSession,
    startNewChat,
    clearChat,
    loadHistory,
  };
}
