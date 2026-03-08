'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Teacher, EmploymentType } from '@/lib/types';

interface TeacherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: Teacher;
  onSuccess: (teacher: Teacher) => void;
}

interface TeacherFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  hire_date?: string;
  employment_type?: EmploymentType;
  specialization?: string;
  qualification?: string;
  years_of_experience?: number;
  salary?: number;
}

export function TeacherFormDialog({
  open,
  onOpenChange,
  teacher,
  onSuccess,
}: TeacherFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TeacherFormData>({
    defaultValues: teacher
      ? {
          first_name: teacher.user_id ? '' : '',
          last_name: teacher.user_id ? '' : '',
          email: teacher.email,
          phone: teacher.phone,
          date_of_birth: teacher.date_of_birth,
          gender: teacher.gender,
          hire_date: teacher.hire_date,
          employment_type: teacher.employment_type,
          specialization: teacher.specialization,
          qualification: teacher.qualification,
          years_of_experience: teacher.years_of_experience,
          salary: teacher.salary,
        }
      : {},
  });
  const { toast } = useToast();

  const onSubmit = async (data: TeacherFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTeacher: Teacher = {
        id: teacher?.id || Math.random(),
        user_id: teacher?.user_id || Math.random(),
        ...data,
        status: teacher?.status || 'ACTIVE',
        created_at: teacher?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({
        title: 'Success',
        description: `Teacher ${teacher ? 'updated' : 'created'} successfully.`,
      });

      onSuccess(newTeacher);
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-georgia">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Edit Teacher' : 'Create Teacher'}</DialogTitle>
          <DialogDescription>
            {teacher ? 'Update teacher information' : 'Add a new teacher to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input
                {...register('first_name', { required: 'Required' })}
                placeholder="First name"
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input
                {...register('last_name', { required: 'Required' })}
                placeholder="Last name"
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              {...register('email', { required: 'Required', type: 'email' })}
              placeholder="email@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              {...register('phone')}
              placeholder="Phone number"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <Input
              {...register('specialization')}
              placeholder="Subject specialization"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <Input
              {...register('years_of_experience')}
              type="number"
              placeholder="0"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <LoadingSpinner />}
              {teacher ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
