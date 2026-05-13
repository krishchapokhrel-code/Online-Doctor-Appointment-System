import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  email: string;
  phone?: string;
  specialty?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!loadUser(),
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateProfile: (updates) => set((state) => {
    if (!state.user) return state;
    const updated = { ...state.user, ...updates };
    localStorage.setItem('auth_user', JSON.stringify(updated));
    return { user: updated };
  }),
}));
