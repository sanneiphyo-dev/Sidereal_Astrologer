import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDark } = useTheme();

  // Auto-focus input on mount
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) {
      return;
    }

    onSendMessage(trimmed);

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isBlank = input.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 w-full">
      <div
        className={`relative flex-1 rounded-xl p-2 transition-all border ${
          isDark
            ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'
            : 'bg-slate-50 border-slate-300 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:bg-white'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoading
              ? 'Astrological calculations in progress...'
              : 'Ask a Sidereal astrology question (e.g. "What is my karmic purpose in this life?")...'
          }
          disabled={isLoading || disabled}
          rows={1}
          className={`w-full bg-transparent text-sm outline-none resize-none px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed ${
            isDark
              ? 'text-slate-100 placeholder-slate-400'
              : 'text-slate-800 placeholder-slate-400'
          }`}
        />

        <div
          className={`flex items-center justify-between px-3 pt-1 text-[11px] border-t mt-1 ${
            isDark
              ? 'border-slate-700/60 text-slate-400'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          <span
            className={`flex items-center gap-1 font-medium ${
              isDark ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Nirayana / Lahiri Ayanamsa</span>
          </span>
          <span className="hidden sm:inline text-slate-400">Press Enter ↵ to send</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBlank || isLoading || disabled}
        className={`flex items-center justify-center p-3 rounded-xl font-medium transition-all shadow-sm ${
          isBlank || isLoading || disabled
            ? isDark
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white'
        }`}
        title="Send Question (Enter)"
      >
        <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
      </button>
    </form>
  );
};
