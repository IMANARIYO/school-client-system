'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  ClipboardList,
  CreditCard,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home className="w-4 h-4" />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
  },
  {
    label: 'Dashboard',
    href: '/parent/dashboard',
    icon: <Home className="w-4 h-4" />,
    roles: [UserRole.PARENT],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Management',
    href: '/admin/management',
    icon: <Users className="w-4 h-4" />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="w-4 h-4" />,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Classes',
    href: '/admin/classes',
    icon: <BookOpen className="w-4 h-4" />,
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    label: 'Grades',
    href: '/teacher/grades',
    icon: <FileText className="w-4 h-4" />,
    roles: [UserRole.TEACHER, UserRole.STUDENT],
  },
  {
    label: 'Attendance',
    href: '/teacher/attendance',
    icon: <ClipboardList className="w-4 h-4" />,
    roles: [UserRole.TEACHER],
  },
  {
    label: 'My Grades',
    href: '/student/grades',
    icon: <GraduationCap className="w-4 h-4" />,
    roles: [UserRole.STUDENT],
  },
  {
    label: 'My Attendance',
    href: '/student/attendance',
    icon: <ClipboardList className="w-4 h-4" />,
    roles: [UserRole.STUDENT],
  },
  {
    label: 'My Fees',
    href: '/student/fees',
    icon: <CreditCard className="w-4 h-4" />,
    roles: [UserRole.STUDENT],
  },
  {
    label: 'My Children',
    href: '/parent/children',
    icon: <GraduationCap className="w-4 h-4" />,
    roles: [UserRole.PARENT],
  },
  {
    label: 'My Fees',
    href: '/parent/fees',
    icon: <CreditCard className="w-4 h-4" />,
    roles: [UserRole.PARENT],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-4 h-4" />,
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  console.log("the currently  logged in user is ", user)


  const filteredNavItems = navItems.filter((item) => !user || item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          EduManage
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-left gap-3 text-slate-300 hover:text-white hover:bg-slate-800',
                pathname.startsWith(item.href.split('/')[1] === '' ? '/' : '/' + item.href.split('/')[1])
                  ? 'bg-slate-800 text-white'
                  : ''
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="mb-4 p-3 bg-slate-800 rounded-lg text-sm">
            <p className="font-semibold text-white">{user.fullName}</p>
            <p className="text-slate-400 text-xs capitalize">{user.role}</p>
          </div>
        )}
        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
