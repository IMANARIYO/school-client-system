'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAcademicStore } from '@/lib/stores/academicStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { academicService } from '@/lib/api/services/academicService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamType } from '@/lib/types';

export default function StudentGradesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  
  const grades = useAcademicStore((state) => state.grades);
  const setGrades = useAcademicStore((state) => state.setGrades);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setIsLoading(true);
        if (!user) return;

        const response = await academicService.getGrades(user.id);
        if (response.success && response.data) {
          setGrades(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadGrades();
  }, [setGrades, user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading grades..." />
        </div>
      </MainLayout>
    );
  }

  const getGradeColor = (grade: string) => {
    const colors = {
      A: 'bg-green-500/20 text-green-300 border border-green-500/30',
      B: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      C: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      D: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      F: 'bg-red-500/20 text-red-300 border border-red-500/30',
    };
    return colors[grade] || 'bg-slate-500/20 text-slate-300';
  };

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

  const groupedBySubject = grades.reduce((acc, grade) => {
    if (!acc[grade.subjectId]) {
      acc[grade.subjectId] = [];
    }
    acc[grade.subjectId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  const getAverageForSubject = (subjectId: string) => {
    const subjectGrades = groupedBySubject[subjectId];
    const average = subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length;
    return Math.round(average);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Grades</h1>
          <p className="text-slate-400 mt-2">View your academic performance</p>
        </div>

        {grades.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedBySubject).map(([subjectId, subjectGrades]) => (
              <Card key={subjectId} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{subjectId}</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Average</p>
                      <p className="text-2xl font-bold text-blue-400">{getAverageForSubject(subjectId)}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectGrades.map((grade) => (
                      <div
                        key={grade.id}
                        className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-slate-400 text-sm">{getExamTypeLabel(grade.examType)}</p>
                            <p className="text-white font-semibold mt-1">
                              {grade.marks}/{grade.totalMarks}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade)}`}>
                            {grade.grade}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Percentage</span>
                            <span className="text-blue-400 font-semibold">{Math.round(grade.percentage)}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${grade.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12">
              <p className="text-center text-slate-400">No grades available yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
