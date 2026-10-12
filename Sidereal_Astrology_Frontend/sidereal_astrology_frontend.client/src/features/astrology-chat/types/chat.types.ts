export interface AskAstrologyQuestionRequest {
  userId?: number;
  question: string;
  userName?: string;
  birthDate?: string; // yyyy-MM-dd
  birthTime?: string; // HH:mm
  birthPlace?: string;
  sessionId?: string;
}

export interface AskAstrologyQuestionResponse {
  readingId: number;
  userId: number;
  userName: string;
  question: string;
  calculatedSiderealData?: string;
  aiResponse: string;
  sessionId: string;
  createdAt: string;
}

export interface ChatReadingItem {
  readingId: number;
  userId: number;
  sessionId?: string;
  question: string;
  calculatedSiderealData?: string;
  aiResponse: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
  messageCount: number;
  messages: ChatReadingItem[];
}

export interface GetChatHistoryResponse {
  userId: number;
  readings: ChatReadingItem[];
  sessions: ChatSession[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  calculatedData?: {
    ayanamsa?: string;
    ayanamsaDegrees?: number;
    siderealSun?: { sign: string; degree: number };
    siderealMoon?: { sign: string; degree: number };
    nakshatra?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
  };
  timestamp: string;
  readingId?: number;
  isError?: boolean;
}

export interface UserProfile {
  userId: number;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}
