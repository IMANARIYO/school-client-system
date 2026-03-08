'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, Award, Clock, DollarSign, Monitor, Bell, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const managementLinks = [
  { href: '/admin/management/users', label: 'Users', icon: Users },
  { href: '/admin/management/students', label: 'Students', icon: Award },
  { href: '/admin/management/teachers', label: 'Teachers', icon: BookOpen },
  { href: '/admin/management/classes', label: 'Classes', icon: Monitor },
  { href: '/admin/management/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/admin/management/schedules', label: 'Schedules', icon: Clock },
  { href: '/admin/management/fees', label: 'Fees & Transactions', icon: DollarSign },
  { href: '/admin/management/devices', label: 'Devices', icon: Monitor },
];

export default function AdminManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen gap-6 p-6 bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-56 bg-white rounded-lg shadow-sm border border-slate-200 overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Management</h2>
        </div>
        <nav className="p-4 space-y-2">
          {managementLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm">{children}</div>
      </main>
    </div>
  );
}
