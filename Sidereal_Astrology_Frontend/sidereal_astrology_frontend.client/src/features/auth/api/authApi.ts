import { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errMsg = 'Registration failed.';
      try {
        const err = await res.json();
        if (err.message) errMsg = err.message;
      } catch {
        errMsg = `Server error (${res.status})`;
      }
      throw new Error(errMsg);
    }

    return await res.json();
  },

  async login(payload: LoginPayload): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errMsg = 'Invalid login credentials.';
      try {
        const err = await res.json();
        if (err.message) errMsg = err.message;
      } catch {
        errMsg = `Server error (${res.status})`;
      }
      throw new Error(errMsg);
    }

    return await res.json();
  },

  async getProfile(userId: number): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/me/${userId}`);
    if (!res.ok) {
      throw new Error('Failed to load profile.');
    }
    return await res.json();
  },
};
