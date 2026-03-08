'use client';

import React, { useState } from 'react';
import { Student, EnrollmentStatus } from '@/lib/types';
import { studentService } from '@/lib/api/services/studentService';
import { FormDialog } from './FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Student | null;
  onSuccess?: () => void;
}

export default function StudentFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: StudentFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    user_id: initialData?.user_id || '',
    parent_id: initialData?.parent_id || '',
    class_id: initialData?.class_id || '',
    date_of_birth: initialData?.date_of_birth || '',
    gender: initialData?.gender || '',
    place_of_birth: initialData?.place_of_birth || '',
    enrollment_date: initialData?.enrollment_date || new Date().toISOString().split('T')[0],
    roll_number: initialData?.roll_number || '',
    current_grade: initialData?.current_grade || '',
    section: initialData?.section || '',
    previous_school: initialData?.previous_school || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    blood_group: initialData?.blood_group || '',
    medical_conditions: initialData?.medical_conditions || '',
    special_needs: initialData?.special_needs || '',
    enrollment_status: initialData?.enrollment_status || 'ACTIVE',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData) {
        const response = await studentService.updateStudent(initialData.id, formData);
        if (response.success) {
          onSuccess?.();
        } else {
          toast({
            title: 'Error',
            description: response.error || 'Failed to update student',
            variant: 'destructive',
          });
        }
      } else {
        const response = await studentService.createStudent(formData);
        if (response.success) {
          onSuccess?.();
        } else {
          toast({
            title: 'Error',
            description: response.error || 'Failed to create student',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
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
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? 'Edit Student' : 'Add New Student'}
      description={initialData ? 'Update student information' : 'Create a new student account'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={initialData ? 'Update' : 'Create'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="user_id">User ID *</Label>
            <Input
              id="user_id"
              type="number"
              value={formData.user_id}
              onChange={(e) => handleChange('user_id', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="parent_id">Parent ID</Label>
            <Input
              id="parent_id"
              type="number"
              value={formData.parent_id}
              onChange={(e) => handleChange('parent_id', e.target.value ? Number(e.target.value) : '')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="roll_number">Roll Number</Label>
            <Input
              id="roll_number"
              value={formData.roll_number}
              onChange={(e) => handleChange('roll_number', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="class_id">Class ID</Label>
            <Input
              id="class_id"
              type="number"
              value={formData.class_id}
              onChange={(e) => handleChange('class_id', e.target.value ? Number(e.target.value) : '')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current_grade">Grade</Label>
            <Input
              id="current_grade"
              value={formData.current_grade}
              onChange={(e) => handleChange('current_grade', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={formData.section}
              onChange={(e) => handleChange('section', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="enrollment_date">Enrollment Date *</Label>
            <Input
              id="enrollment_date"
              type="date"
              value={formData.enrollment_date}
              onChange={(e) => handleChange('enrollment_date', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="enrollment_status">Enrollment Status</Label>
            <Select
              value={formData.enrollment_status}
              onValueChange={(value) => handleChange('enrollment_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="GRADUATED">Graduated</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="blood_group">Blood Group</Label>
            <Input
              id="blood_group"
              value={formData.blood_group}
              onChange={(e) => handleChange('blood_group', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="place_of_birth">Place of Birth</Label>
            <Input
              id="place_of_birth"
              value={formData.place_of_birth}
              onChange={(e) => handleChange('place_of_birth', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="previous_school">Previous School</Label>
          <Input
            id="previous_school"
            value={formData.previous_school}
            onChange={(e) => handleChange('previous_school', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="medical_conditions">Medical Conditions</Label>
          <Input
            id="medical_conditions"
            value={formData.medical_conditions}
            onChange={(e) => handleChange('medical_conditions', e.target.value)}
            placeholder="e.g., Asthma, Allergies"
          />
        </div>

        <div>
          <Label htmlFor="special_needs">Special Needs</Label>
          <Input
            id="special_needs"
            value={formData.special_needs}
            onChange={(e) => handleChange('special_needs', e.target.value)}
            placeholder="e.g., Wheelchair accessibility"
          />
        </div>
      </div>
    </FormDialog>
  );
}
