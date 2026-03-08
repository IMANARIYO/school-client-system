'use client';

import React from 'react';
import { UserRole } from '@/lib/types';
import { useAuthStore } from '@/lib/stores/authStore';

interface RoleGuardProps {
  requiredRole: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ requiredRole, children, fallback }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback || <div className="p-4 text-red-500">Access denied. User not authenticated.</div>}</>;
  }

  const allowed = Array.isArray(requiredRole) ? requiredRole.includes(user.role) : user.role === requiredRole;

  if (!allowed) {
    return <>{fallback || <div className="p-4 text-red-500">Access denied. Insufficient permissions.</div>}</>;
  }

  return <>{children}</>;
}
