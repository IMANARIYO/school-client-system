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
import { Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Device } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DevicesPage() {
  const { toast } = useToast();
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      user_id: 1,
      device_id: 'device_abc123xyz',
      verified: false,
      created_at: '2024-03-01T10:30:00Z',
    },
    {
      id: 2,
      user_id: 2,
      device_id: 'device_def456uvw',
      verified: true,
      created_at: '2024-02-28T14:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<boolean | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Device | undefined>();

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.user_id.toString().includes(searchQuery);
    const matchesVerified =
      filterVerified === 'ALL' || device.verified === (filterVerified as boolean);
    return matchesSearch && matchesVerified;
  });

  const handleVerifyDevice = (device: Device) => {
    setDevices(
      devices.map((d) => (d.id === device.id ? { ...d, verified: true } : d))
    );
    toast({
      title: 'Device Verified',
      description: 'Device has been verified successfully',
    });
  };

  const handleRevokeDevice = (device: Device) => {
    setDevices(
      devices.map((d) => (d.id === device.id ? { ...d, verified: false } : d))
    );
    toast({
      title: 'Device Revoked',
      description: 'Device verification has been revoked',
    });
  };

  const handleDeleteDevice = (device: Device) => {
    setDeleteTarget(device);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setDevices(devices.filter((d) => d.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Device deleted successfully',
      });
    }
  };

  const verifiedCount = devices.filter((d) => d.verified).length;
  const pendingCount = devices.filter((d) => !d.verified).length;

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Device Management</h1>
            <p className="text-gray-400 mt-1">Manage and verify user devices</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Devices</p>
                <p className="text-3xl font-bold text-blue-500">{devices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Verified</p>
                <p className="text-3xl font-bold text-green-500">{verifiedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Device Records</CardTitle>
            <CardDescription>Total: {filteredDevices.length} devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by device ID or user ID..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterVerified === 'ALL' ? 'ALL' : filterVerified ? 'true' : 'false'}
                onChange={(e) => {
                  if (e.target.value === 'ALL') setFilterVerified('ALL');
                  else setFilterVerified(e.target.value === 'true');
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
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
                      <TableHead>Device ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id} className="border-slate-700">
                        <TableCell className="font-mono text-sm">{device.device_id}</TableCell>
                        <TableCell>#{device.user_id}</TableCell>
                        <TableCell>
                          <Badge
                            variant={device.verified ? 'default' : 'secondary'}
                            className={device.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {device.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(device.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.DEVICE_VERIFY}>
                              {!device.verified && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerifyDevice(device)}
                                  title="Verify"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </Button>
                              )}
                              {device.verified && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevokeDevice(device)}
                                  title="Revoke"
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDevice(device)}
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
          title="Delete Device"
          description="Are you sure you want to delete this device record? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
