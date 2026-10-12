import React, { useState } from 'react';
import { ChatMessage } from '../types/chat.types';
import { useTheme } from '../../../context/ThemeContext';
import { User, Sparkles, Sun, Moon, Compass, Copy, Check, Star } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className={`text-sm sm:text-base font-bold mt-2 mb-1 flex items-center gap-1.5 font-cinzel ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4
            key={idx}
            className={`text-xs sm:text-sm font-semibold mt-2 mb-1 font-cinzel ${
              isDark ? 'text-indigo-300' : 'text-indigo-700'
            }`}
          >
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className={`text-xs sm:text-sm ml-4 list-disc leading-relaxed my-0.5 ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p
          key={idx}
          className={`text-xs sm:text-sm leading-relaxed my-1 ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex items-start gap-2.5 my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Solid Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${
          isUser
            ? isDark ? 'bg-slate-700' : 'bg-slate-600'
            : 'bg-indigo-600'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Solid Message Card */}
      <div
        className={`relative flex-1 max-w-2xl rounded-2xl p-4 shadow-sm transition-all border ${
          isUser
            ? 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none'
            : message.isError
            ? isDark
              ? 'bg-rose-950 border-rose-800 text-rose-200 rounded-tl-none'
              : 'bg-rose-50 border-rose-200 text-rose-800 rounded-tl-none'
            : isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100 rounded-tl-none'
            : 'bg-white border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
        }`}
      >
        {/* Header bar */}
        <div
          className={`flex items-center justify-between pb-2 mb-2 border-b text-xs ${
            isUser
              ? 'border-indigo-500/50 text-indigo-100'
              : isDark
              ? 'border-slate-800 text-slate-400'
              : 'border-slate-100 text-slate-500'
          }`}
        >
          <span className="font-semibold tracking-wide flex items-center gap-1">
            {isUser ? (
              <span>You (Seeker)</span>
            ) : (
              <span className={`font-cinzel flex items-center gap-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Sidereal Astrology Guide
              </span>
            )}
          </span>
          <div className="flex items-center gap-2 text-[11px]">
            <span>{message.timestamp}</span>
            {!isUser && !message.isError && (
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition ${
                  isDark
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
                title="Copy reading"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Calculated Astrological Badges (Solid) */}
        {message.calculatedData && (
          <div
            className={`mb-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2 rounded-xl border text-xs ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {message.calculatedData.siderealSun && (
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-600 font-medium'}`}>
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate" title={`Sun: ${message.calculatedData.siderealSun.sign}`}>
                  {message.calculatedData.siderealSun.sign.split(' ')[0]}
                </span>
              </div>
            )}
            {message.calculatedData.siderealMoon && (
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600 font-medium'}`}>
                <Moon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate" title={`Moon: ${message.calculatedData.siderealMoon.sign}`}>
                  {message.calculatedData.siderealMoon.sign.split(' ')[0]}
                </span>
              </div>
            )}
            {message.calculatedData.nakshatra && (
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-purple-400' : 'text-purple-600 font-medium'}`}>
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="truncate" title={`Nakshatra: ${message.calculatedData.nakshatra}`}>
                  {message.calculatedData.nakshatra}
                </span>
              </div>
            )}
            {message.calculatedData.ayanamsaDegrees && (
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600 font-medium'}`}>
                <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Lahiri {message.calculatedData.ayanamsaDegrees}°</span>
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="space-y-1">
          {isUser ? (
            <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
          ) : (
            renderFormattedContent(message.content)
          )}
        </div>
      </div>
    </div>
  );
};
