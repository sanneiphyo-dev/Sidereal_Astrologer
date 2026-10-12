import React, { useState } from 'react';
import { UserProfile } from '../types/chat.types';
import { useTheme } from '../../../context/ThemeContext';
import { X, Calendar, Clock, MapPin, User, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-2xl p-6 shadow-xl transition-all border ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-base font-bold font-cinzel mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          Birth Chart Coordinates
        </h3>
        <p className={`text-xs mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Sidereal planetary calculations (Nirayana) are calibrated against your exact birth date, time, and coordinates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <User className="w-3.5 h-3.5 text-indigo-500" />
              Seeker Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Birth Date
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Birth Time
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Birth Place (City, Country)
            </label>
            <input
              type="text"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              placeholder="e.g. Yangon, Myanmar or New York, USA"
              className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
              }`}
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              Save Coordinates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
