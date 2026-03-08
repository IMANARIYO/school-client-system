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
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ParentFormDialog } from '@/components/dialogs/ParentFormDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Parent } from '@/lib/types';

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([
    {
      id: 1,
      user_id: 3,
      phone: '+1234567890',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-03-08T00:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Parent | undefined>();

  const filteredParents = parents.filter((parent) =>
    parent.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateParent = (parent: Parent) => {
    if (selectedParent) {
      setParents(parents.map((p) => (p.id === parent.id ? parent : p)));
    } else {
      setParents([...parents, parent]);
    }
    setSelectedParent(undefined);
  };

  const handleEditParent = (parent: Parent) => {
    setSelectedParent(parent);
    setFormOpen(true);
  };

  const handleDeleteParent = (parent: Parent) => {
    setDeleteTarget(parent);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      setParents(parents.filter((p) => p.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parents Management</h1>
            <p className="text-gray-400 mt-1">Manage all parents in the system</p>
          </div>
          <PermissionGuard permission={Permission.USER_FULL}>
            <Button
              onClick={() => {
                setSelectedParent(undefined);
                setFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Parent
            </Button>
          </PermissionGuard>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Parent List</CardTitle>
            <CardDescription>Total: {filteredParents.length} parents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by phone number..."
                className="pl-10 bg-slate-800 border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      <TableHead>Phone</TableHead>
                      <TableHead>Children Count</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParents.map((parent) => (
                      <TableRow key={parent.id} className="border-slate-700">
                        <TableCell>{parent.phone}</TableCell>
                        <TableCell>{parent.user_id ? '2' : '0'}</TableCell>
                        <TableCell>{new Date(parent.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.USER_FULL}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditParent(parent)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteParent(parent)}
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

        <ParentFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          parent={selectedParent}
          onSuccess={handleCreateParent}
        />

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Parent"
          description="Are you sure you want to delete this parent? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
