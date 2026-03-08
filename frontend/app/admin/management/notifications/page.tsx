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
import { Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Notification, NotificationType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      user_id: 1,
      title: 'Grade Published',
      message: 'Your grades for Term 1 have been published',
      type: 'grade_published',
      is_read: false,
      created_at: '2024-03-08T10:30:00Z',
    },
    {
      id: 2,
      user_id: 2,
      title: 'Fee Due',
      message: 'Your fee payment is due on 2024-03-15',
      type: 'fee_due',
      is_read: true,
      created_at: '2024-03-05T14:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL');
  const [filterRead, setFilterRead] = useState<boolean | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notification | undefined>();

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || notif.type === filterType;
    const matchesRead = filterRead === 'ALL' || notif.is_read === (filterRead as boolean);
    return matchesSearch && matchesType && matchesRead;
  });

  const handleMarkAsRead = (notif: Notification) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
    );
    toast({
      title: 'Success',
      description: 'Notification marked as read',
    });
  };

  const handleMarkAsUnread = (notif: Notification) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, is_read: false } : n))
    );
  };

  const handleDeleteNotification = (notif: Notification) => {
    setDeleteTarget(notif);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setNotifications(notifications.filter((n) => n.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Notification deleted successfully',
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'grade_published':
        return 'bg-blue-100 text-blue-800';
      case 'attendance_alert':
        return 'bg-red-100 text-red-800';
      case 'fee_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'fee_paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'grade_published':
        return 'Grade Published';
      case 'attendance_alert':
        return 'Attendance Alert';
      case 'fee_due':
        return 'Fee Due';
      case 'fee_paid':
        return 'Fee Paid';
      default:
        return 'General';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications Management</h1>
            <p className="text-gray-400 mt-1">Manage system notifications</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Notifications</p>
                <p className="text-3xl font-bold text-blue-500">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Unread</p>
                <p className="text-3xl font-bold text-red-500">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Read</p>
                <p className="text-3xl font-bold text-green-500">{notifications.length - unreadCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Notification Records</CardTitle>
            <CardDescription>All system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as NotificationType | 'ALL')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Types</option>
                <option value="grade_published">Grade Published</option>
                <option value="attendance_alert">Attendance Alert</option>
                <option value="fee_due">Fee Due</option>
                <option value="fee_paid">Fee Paid</option>
              </select>
              <select
                value={filterRead === 'ALL' ? 'ALL' : filterRead ? 'true' : 'false'}
                onChange={(e) => {
                  if (e.target.value === 'ALL') setFilterRead('ALL');
                  else setFilterRead(e.target.value === 'true');
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Status</option>
                <option value="true">Read</option>
                <option value="false">Unread</option>
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
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notif) => (
                      <TableRow
                        key={notif.id}
                        className={`border-slate-700 ${!notif.is_read ? 'bg-slate-800' : ''}`}
                      >
                        <TableCell className="font-semibold">{notif.title}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(notif.type)}>
                            {getTypeLabel(notif.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{notif.message}</TableCell>
                        <TableCell>#{notif.user_id}</TableCell>
                        <TableCell>
                          <Badge variant={notif.is_read ? 'secondary' : 'default'}>
                            {notif.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(notif.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!notif.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notif)}
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {notif.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsUnread(notif)}
                                title="Mark as unread"
                              >
                                <EyeOff className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notif)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
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
          title="Delete Notification"
          description="Are you sure you want to delete this notification? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
