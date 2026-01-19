import { create } from 'zustand';
import { User } from '@/types/auth';
import { authStorage } from '@/lib/auth-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      authStorage.setUser(user);
    }
  },

  setTokens: (accessToken, refreshToken) => {
    authStorage.setAccessToken(accessToken);
    authStorage.setRefreshToken(refreshToken);
    set({ isAuthenticated: true });
  },

  logout: () => {
    authStorage.clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = authStorage.getUser();
    const isAuthenticated = authStorage.isAuthenticated();
    set({ user, isAuthenticated, isLoading: false });
  },
}));
