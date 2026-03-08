'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminStore } from '@/lib/stores/adminStore';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { adminService } from '@/lib/api/services/adminService';
import { academicService } from '@/lib/api/services/academicService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  ClipboardList,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
} from 'lucide-react';

export default function ParentChildrenPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const students = useAdminStore((state) => state.students);
  const setStudents = useAdminStore((state) => state.setStudents);
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);
  const attendance = useAcademicStore((state) => state.attendance);
  const setAttendance = useAcademicStore((state) => state.setAttendance);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, gradesRes, attendanceRes] = await Promise.all([
          adminService.getStudents(),
          academicService.getGrades(),
          academicService.getAttendance(),
        ]);

        if (studentsRes.success && studentsRes.data) {
          setStudents(studentsRes.data);
          if (studentsRes.data.length > 0) {
            setSelectedStudent(studentsRes.data[0].id);
          }
        }
        if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
        if (attendanceRes.success && attendanceRes.data) setAttendance(attendanceRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStudents, setGrades, setAttendance]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading children profiles..." />
        </div>
      </MainLayout>
    );
  }

  const selectedStudentData = students.find((s) => s.id === selectedStudent);
  const studentGrades = selectedStudent ? grades.filter((g) => g.studentId === selectedStudent) : [];
  const studentAttendance = selectedStudent
    ? attendance.filter((a) => a.studentId === selectedStudent)
    : [];
  const averageGrade =
    studentGrades.length > 0
      ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
      : 0;

  const attendancePercentage =
    studentAttendance.length > 0
      ? Math.round(
          (studentAttendance.filter((a) => a.status === 'present').length / studentAttendance.length) *
            100
        )
      : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Children</h1>
          <p className="text-slate-400 mt-2">View and manage your children's profiles and progress</p>
        </div>

        {students.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Children List Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Your Children</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {students.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedStudent === student.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs opacity-75">Roll: {student.rollNumber}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Details */}
            <div className="lg:col-span-3 space-y-6">
              {selectedStudentData && (
                <>
                  {/* Profile Card */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-2xl flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                            {selectedStudentData.name}
                          </CardTitle>
                          <p className="text-slate-400 mt-1">Roll: {selectedStudentData.rollNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Class</p>
                          <p className="text-2xl font-bold text-blue-400">{selectedStudentData.class}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-slate-400 text-sm">Email</p>
                          <p className="text-white flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {selectedStudentData.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Phone</p>
                          <p className="text-white flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4" />
                            {selectedStudentData.phone || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-900/20 border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-blue-300 text-sm font-semibold flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Average Grade
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-blue-400">{averageGrade}%</p>
                        <p className="text-slate-400 text-sm mt-1">{studentGrades.length} assessments</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-900/20 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="text-green-300 text-sm font-semibold flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Attendance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-green-400">{attendancePercentage}%</p>
                        <p className="text-slate-400 text-sm mt-1">
                          {studentAttendance.filter((a) => a.status === 'present').length} present
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-900/20 border-purple-500/30">
                      <CardHeader>
                        <CardTitle className="text-purple-300 text-sm font-semibold flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Subjects
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-purple-400">
                          {new Set(studentGrades.map((g) => g.subjectId)).size}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">Active subjects</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Grades */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Recent Grades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studentGrades.length > 0 ? (
                        <div className="space-y-3">
                          {studentGrades.slice(-5).reverse().map((grade) => (
                            <div
                              key={grade.id}
                              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                            >
                              <div>
                                <p className="text-white font-semibold">{grade.subjectId}</p>
                                <p className="text-slate-400 text-sm">
                                  {grade.examType.replace('_', ' ')} • {grade.marks}/{grade.totalMarks}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-blue-400 font-bold">{Math.round(grade.percentage)}%</p>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                                  {grade.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-center py-4">No grades available yet</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700">
                      View Full Grades
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">View Attendance</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No children linked to your account yet</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Add Child</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
