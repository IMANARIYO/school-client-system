'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Schedule } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function SchedulesPage() {
  const { toast } = useToast();
  
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      class_id: 1,
      teacher_id: 1,
      subject_id: 1,
      day: 'Monday',
      start_time: '09:00',
      end_time: '10:00',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      class_id: 1,
      teacher_id: 1,
      subject_id: 2,
      day: 'Tuesday',
      start_time: '10:00',
      end_time: '11:00',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | undefined>();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const schedulesByDay = days.map((day) => ({
    day,
    schedules: schedules.filter((s) => s.day === day),
  }));

  const handleDeleteSchedule = (schedule: Schedule) => {
    setDeleteTarget(schedule);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setSchedules(schedules.filter((s) => s.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schedule Management</h1>
            <p className="text-gray-400 mt-1">Manage class schedules and timetables</p>
          </div>
          <PermissionGuard permission={Permission.TIMETABLE_FULL}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Schedule
            </Button>
          </PermissionGuard>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {schedulesByDay.map((daySchedule) => (
              <Card key={daySchedule.day} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>{daySchedule.day}</CardTitle>
                  <CardDescription>{daySchedule.schedules.length} classes scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {daySchedule.schedules.map((schedule) => (
                          <TableRow key={schedule.id} className="border-slate-700">
                            <TableCell>Class {schedule.class_id}</TableCell>
                            <TableCell>Teacher {schedule.teacher_id}</TableCell>
                            <TableCell>Subject {schedule.subject_id}</TableCell>
                            <TableCell>{schedule.start_time}</TableCell>
                            <TableCell>{schedule.end_time}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <PermissionGuard permission={Permission.TIMETABLE_FULL}>
                                  <Button variant="ghost" size="sm">
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSchedule(schedule)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Schedule"
          description="Are you sure you want to delete this schedule entry? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
