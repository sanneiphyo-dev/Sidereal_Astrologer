import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const TypingIndicator: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-start gap-2.5 my-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>

      <div
        className={`flex-1 max-w-2xl rounded-2xl p-4 border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div
          className={`flex items-center gap-2 mb-2.5 text-xs font-semibold ${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>Computing Sidereal Ephemeris & Consulting MCP Assistant...</span>
        </div>

        {/* Solid Skeleton lines */}
        <div className="space-y-2">
          <div
            className={`h-2.5 rounded-full animate-pulse w-3/4 ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          ></div>
          <div
            className={`h-2.5 rounded-full animate-pulse w-5/6 ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          ></div>
          <div
            className={`h-2.5 rounded-full animate-pulse w-1/2 ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          ></div>
        </div>

        <div
          className={`flex items-center gap-2 mt-3 text-[11px] ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Calculating Lahiri Ayanamsa planetary degrees</span>
        </div>
      </div>
    </div>
  );
};
