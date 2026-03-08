'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardMap: Record<string, string> = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard',
      };
      router.push(dashboardMap[user.role] || '/admin/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingSpinner text="Redirecting..." />
    </div>
  );
}
