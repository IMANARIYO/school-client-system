'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Student, EnrollmentStatus } from '@/lib/types';
import { studentService } from '@/lib/api/services/studentService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import StudentFormDialog from '@/components/dialogs/StudentFormDialog';

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'ALL'>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const response = await studentService.getAllStudents(
        statusFilter === 'ALL' ? undefined : { enrollment_status: statusFilter }
      );
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load students',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
    setDeleteOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingStudent(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadStudents();
    toast({
      title: 'Success',
      description: editingStudent ? 'Student updated successfully' : 'Student created successfully',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    
    try {
      const response = await studentService.deleteStudent(deletingStudent.id);
      if (response.success) {
        await loadStudents();
        toast({
          title: 'Success',
          description: 'Student deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive',
      });
    } finally {
      setDeleteOpen(false);
      setDeletingStudent(null);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.user_id.toString().includes(searchTerm) ||
    student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && students.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <Button onClick={handleCreate}>Add Student</Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as EnrollmentStatus | 'ALL');
            loadStudents();
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="GRADUATED">Graduated</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.roll_number || '-'}</TableCell>
                <TableCell>{student.user_id}</TableCell>
                <TableCell>{student.current_grade || '-'}</TableCell>
                <TableCell>{student.section || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.enrollment_status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.enrollment_status}
                  </span>
                </TableCell>
                <TableCell>{new Date(student.enrollment_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(student)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        initialData={editingStudent}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={`Student ${deletingStudent?.roll_number}`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
