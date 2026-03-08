'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminStore } from '@/lib/stores/adminStore';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useFeeStore } from '@/lib/stores/feeStore';
import { adminService } from '@/lib/api/services/adminService';
import { academicService } from '@/lib/api/services/academicService';
import { feeService } from '@/lib/api/services/feeService';
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'lucide-react';

export default function ParentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  const students = useAdminStore((state) => state.students);
  const setStudents = useAdminStore((state) => state.setStudents);
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);
  const studentFeeRecords = useFeeStore((state) => state.studentFeeRecords);
  const setStudentFeeRecords = useFeeStore((state) => state.setStudentFeeRecords);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, gradesRes, attendanceRes, feeRes] = await Promise.all([
          adminService.getStudents(),
          academicService.getGrades(),
          academicService.getAttendance(),
          feeService.getAllStudentFeeRecords(),
        ]);

        if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data);
        if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
        if (attendanceRes.success && attendanceRes.data) setAttendance(attendanceRes.data);
        if (feeRes.success && feeRes.data) setStudentFeeRecords(feeRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStudents, setGrades, setAttendance, setStudentFeeRecords]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  const totalPendingFees = studentFeeRecords.reduce((sum, record) => sum + record.pendingAmount, 0);
  const totalStudents = students.length;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Parent Dashboard</h1>
          <p className="text-slate-400 mt-2">Monitor your children's academic progress and fees</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Children"
            value={totalStudents}
            icon={BarChart3}
            description="Registered students"
          />
          <StatCard
            title="Average Attendance"
            value={`${Math.round(
              attendance.length > 0
                ? (attendance.filter((a) => a.status === 'present').length / attendance.length) * 100
                : 0
            )}%`}
            icon={ClipboardList}
            description="Overall attendance"
          />
          <StatCard
            title="Total Fees Outstanding"
            value={`₹${totalPendingFees.toLocaleString()}`}
            icon={CreditCard}
            trend={totalPendingFees > 0 ? { value: 5, isPositive: false } : undefined}
          />
          <StatCard
            title="Average Grade"
            value={`${Math.round(
              grades.length > 0
                ? grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length
                : 0
            )}%`}
            icon={BarChart3}
            description="Overall performance"
          />
        </div>

        {/* Children's Academic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Grades */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Recent Grades
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
            </CardContent>
          </Card>

          {/* Fee Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Fee Status
              </CardTitle>
              <CardDescription>Payment information</CardDescription>
            </CardHeader>
            <CardContent>
              {studentFeeRecords.length > 0 ? (
                <div className="space-y-3">
                  {studentFeeRecords.map((record) => (
                    <div key={record.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-semibold">Student ID: {record.studentId}</p>
                        {record.pendingAmount > 0 && (
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-white">₹{record.totalFeeAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Paid:</span>
                          <span className="text-green-400">₹{record.paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Pending:</span>
                          <span className="text-red-400">₹{record.pendingAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No fee records available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {totalPendingFees > 0 && (
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Outstanding Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">
                  You have ₹{totalPendingFees.toLocaleString()} in outstanding fees
                </p>
                <p className="text-slate-400 text-sm mt-1">Please pay before the due date to avoid penalties</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Pay Now</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
