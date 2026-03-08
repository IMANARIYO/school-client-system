# Developer Guide - School Management System Frontend

## Quick Start

### Permission System

#### Check User Permissions
```typescript
import { useAuthStore } from '@/lib/stores/authStore';
import { hasPermission, Permission } from '@/lib/permissions';

const user = useAuthStore((state) => state.user);
if (hasPermission(user.role, Permission.GRADES_UPDATE)) {
  // Show edit button
}
```

#### Guard Components
```typescript
// Role-based access
<RoleGuard requiredRole={UserRole.ADMIN}>
  <AdminContent />
</RoleGuard>

// Permission-based access
<PermissionGuard permission={Permission.GRADES_UPDATE}>
  <EditButton />
</PermissionGuard>

// Multiple permissions (any)
<PermissionGuard permission={[Permission.USER_CREATE, Permission.USER_READ]}>
  <Button>View/Create Users</Button>
</PermissionGuard>

// Multiple permissions (all required)
<PermissionGuard permission={[Permission.GRADES_VIEW, Permission.GRADES_UPDATE]} requireAll>
  <GradeEditor />
</PermissionGuard>
```

---

## Available Permissions

### User Management
- `USER_CREATE` - Create new users
- `USER_READ` - View users
- `USER_UPDATE` - Edit users
- `USER_DELETE` - Delete users
- `USER_FULL` - All user operations

### Grade Management
- `GRADES_VIEW` - View grades
- `GRADES_UPDATE` - Update/approve grades
- `GRADES_FULL` - Full grade control

### Attendance
- `ATTENDANCE_VIEW` - View attendance
- `ATTENDANCE_UPDATE` - Mark/update attendance
- `ATTENDANCE_FULL` - Full attendance control

### Fee Management
- `FEE_VIEW` - View fees/transactions
- `FEE_DEPOSIT` - Deposit fees
- `FEE_WITHDRAW` - Withdraw fees
- `FEE_FULL` - Full fee control

### Class Management
- `CLASS_VIEW` - View classes
- `CLASS_MANAGE` - Manage classes
- `CLASS_FULL` - Full class control

### Teacher Management
- `TEACHER_VIEW` - View teachers
- `TEACHER_ASSIGN` - Assign teachers
- `TEACHER_FULL` - Full teacher control

### Device Management
- `DEVICE_VERIFY` - Verify devices
- `DEVICE_FULL` - Full device control

### Timetable
- `TIMETABLE_VIEW` - View timetable
- `TIMETABLE_FULL` - Manage timetable

---

## Form Components

### TeacherFormDialog
```typescript
import { TeacherFormDialog } from '@/components/dialogs/TeacherFormDialog';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();

  const handleSuccess = (teacher: Teacher) => {
    // Handle saved teacher
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Teacher</Button>
      <TeacherFormDialog
        open={open}
        onOpenChange={setOpen}
        teacher={selectedTeacher}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

### ParentFormDialog
```typescript
import { ParentFormDialog } from '@/components/dialogs/ParentFormDialog';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent>();

  const handleSuccess = (parent: Parent) => {
    // Handle saved parent
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Parent</Button>
      <ParentFormDialog
        open={open}
        onOpenChange={setOpen}
        parent={selectedParent}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

---

## Management Page Patterns

### Table with CRUD Operations
```typescript
'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

export default function EntityPage() {
  const [items, setItems] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setItems(items.filter((i) => i.id !== deleteTarget.id));
    setDeleteConfirmOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Entity Management</h1>
          <PermissionGuard permission={Permission.ENTITY_CREATE}>
            <Button>Add Entity</Button>
          </PermissionGuard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column 1</TableHead>
                  <TableHead>Column 2</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.col1}</TableCell>
                    <TableCell>{item.col2}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <PermissionGuard permission={Permission.ENTITY_UPDATE}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={Permission.ENTITY_DELETE}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
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
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Entity"
          description="Are you sure? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
```

---

## Role-Based Dashboard Template

```typescript
'use client';

import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserRole } from '@/lib/types';
import { MainLayout } from '@/components/layout/MainLayout';

export default function RoleDashboard() {
  return (
    <RoleGuard requiredRole={UserRole.ADMIN}>
      <MainLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* StatCard components */}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart components */}
          </div>
        </div>
      </MainLayout>
    </RoleGuard>
  );
}
```

---

## Common UI Patterns

### Search and Filter
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');

const filtered = items.filter((item) => {
  const matchesSearch = item.name.includes(searchQuery);
  const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
  return matchesSearch && matchesStatus;
});

// In JSX:
<div className="flex gap-4">
  <Input
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value as Status | 'ALL')}
  >
    <option value="ALL">All Status</option>
    <option value="ACTIVE">Active</option>
    <option value="INACTIVE">Inactive</option>
  </select>
</div>
```

### Loading State
```typescript
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

{isLoading ? (
  <div className="flex justify-center py-8">
    <LoadingSpinner />
  </div>
) : (
  // Content
)}
```

### Toast Notifications
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success
toast({
  title: 'Success',
  description: 'Operation completed successfully',
});

// Error
toast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'destructive',
});
```

### Status Badge
```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
  {status}
</Badge>
```

---

## Type Definitions

### Key Types
```typescript
// User
interface User {
  id: number;
  email: string;
  role: UserRole;
  status: string;
  created_at: string;
}

// Teacher
interface Teacher {
  id: number;
  user_id: number;
  email: string;
  phone?: string;
  specialization?: string;
  years_of_experience?: number;
  salary?: number;
  status: string;
}

// Grade
interface Grade {
  id: number;
  student_id: number;
  teacher_id: number;
  score: number;
  grade: string;
  status: GradeStatus;
  term: string;
  academic_year: string;
}

// Transaction
interface Transaction {
  id: number;
  student_id: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  created_at: string;
}
```

---

## API Service Patterns

```typescript
import { academicService } from '@/lib/api/services/academicService';

// Get all grades
const grades = await academicService.getGrades({
  page: 1,
  limit: 10,
  studentId: 123,
});

// Create grade
const newGrade = await academicService.createGrade({
  student_id: 123,
  score: 85,
  grade: 'A',
});

// Update grade
const updated = await academicService.updateGrade(gradeId, {
  score: 90,
  status: 'APPROVED',
});

// Delete grade
await academicService.deleteGrade(gradeId);
```

---

## Component Reusability Checklist

- ✅ Props are typed
- ✅ Callbacks handle loading states
- ✅ Error states are handled
- ✅ Accessibility attributes present
- ✅ Responsive design included
- ✅ Clear prop documentation
- ✅ Exported from index files

---

## Performance Tips

1. **Use Zustand stores** for shared state instead of prop drilling
2. **Memoize components** with `React.memo` when needed
3. **Use SWR** for data fetching with automatic caching
4. **Lazy load** heavy components
5. **Optimize images** with Next.js Image component
6. **Minimize re-renders** with proper dependency arrays

---

## Debugging Tips

### Permission Issues
```typescript
// Check if user has permission
const user = useAuthStore((state) => state.user);
console.log('User role:', user.role);
console.log('Has GRADES_UPDATE:', hasPermission(user.role, Permission.GRADES_UPDATE));
```

### Form Issues
```typescript
// Watch form state
const { watch } = useForm();
console.log('Form state:', watch());

// Check validation errors
console.log('Errors:', formState.errors);
```

### State Management
```typescript
// Check Zustand store
const user = useAuthStore((state) => state.user);
console.log('Auth state:', user);
```

---

## File Naming Conventions

- **Pages:** `page.tsx`
- **Components:** `ComponentName.tsx`
- **Dialogs:** `ComponentNameDialog.tsx`
- **Services:** `entityService.ts`
- **Stores:** `entityStore.ts`
- **Types:** `index.ts` or `types.ts`
- **Utils:** `utils.ts`

---

## Folder Structure

```
/app
  /admin
    /management
      /[entity]
        page.tsx        # Management page
  /[role]
    /[feature]
      page.tsx         # Feature page

/components
  /dialogs              # Form dialogs
  /guards               # RoleGuard, PermissionGuard
  /common               # Reusable utilities
  /layout               # Layout components

/lib
  permissions.ts        # Permission system
  types.ts              # Type definitions
  /stores               # Zustand stores
  /api
    /services           # API service layer
```

---

## Common Issues & Solutions

### Issue: Permission Guard Not Working
**Solution:** Ensure user is logged in and role is set in auth store
```typescript
const user = useAuthStore((state) => state.user);
if (!user) return <div>Not authenticated</div>;
```

### Issue: Form Not Submitting
**Solution:** Check validation errors
```typescript
const { formState: { errors } } = useForm();
console.log('Validation errors:', errors);
```

### Issue: Deleted Item Still Showing
**Solution:** Update state immediately or refetch
```typescript
setItems(items.filter((i) => i.id !== deletedId));
```

---

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## Resources

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)

---

## Getting Help

1. Check existing implementation examples in management pages
2. Review type definitions in `lib/types.ts`
3. Check permission system in `lib/permissions.ts`
4. Refer to existing dialogs for form patterns
5. Check error logs in browser console

---

**Last Updated:** March 8, 2024
**Version:** 1.0
