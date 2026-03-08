import { create } from 'zustand';
import { User, UserRole, AuthState } from '@/lib/types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: !!user,
    })),

  setIsAuthenticated: (isAuthenticated) =>
    set(() => ({
      isAuthenticated,
    })),

  setIsLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),

  setError: (error) =>
    set(() => ({
      error,
    })),

  logout: () =>
    set(() => ({
      ...initialState,
    })),

  clearError: () =>
    set(() => ({
      error: null,
    })),
}));
