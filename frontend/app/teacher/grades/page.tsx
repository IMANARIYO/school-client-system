'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useAdminStore } from '@/lib/stores/adminStore';
import { academicService } from '@/lib/api/services/academicService';
import { adminService } from '@/lib/api/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ExamType } from '@/lib/types';

export default function TeacherGradesPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [isLoading, setIsLoading] = useState(true);
  
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);
  const subjects = useAcademicStore((state) => state.subjects);
  const setSubjects = useAcademicStore((state) => state.setSubjects);
  const students = useAdminStore((state) => state.students);
  const setStudents = useAdminStore((state) => state.setStudents);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [gradesRes, subjectsRes, studentsRes] = await Promise.all([
          academicService.getGrades(),
          academicService.getSubjects(classId || undefined),
          adminService.getStudents(),
        ]);

        if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
        if (subjectsRes.success && subjectsRes.data) setSubjects(subjectsRes.data);
        if (studentsRes.success && studentsRes.data) setStudents(studentsRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setGrades, setSubjects, setStudents, classId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading grades..." />
        </div>
      </MainLayout>
    );
  }

  const getExamTypeLabel = (type: ExamType) => {
    const labels = {
      unit_test: 'Unit Test',
      term_exam: 'Term Exam',
      practical: 'Practical',
      project: 'Project',
      assignment: 'Assignment',
    };
    return labels[type];
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      A: 'bg-green-500/20 text-green-300',
      B: 'bg-blue-500/20 text-blue-300',
      C: 'bg-yellow-500/20 text-yellow-300',
      D: 'bg-orange-500/20 text-orange-300',
      F: 'bg-red-500/20 text-red-300',
    };
    return colors[grade] || 'bg-slate-500/20 text-slate-300';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Grades Management</h1>
            <p className="text-slate-400 mt-2">View and manage student grades</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Publish Grade
          </Button>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Grade Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Subject</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Exam Type</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Marks</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Grade</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.length > 0 ? (
                    grades.map((grade) => {
                      const student = students.find((s) => s.id === grade.studentId);
                      return (
                        <tr key={grade.id} className="border-b border-slate-700 hover:bg-slate-900/50">
                          <td className="py-3 px-4 text-white">
                            {student ? students.find((s) => s.userId === students.find((s) => s.id === grade.studentId)?.userId)?.userId : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-slate-300">{grade.subjectId}</td>
                          <td className="py-3 px-4 text-slate-300">{getExamTypeLabel(grade.examType)}</td>
                          <td className="py-3 px-4 text-white font-semibold">
                            {grade.marks}/{grade.totalMarks}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 px-4 text-center text-slate-400">
                        No grades published yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
