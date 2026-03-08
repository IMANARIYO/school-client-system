'use client';

import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  options?: Array<{ label: string; value: string }>;
  description?: string;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  required,
  disabled,
  rows,
  options,
  description,
}: FormFieldProps<T>) {
  const { control, formState } = form;
  const error = formState.errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          if (options) {
            return (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          if (type === 'textarea') {
            return (
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows || 3}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            );
          }

          return (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          );
        }}
      />

      {description && <p className="text-xs text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
