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
import { Trash2, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Attendance, AttendanceStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AttendancePage() {
  const { toast } = useToast();
  
  const [attendance, setAttendance] = useState<Attendance[]>([
    {
      id: 1,
      student_id: 101,
      date: '2024-03-08',
      status: 'present',
      created_at: '2024-03-08T08:30:00Z',
      updated_at: '2024-03-08T08:30:00Z',
    },
    {
      id: 2,
      student_id: 102,
      date: '2024-03-08',
      status: 'absent',
      created_at: '2024-03-08T08:30:00Z',
      updated_at: '2024-03-08T08:30:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Attendance | undefined>();

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch = record.student_id.toString().includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || record.status === filterStatus;
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDeleteRecord = (record: Attendance) => {
    setDeleteTarget(record);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setAttendance(attendance.filter((a) => a.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Attendance record deleted successfully',
      });
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const attendanceStats = {
    present: attendance.filter((a) => a.status === 'present').length,
    absent: attendance.filter((a) => a.status === 'absent').length,
    late: attendance.filter((a) => a.status === 'late').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-gray-400 mt-1">Track and manage student attendance records</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Present</p>
                <p className="text-3xl font-bold text-green-500">{attendanceStats.present}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Absent</p>
                <p className="text-3xl font-bold text-red-500">{attendanceStats.absent}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Late</p>
                <p className="text-3xl font-bold text-yellow-500">{attendanceStats.late}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Total: {filteredAttendance.length} records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by student ID..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AttendanceStatus | 'ALL')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
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
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recorded At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id} className="border-slate-700">
                        <TableCell>#{record.student_id}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(record.created_at || '').toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.ATTENDANCE_UPDATE}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRecord(record)}
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
          title="Delete Record"
          description="Are you sure you want to delete this attendance record? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
