import { create } from 'zustand';

interface AuthState {
  user: any | null;
  profile: any | null;
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
}));
