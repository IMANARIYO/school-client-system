import { UserRole } from '@/lib/types';

export enum Permission {
  USER_CREATE = 'USER_CREATE',
  USER_READ = 'USER_READ',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_FULL = 'USER_FULL',
  
  GRADES_VIEW = 'GRADES_VIEW',
  GRADES_UPDATE = 'GRADES_UPDATE',
  GRADES_FULL = 'GRADES_FULL',
  
  ATTENDANCE_VIEW = 'ATTENDANCE_VIEW',
  ATTENDANCE_UPDATE = 'ATTENDANCE_UPDATE',
  ATTENDANCE_FULL = 'ATTENDANCE_FULL',
  
  FEE_VIEW = 'FEE_VIEW',
  FEE_DEPOSIT = 'FEE_DEPOSIT',
  FEE_WITHDRAW = 'FEE_WITHDRAW',
  FEE_FULL = 'FEE_FULL',
  
  CLASS_VIEW = 'CLASS_VIEW',
  CLASS_MANAGE = 'CLASS_MANAGE',
  CLASS_FULL = 'CLASS_FULL',
  
  TEACHER_VIEW = 'TEACHER_VIEW',
  TEACHER_ASSIGN = 'TEACHER_ASSIGN',
  TEACHER_FULL = 'TEACHER_FULL',
  
  DEVICE_VERIFY = 'DEVICE_VERIFY',
  DEVICE_FULL = 'DEVICE_FULL',
  
  TIMETABLE_VIEW = 'TIMETABLE_VIEW',
  TIMETABLE_FULL = 'TIMETABLE_FULL',
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.DEVICE_VERIFY,
    Permission.FEE_DEPOSIT,
    Permission.FEE_WITHDRAW,
    Permission.FEE_VIEW,
    Permission.GRADES_VIEW,
    Permission.GRADES_UPDATE,
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_UPDATE,
    Permission.TIMETABLE_VIEW,
    Permission.CLASS_VIEW,
    Permission.CLASS_MANAGE,
    Permission.TEACHER_ASSIGN,
  ],
  
  [UserRole.TEACHER]: [
    Permission.GRADES_VIEW,
    Permission.GRADES_UPDATE,
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_UPDATE,
    Permission.CLASS_VIEW,
    Permission.TIMETABLE_VIEW,
  ],
  
  [UserRole.STUDENT]: [
    Permission.GRADES_VIEW,
    Permission.ATTENDANCE_VIEW,
    Permission.TIMETABLE_VIEW,
    Permission.FEE_VIEW,
  ],
  
  [UserRole.PARENT]: [
    Permission.GRADES_VIEW,
    Permission.ATTENDANCE_VIEW,
    Permission.TIMETABLE_VIEW,
    Permission.FEE_VIEW,
    Permission.FEE_DEPOSIT,
    Permission.FEE_WITHDRAW,
  ],
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};
