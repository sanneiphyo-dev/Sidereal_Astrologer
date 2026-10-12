import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { X, User, Lock, Mail, Calendar, Clock, MapPin, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const { isDark } = useTheme();

  // Login form state
  const [loginEmailOrName, setLoginEmailOrName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('1995-06-21');
  const [regBirthTime, setRegBirthTime] = useState('12:00');
  const [regBirthPlace, setRegBirthPlace] = useState('Yangon, Myanmar');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ emailOrName: loginEmailOrName, password: loginPassword });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        birthDate: regBirthDate,
        birthTime: regBirthTime,
        birthPlace: regBirthPlace,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
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
          {tab === 'login' ? 'Sign In to Your Account' : 'Create Seeker Account'}
        </h3>
        <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Access your personal Sidereal horoscope readings and chat history.
        </p>

        {/* Tab switch */}
        <div
          className={`flex rounded-xl p-1 mb-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              tab === 'login'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-indigo-700 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              tab === 'register'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-indigo-700 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl text-xs bg-rose-500/15 border border-rose-500/30 text-rose-400">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Email or Username
              </label>
              <input
                type="text"
                value={loginEmailOrName}
                onChange={(e) => setLoginEmailOrName(e.target.value)}
                placeholder="seeker@example.com or Seeker"
                required
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Full Name
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Your Name"
                required
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                Email
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                Password (min 6 characters)
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={regBirthDate}
                  onChange={(e) => setRegBirthDate(e.target.value)}
                  required
                  className={`w-full rounded-xl px-2.5 py-2 text-xs outline-none transition border ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Birth Time
                </label>
                <input
                  type="time"
                  value={regBirthTime}
                  onChange={(e) => setRegBirthTime(e.target.value)}
                  required
                  className={`w-full rounded-xl px-2.5 py-2 text-xs outline-none transition border ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Birth Place
              </label>
              <input
                type="text"
                value={regBirthPlace}
                onChange={(e) => setRegBirthPlace(e.target.value)}
                placeholder="City, Country"
                required
                className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition border ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
