'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Grade, GradeStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function GradesPage() {
  const { toast } = useToast();
  
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: 1,
      student_id: 101,
      teacher_id: 1,
      class_subject_id: 1,
      score: 85,
      grade: 'A',
      term: 'First',
      academic_year: '2024',
      exam_type: 'term_exam',
      status: 'APPROVED',
      date_recorded: '2024-02-15T00:00:00Z',
      created_at: '2024-02-15T00:00:00Z',
      updated_at: '2024-02-15T00:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<GradeStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Grade | undefined>();

  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.id.toString().includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || grade.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApproveGrade = (grade: Grade) => {
    setGrades(
      grades.map((g) =>
        g.id === grade.id ? { ...g, status: 'APPROVED' as GradeStatus } : g
      )
    );
    toast({
      title: 'Success',
      description: 'Grade approved successfully',
    });
  };

  const handleRejectGrade = (grade: Grade) => {
    setGrades(
      grades.map((g) =>
        g.id === grade.id ? { ...g, status: 'REJECTED' as GradeStatus } : g
      )
    );
    toast({
      title: 'Grade Rejected',
      description: 'Grade has been marked as rejected',
    });
  };

  const handleDeleteGrade = (grade: Grade) => {
    setDeleteTarget(grade);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setGrades(grades.filter((g) => g.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Grade deleted successfully',
      });
    }
  };

  const getStatusColor = (status: GradeStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grades Management</h1>
            <p className="text-gray-400 mt-1">Manage student grades and academic records</p>
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Grade Records</CardTitle>
            <CardDescription>Total: {filteredGrades.length} records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by grade ID..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as GradeStatus | 'ALL')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((grade) => (
                      <TableRow key={grade.id} className="border-slate-700">
                        <TableCell>#{grade.student_id}</TableCell>
                        <TableCell>{grade.score}/{100}</TableCell>
                        <TableCell className="font-bold">{grade.grade}</TableCell>
                        <TableCell>{grade.term}</TableCell>
                        <TableCell>{grade.academic_year}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(grade.status)}>
                            {grade.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.GRADES_UPDATE}>
                              {grade.status === 'PENDING' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApproveGrade(grade)}
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectGrade(grade)}
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGrade(grade)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Grade"
          description="Are you sure you want to delete this grade record? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
