'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { authService } from '@/lib/api/services/authService';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setError = useAuthStore((state) => state.setError);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setUser(null);
        return;
      }

      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem('userRole', response.data.role);
          document.cookie = `userRole=${response.data.role}; path=/`;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          setUser(null);
        }
      } catch (error) {
        setError('Failed to verify authentication');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setIsLoading, setError]);

  return <>{children}</>;
}
