'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, Clock, DollarSign, Monitor } from 'lucide-react';
import Link from 'next/link';

const managementModules = [
  {
    title: 'Students',
    description: 'Student enrollment and academic records',
    href: '/admin/management/students',
    icon: Award,
    stats: '156 students',
  },
  {
    title: 'Teachers',
    description: 'Teacher profiles and employment data',
    href: '/admin/management/teachers',
    icon: BookOpen,
    stats: '12 teachers',
  },
  {
    title: 'Parents',
    description: 'Parent profiles and contact information',
    href: '/admin/management/parents',
    icon: Users,
    stats: '120 parents',
  },
  {
    title: 'Classes',
    description: 'Class creation and management',
    href: '/admin/management/classes',
    icon: Monitor,
    stats: '8 classes',
  },
  {
    title: 'Schedules',
    description: 'School timetable and schedules',
    href: '/admin/management/schedules',
    icon: Clock,
    stats: '32 schedules',
  },
  {
    title: 'Grades',
    description: 'Student grade management',
    href: '/admin/management/grades',
    icon: Award,
    stats: '2156 grades',
  },
  {
    title: 'Attendance',
    description: 'Student attendance tracking',
    href: '/admin/management/attendance',
    icon: Monitor,
    stats: '12,450 records',
  },
  {
    title: 'Transactions',
    description: 'Fee transactions and payments',
    href: '/admin/management/transactions',
    icon: DollarSign,
    stats: '485 transactions',
  },
];

export default function AdminManagementPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Management System</h1>
        <p className="text-slate-600 mt-2">
          Comprehensive admin control panel for all school management operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription className="mt-2">{module.description}</CardDescription>
                    </div>
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-slate-700">{module.stats}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
