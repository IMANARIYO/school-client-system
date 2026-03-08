'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useAdminStore } from '@/lib/stores/adminStore';
import { academicService } from '@/lib/api/services/academicService';
import { adminService } from '@/lib/api/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { AttendanceStatus } from '@/lib/types';

export default function TeacherAttendancePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);
  const students = useAdminStore((state) => state.students);
  const setStudents = useAdminStore((state) => state.setStudents);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [attendanceRes, studentsRes] = await Promise.all([
          academicService.getAttendance(),
          adminService.getStudents(),
        ]);

        if (attendanceRes.success && attendanceRes.data) setAttendance(attendanceRes.data);
        if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setAttendance, setStudents]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading attendance..." />
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: AttendanceStatus) => {
    const colors = {
      present: 'bg-green-500/20 text-green-300',
      absent: 'bg-red-500/20 text-red-300',
      late: 'bg-yellow-500/20 text-yellow-300',
      leave: 'bg-blue-500/20 text-blue-300',
    };
    return colors[status];
  };

  // Group attendance by date
  const attendanceByDate = attendance.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof attendance>);

  const sortedDates = Object.keys(attendanceByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
            <p className="text-slate-400 mt-2">Track and manage student attendance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Record Attendance
          </Button>
        </div>

        {sortedDates.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <Card key={date} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-300 font-semibold">Student</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-semibold">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceByDate[date].map((record) => {
                          const student = students.find((s) => s.id === record.studentId);
                          return (
                            <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-900/50">
                              <td className="py-3 px-4 text-white">
                                {student ? student.id : 'Unknown Student'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-300">{record.remark || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-8">
              <p className="text-center text-slate-400">No attendance records yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
