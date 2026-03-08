'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminStore } from '@/lib/stores/adminStore';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { adminService } from '@/lib/api/services/adminService';
import { academicService } from '@/lib/api/services/academicService';
import {
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useAdminStore((state) => state.classes);
  const setClasses = useAdminStore((state) => state.setClasses);
  const students = useAdminStore((state) => state.students);
  const setStudents = useAdminStore((state) => state.setStudents);
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [classesRes, studentsRes, gradesRes, attendanceRes] = await Promise.all([
          adminService.getClasses(),
          adminService.getStudents(),
          academicService.getGrades(),
          academicService.getAttendance(),
        ]);

        if (classesRes.success && classesRes.data) setClasses(classesRes.data);
        if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data);
        if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
        if (attendanceRes.success && attendanceRes.data) setAttendance(attendanceRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setClasses, setStudents, setGrades, setAttendance]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  const totalStudents = students.length;
  const publishedGrades = grades.length;
  const attendanceRecords = attendance.length;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your classes, grades, and attendance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            description="Under your supervision"
          />
          <StatCard
            title="Classes"
            value={classes.length}
            icon={BookOpen}
            description="Active classes"
          />
          <StatCard
            title="Grades Published"
            value={publishedGrades}
            icon={BarChart3}
            description="Total grades"
          />
          <StatCard
            title="Attendance Records"
            value={attendanceRecords}
            icon={ClipboardList}
            description="Total records"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Your Classes
              </CardTitle>
              <CardDescription>Classes you are teaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold">{classItem.name}</p>
                        <p className="text-slate-400 text-sm">{classItem.classCode}</p>
                      </div>
                      <Link href={`/teacher/grades?classId=${classItem.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Grades
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No classes assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/teacher/grades" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publish New Grades
                </Button>
              </Link>
              <Link href="/teacher/attendance" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Attendance
                </Button>
              </Link>
              <Link href="/teacher/classes" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  View Class Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
