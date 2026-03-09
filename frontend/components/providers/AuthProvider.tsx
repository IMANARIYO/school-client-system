'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/api/services/authService';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setError = useAuthStore((state) => state.setError);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();

        if (response.success && response.data) {
          setUser(response.data);
          // Only store userRole for convenience
          localStorage.setItem('userRole', response.data.role);
          document.cookie = `userRole=${response.data.role}; path=/`;
        } else {
          logout();
        }
      } catch (err) {
        setError('Failed to verify authentication');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setIsLoading, setError, logout]);

  return <>{children}</>;
}