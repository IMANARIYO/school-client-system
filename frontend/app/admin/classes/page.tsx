'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAdminStore } from '@/lib/stores/adminStore';
import { adminService } from '@/lib/api/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function ClassesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useAdminStore((state) => state.classes);
  const setClasses = useAdminStore((state) => state.setClasses);
  const deleteClass = useAdminStore((state) => state.deleteClass);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getClasses();
        if (response.success && response.data) {
          setClasses(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, [setClasses]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading classes..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Classes Management</h1>
            <p className="text-slate-400 mt-2">Manage all school classes and sections</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Add Class
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white text-lg">{classItem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-slate-400 text-xs uppercase">Code</p>
                    <p className="text-white font-semibold">{classItem.classCode}</p>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-slate-400 text-xs uppercase">Section</p>
                    <p className="text-white font-semibold">{classItem.section}</p>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-slate-400 text-xs uppercase">Academic Year</p>
                    <p className="text-white font-semibold">{classItem.academicYear}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-blue-400 border-blue-500 hover:bg-blue-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => deleteClass(classItem.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
