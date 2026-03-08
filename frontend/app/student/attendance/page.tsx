'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { academicService } from '@/lib/api/services/academicService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StudentAttendancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setIsLoading(true);
        if (!user) return;

        const [attendanceRes, percentageRes] = await Promise.all([
          academicService.getAttendance(undefined, user.id),
          academicService.getAttendancePercentage(user.id),
        ]);

        if (attendanceRes.success && attendanceRes.data) {
          setAttendance(attendanceRes.data);
        }
        if (percentageRes.success && percentageRes.data) {
          setAttendancePercentage(percentageRes.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendance();
  }, [setAttendance, user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading attendance..." />
        </div>
      </MainLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === 'present') {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (status === 'absent') {
      return <XCircle className="w-5 h-5 text-red-400" />;
    } else {
      return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'present') return 'bg-green-500/20 text-green-300 border border-green-500/30';
    if (status === 'absent') return 'bg-red-500/20 text-red-300 border border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const leaveCount = attendance.filter((a) => a.status === 'leave').length;

  // Sort attendance by date in descending order
  const sortedAttendance = [...attendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Attendance</h1>
          <p className="text-slate-400 mt-2">Track your attendance records</p>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-semibold">Overall Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-blue-400">{attendancePercentage}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 text-sm font-semibold">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-400">{presentCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300 text-sm font-semibold">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-400">{absentCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 text-sm font-semibold">Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-400">{leaveCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAttendance.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedAttendance.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="text-white font-semibold">
                          {new Date(record.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {record.remark && <p className="text-slate-400 text-sm">{record.remark}</p>}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No attendance records yet</p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Progress Bar */}
        {attendance.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Attendance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Present</span>
                    <span className="text-green-400 font-semibold">
                      {presentCount} ({Math.round((presentCount / attendance.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(presentCount / attendance.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Absent</span>
                    <span className="text-red-400 font-semibold">
                      {absentCount} ({Math.round((absentCount / attendance.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(absentCount / attendance.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Leave</span>
                    <span className="text-yellow-400 font-semibold">
                      {leaveCount} ({Math.round((leaveCount / attendance.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(leaveCount / attendance.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
