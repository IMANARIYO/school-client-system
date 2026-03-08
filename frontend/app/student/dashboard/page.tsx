'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useFeeStore } from '@/lib/stores/feeStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { academicService } from '@/lib/api/services/academicService';
import { feeService } from '@/lib/api/services/feeService';
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);
  const studentFeeRecords = useFeeStore((state) => state.studentFeeRecords);
  const setStudentFeeRecords = useFeeStore((state) => state.setStudentFeeRecords);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!user) return;

        const [gradesRes, attendanceRes, feeRes, attendancePercentageRes] = await Promise.all([
          academicService.getGrades(user.id),
          academicService.getAttendance(undefined, user.id),
          feeService.getAllStudentFeeRecords(),
          academicService.getAttendancePercentage(user.id),
        ]);

        if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
        if (attendanceRes.success && attendanceRes.data) setAttendance(attendanceRes.data);
        if (feeRes.success && feeRes.data) setStudentFeeRecords(feeRes.data);
        if (attendancePercentageRes.success && attendancePercentageRes.data) {
          setAttendancePercentage(attendancePercentageRes.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setGrades, setAttendance, setStudentFeeRecords, user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  const averageGrade =
    grades.length > 0
      ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
      : 0;

  const studentFeeRecord = studentFeeRecords.length > 0 ? studentFeeRecords[0] : null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="text-slate-400 mt-2">Track your academic performance and fees</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Average Grade"
            value={`${averageGrade}%`}
            icon={BarChart3}
            description={grades.length > 0 ? `${grades.length} grades` : 'No grades yet'}
          />
          <StatCard
            title="Attendance"
            value={`${attendancePercentage}%`}
            icon={ClipboardList}
            description="This semester"
          />
          <StatCard
            title="Fees Paid"
            value={`₹${studentFeeRecord?.paidAmount.toLocaleString() || 0}`}
            icon={CreditCard}
            description="Total paid"
          />
          <StatCard
            title="Pending Fees"
            value={`₹${studentFeeRecord?.pendingAmount.toLocaleString() || 0}`}
            icon={CreditCard}
            trend={studentFeeRecord?.pendingAmount ? { value: 10, isPositive: false } : undefined}
          />
        </div>

        {/* Academic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Your Grades
              </CardTitle>
              <CardDescription>Latest assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              {grades.length > 0 ? (
                <div className="space-y-2">
                  {grades.slice(0, 5).map((grade) => (
                    <div
                      key={grade.id}
                      className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-semibold">Grade {grade.marks}/{grade.totalMarks}</p>
                        <p className="text-slate-400 text-sm">{grade.examType.replace('_', ' ')}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                        {grade.grade}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No grades available yet</p>
              )}
              <Link href="/student/grades" className="w-full">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  View All Grades
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Fee Status
              </CardTitle>
              <CardDescription>Payment information</CardDescription>
            </CardHeader>
            <CardContent>
              {studentFeeRecord ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Fees</p>
                    <p className="text-white text-xl font-bold">
                      ₹{studentFeeRecord.totalFeeAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-slate-400 text-sm">Paid</p>
                      <p className="text-green-400 font-bold">₹{studentFeeRecord.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-slate-400 text-sm">Pending</p>
                      <p className="text-red-400 font-bold">₹{studentFeeRecord.pendingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <Link href="/student/fees" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Pay Fees
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-slate-400">No fee record available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
