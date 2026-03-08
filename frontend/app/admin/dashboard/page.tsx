'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminStore } from '@/lib/stores/adminStore';
import { adminService } from '@/lib/api/services/adminService';
import {
  Users,
  BookOpen,
  BarChart3,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const metrics = useAdminStore((state) => state.metrics);
  const setMetrics = useAdminStore((state) => state.setMetrics);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getMetrics();
        if (response.success && response.data) {
          setMetrics(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [setMetrics]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">Welcome back! Here's your school overview.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Students"
            value={metrics?.totalStudents || 0}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Total Teachers"
            value={metrics?.totalTeachers || 0}
            icon={Users}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Total Classes"
            value={metrics?.totalClasses || 0}
            icon={BookOpen}
            description="Active classes"
          />
          <StatCard
            title="Fee Collected"
            value={`₹${(metrics?.totalFeeCollected || 0).toLocaleString()}`}
            icon={CreditCard}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Attendance"
            value={`${metrics?.attendancePercentage || 0}%`}
            icon={BarChart3}
            description="This month"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates in your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                  <div>
                    <p className="text-white text-sm">3 new students enrolled</p>
                    <p className="text-slate-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div>
                    <p className="text-white text-sm">Grade reports published</p>
                    <p className="text-slate-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2" />
                  <div>
                    <p className="text-white text-sm">Fee payment pending</p>
                    <p className="text-slate-400 text-xs">₹{(metrics?.pendingFees || 0).toLocaleString()} outstanding</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Fee Collection Rate</span>
                  <span className="text-green-400 font-semibold">
                    {metrics && metrics.totalFeeCollected > 0
                      ? Math.round(
                          (metrics.totalFeeCollected /
                            (metrics.totalFeeCollected + metrics.pendingFees)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Student-Teacher Ratio</span>
                  <span className="text-blue-400 font-semibold">
                    {metrics && metrics.totalTeachers > 0
                      ? Math.round(metrics.totalStudents / metrics.totalTeachers)
                      : 0}
                    :1
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Classes Per Teacher</span>
                  <span className="text-purple-400 font-semibold">
                    {metrics && metrics.totalTeachers > 0
                      ? Math.round(metrics.totalClasses / metrics.totalTeachers)
                      : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
