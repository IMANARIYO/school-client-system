'use client';

import React from 'react';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';
import { useAuthStore } from '@/lib/stores/authStore';

interface PermissionGuardProps {
  permission?: Permission | Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  requireAll = false,
  children,
  fallback,
}: PermissionGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback || null}</>;
  }

  if (!permission) {
    return <>{children}</>;
  }

  let allowed = false;

  if (Array.isArray(permission)) {
    allowed = requireAll
      ? hasAllPermissions(user.role, permission)
      : hasAnyPermission(user.role, permission);
  } else {
    allowed = hasPermission(user.role, permission);
  }

  if (!allowed) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
