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
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TeacherFormDialog } from '@/components/dialogs/TeacherFormDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Teacher } from '@/lib/types';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      user_id: 2,
      date_of_birth: '1985-05-15',
      gender: 'Male',
      specialization: 'Mathematics',
      qualification: 'M.Sc Mathematics',
      years_of_experience: 10,
      salary: 45000,
      email: 'john.doe@school.edu',
      phone: '+1234567890',
      hire_date: '2014-08-01',
      employment_type: 'Full-time',
      status: 'ACTIVE',
      created_at: '2014-08-01T00:00:00Z',
      updated_at: '2024-03-08T00:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | undefined>();

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeacher = (teacher: Teacher) => {
    if (selectedTeacher) {
      setTeachers(teachers.map((t) => (t.id === teacher.id ? teacher : t)));
    } else {
      setTeachers([...teachers, teacher]);
    }
    setSelectedTeacher(undefined);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormOpen(true);
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setDeleteTarget(teacher);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      setTeachers(teachers.filter((t) => t.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teachers Management</h1>
            <p className="text-gray-400 mt-1">Manage all teachers in the system</p>
          </div>
          <PermissionGuard permission={Permission.TEACHER_FULL}>
            <Button
              onClick={() => {
                setSelectedTeacher(undefined);
                setFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
          </PermissionGuard>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
            <CardDescription>Total: {filteredTeachers.length} teachers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by email or specialization..."
                className="pl-10 bg-slate-800 border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Employment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id} className="border-slate-700">
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.specialization}</TableCell>
                        <TableCell>{teacher.years_of_experience} years</TableCell>
                        <TableCell>{teacher.employment_type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={teacher.status === 'ACTIVE' ? 'default' : 'secondary'}
                          >
                            {teacher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.TEACHER_FULL}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTeacher(teacher)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTeacher(teacher)}
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

        <TeacherFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          teacher={selectedTeacher}
          onSuccess={handleCreateTeacher}
        />

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Teacher"
          description="Are you sure you want to delete this teacher? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
