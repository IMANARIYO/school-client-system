import { create } from "zustand";
import { UserProfile, AuthState } from "@/lib/types";

interface AuthStore extends AuthState {
  setUser: (user: UserProfile | null) => void;
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
    set(() => ({
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

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // don't store role separately, server provides role securely
      document.cookie =
        "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    set(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }));
  },

  clearError: () => set(() => ({ error: null })),
}));
