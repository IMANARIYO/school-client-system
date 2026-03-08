'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/common/StatCard';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserRole } from '@/lib/types';
import {
  Users,
  BookOpen,
  BarChart3,
  CreditCard,
  TrendingUp,
  GraduationCap,
  Server,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuperAdminDashboard() {
  const [metrics] = useState({
    totalUsers: 284,
    totalStudents: 156,
    totalTeachers: 12,
    totalParents: 120,
    totalClasses: 8,
    totalSubjects: 24,
    totalTransactions: 485,
    totalDevices: 142,
    totalGrades: 2156,
    attendanceRate: 94,
    pendingDeviceVerifications: 5,
    pendingWithdrawalRequests: 3,
    systemHealth: 98,
    activeUsers: 142,
  });

  return (
    <RoleGuard requiredRole={UserRole.SUPER_ADMIN}>
      <MainLayout>
        <div className="space-y-8 font-georgia">
          <div>
            <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Complete system control and analytics</p>
          </div>

          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={metrics.totalUsers}
              icon={Users}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Total Students"
              value={metrics.totalStudents}
              icon={GraduationCap}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Total Teachers"
              value={metrics.totalTeachers}
              icon={Users}
            />
            <StatCard
              title="Total Parents"
              value={metrics.totalParents}
              icon={Users}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Classes"
              value={metrics.totalClasses}
              icon={BookOpen}
            />
            <StatCard
              title="Subjects"
              value={metrics.totalSubjects}
              icon={BookOpen}
            />
            <StatCard
              title="Total Transactions"
              value={`$${metrics.totalTransactions * 100}`}
              icon={CreditCard}
            />
            <StatCard
              title="Devices Managed"
              value={metrics.totalDevices}
              icon={Server}
            />
          </div>

          {/* System Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">System Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-green-500"></div>
                    </div>
                    <span className="text-green-400 font-semibold">{metrics.systemHealth}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">Active Users</span>
                  <span className="text-blue-400 font-semibold">{metrics.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">Attendance Rate</span>
                  <span className="text-green-400 font-semibold">{metrics.attendanceRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">Average Grades</span>
                  <span className="text-yellow-400 font-semibold">3.8/4.0</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>Requires attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-semibold">Device Verifications</p>
                    <p className="text-yellow-200 text-xs">{metrics.pendingDeviceVerifications} devices pending verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-900/30 border border-orange-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-semibold">Withdrawal Requests</p>
                    <p className="text-orange-200 text-xs">{metrics.pendingWithdrawalRequests} requests awaiting approval</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-semibold">Enrollment Trend</p>
                    <p className="text-blue-200 text-xs">+5 students this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>System-wide metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-slate-400 text-sm mb-2">Student-Teacher Ratio</p>
                  <p className="text-3xl font-bold text-blue-500">{(metrics.totalStudents / metrics.totalTeachers).toFixed(1)}:1</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-slate-400 text-sm mb-2">Classes Per Teacher</p>
                  <p className="text-3xl font-bold text-purple-500">{(metrics.totalClasses / metrics.totalTeachers).toFixed(1)}</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-slate-400 text-sm mb-2">Students Per Class</p>
                  <p className="text-3xl font-bold text-green-500">{(metrics.totalStudents / metrics.totalClasses).toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
