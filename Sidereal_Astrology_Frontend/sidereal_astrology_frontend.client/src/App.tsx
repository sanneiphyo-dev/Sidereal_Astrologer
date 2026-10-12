import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatContainer } from './features/astrology-chat/components/ChatContainer';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <ChatContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
