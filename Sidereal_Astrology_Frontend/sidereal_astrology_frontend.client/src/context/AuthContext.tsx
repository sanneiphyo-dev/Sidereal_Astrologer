import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginPayload, RegisterPayload } from '../features/auth/types/auth.types';
import { authApi } from '../features/auth/api/authApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('sidereal_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sidereal_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sidereal_auth_user');
    }
  }, [user]);

  const login = async (payload: LoginPayload) => {
    const authUser = await authApi.login(payload);
    setUser(authUser);
  };

  const register = async (payload: RegisterPayload) => {
    const authUser = await authApi.register(payload);
    setUser(authUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updated: AuthUser) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
