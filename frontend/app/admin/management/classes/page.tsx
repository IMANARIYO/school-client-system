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
import { Edit2, Trash2 } from 'lucide-react';
import { Class } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import ClassFormDialog from '@/components/dialogs/ClassFormDialog';
import { dummyClasses } from '@/lib/api/dummyData';

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setClasses([...dummyClasses] as any);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    setDeletingClass(classItem);
    setDeleteOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingClass(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadClasses();
    toast({
      title: 'Success',
      description: editingClass ? 'Class updated successfully' : 'Class created successfully',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingClass) return;
    
    try {
      const updated = classes.map((c) =>
        c.id === deletingClass.id ? { ...c, deleted_at: new Date().toISOString() } : c
      );
      setClasses(updated);
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive',
      });
    } finally {
      setDeleteOpen(false);
      setDeletingClass(null);
    }
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.grade_level.includes(searchTerm)
  );

  if (isLoading && classes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Classes Management</h1>
        <Button onClick={handleCreate}>Add Class</Button>
      </div>

      <Input
        placeholder="Search by name or grade level..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell className="font-medium">{classItem.name}</TableCell>
                <TableCell>{classItem.grade_level}</TableCell>
                <TableCell>{classItem.section || '-'}</TableCell>
                <TableCell>{classItem.room_number || '-'}</TableCell>
                <TableCell>{classItem.capacity || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(classItem)}
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

      <ClassFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        initialData={editingClass}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={`Class ${deletingClass?.name}`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
