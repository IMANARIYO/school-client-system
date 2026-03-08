'use client';

import React, { useState, useEffect } from 'react';
import { Class } from '@/lib/types';
import { FormDialog } from './FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/lib/api/services/adminService';

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Class | null;
  onSuccess?: () => void;
}

export default function ClassFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: ClassFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    grade_level: initialData?.grade_level || '',
    section: initialData?.section || '',
    capacity: initialData?.capacity || '',
    room_number: initialData?.room_number || '',
    notes: initialData?.notes || '',
    responsible_teacher: initialData?.responsible_teacher || '',
    class_representative: initialData?.class_representative || '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadClasses();
    }
  }, [open]);

  const loadClasses = async () => {
    const response = await adminService.getClasses();
    if (response.success && response.data) {
      setClasses(response.data);
    }
  };

  const validateUniqueAssignment = () => {
    const teacherId = formData.responsible_teacher.trim();
    const studentId = formData.class_representative.trim();

    if (teacherId) {
      const existingClass = classes.find(
        (c) => c.responsible_teacher === teacherId && c.id !== initialData?.id
      );
      if (existingClass) {
        toast({
          title: 'Validation Error',
          description: `Teacher is already assigned to class ${existingClass.name}`,
          variant: 'destructive',
        });
        return false;
      }
    }

    if (studentId) {
      const existingClass = classes.find(
        (c) => c.class_representative === studentId && c.id !== initialData?.id
      );
      if (existingClass) {
        toast({
          title: 'Validation Error',
          description: `Student is already class representative of ${existingClass.name}`,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUniqueAssignment()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (formData.class_representative) {
        const repResponse = await adminService.assignClassRepresentative(
          Number(initialData?.id || 0),
          Number(formData.class_representative)
        );
        if (!repResponse.success) {
          throw new Error(repResponse.error);
        }
      }
      
      if (formData.responsible_teacher) {
        const teacherResponse = await adminService.assignResponsibleTeacher(
          Number(initialData?.id || 0),
          Number(formData.responsible_teacher)
        );
        if (!teacherResponse.success) {
          throw new Error(teacherResponse.error);
        }
      }
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Class' : 'Add New Class'}
      description={initialData ? 'Update class information' : 'Create a new class'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={initialData ? 'Update' : 'Create'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="grade_level">Grade Level *</Label>
            <Input
              id="grade_level"
              value={formData.grade_level}
              onChange={(e) => handleChange('grade_level', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={formData.section}
              onChange={(e) => handleChange('section', e.target.value)}
              placeholder="e.g., A, B, C"
            />
          </div>
          <div>
            <Label htmlFor="room_number">Room Number</Label>
            <Input
              id="room_number"
              value={formData.room_number}
              onChange={(e) => handleChange('room_number', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="responsible_teacher">Responsible Teacher</Label>
            <Input
              id="responsible_teacher"
              value={formData.responsible_teacher}
              onChange={(e) => handleChange('responsible_teacher', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="class_representative">Class Representative (Student ID)</Label>
          <Input
            id="class_representative"
            value={formData.class_representative}
            onChange={(e) => handleChange('class_representative', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional information about the class"
          />
        </div>
      </div>
    </FormDialog>
  );
}
