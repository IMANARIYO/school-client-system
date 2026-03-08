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
import { Parent } from '@/lib/types';

interface ParentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent?: Parent;
  onSuccess: (parent: Parent) => void;
}

interface ParentFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export function ParentFormDialog({
  open,
  onOpenChange,
  parent,
  onSuccess,
}: ParentFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ParentFormData>({
    defaultValues: parent
      ? {
          first_name: '',
          last_name: '',
          email: '',
          phone: parent.phone,
          address_line1: '',
          country: '',
        }
      : {},
  });
  const { toast } = useToast();

  const onSubmit = async (data: ParentFormData) => {
    try {
      setIsLoading(true);
      
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newParent: Parent = {
        id: parent?.id || Math.random(),
        user_id: parent?.user_id || Math.random(),
        phone: data.phone,
        created_at: parent?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({
        title: 'Success',
        description: `Parent ${parent ? 'updated' : 'created'} successfully.`,
      });

      onSuccess(newParent);
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save parent. Please try again.',
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
          <DialogTitle>{parent ? 'Edit Parent' : 'Create Parent'}</DialogTitle>
          <DialogDescription>
            {parent ? 'Update parent information' : 'Add a new parent to the system'}
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
              {...register('phone', { required: 'Required' })}
              placeholder="Phone number"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address Line 1</label>
            <Input
              {...register('address_line1', { required: 'Required' })}
              placeholder="Street address"
              disabled={isLoading}
            />
            {errors.address_line1 && (
              <p className="text-red-500 text-xs mt-1">{errors.address_line1.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              {...register('city', { required: 'Required' })}
              placeholder="City"
              disabled={isLoading}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input
                {...register('state')}
                placeholder="State"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <Input
                {...register('postal_code')}
                placeholder="Postal code"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <Input
              {...register('country', { required: 'Required' })}
              placeholder="Country"
              disabled={isLoading}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
            )}
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
              {parent ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
