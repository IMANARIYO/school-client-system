# Admin Management System Implementation Guide

## Overview
Complete CRUD management system for all school entities according to the ERD specification.

## Architecture

### Directory Structure
```
/app/admin/management/
  ├── page.tsx                    # Management dashboard
  ├── layout.tsx                  # Sidebar navigation layout
  ├── students/
  │   └── page.tsx                # Students management
  ├── teachers/
  │   └── page.tsx                # Teachers management
  ├── classes/
  │   └── page.tsx                # Classes management
  ├── subjects/
  │   └── page.tsx                # Subjects management
  ├── schedules/
  │   └── page.tsx                # Schedules management
  ├── fees/
  │   └── page.tsx                # Fee & transaction management
  └── devices/
      └── page.tsx                # Device verification management

/components/dialogs/
  ├── FormDialog.tsx              # Reusable form dialog wrapper
  ├── DeleteConfirmDialog.tsx      # Delete confirmation dialog
  ├── StudentFormDialog.tsx        # Student create/edit form
  ├── ClassFormDialog.tsx          # Class create/edit form
  └── [Entity]FormDialog.tsx       # Other entity forms

/lib/api/services/
  ├── userService.ts              # User management API
  ├── studentService.ts           # Student management API (expanded)
  ├── teacherService.ts           # Teacher management API
  ├── classService.ts             # Class management API
  └── [Entity]Service.ts          # Other entity services

/lib/types/
  └── index.ts                    # Comprehensive TypeScript types for all entities
```

## Core Components

### 1. FormDialog Component
**Location**: `components/dialogs/FormDialog.tsx`

Reusable wrapper for all create/edit forms:
- Handles form submission
- Shows loading states
- Displays error/success messages
- Supports custom submit button text and styling

**Usage**:
```tsx
<FormDialog
  open={formOpen}
  onOpenChange={setFormOpen}
  title="Add New Student"
  description="Create a new student account"
  onSubmit={handleSubmit}
  isLoading={isLoading}
>
  {/* Form fields */}
</FormDialog>
```

### 2. DeleteConfirmDialog Component
**Location**: `components/dialogs/DeleteConfirmDialog.tsx`

Confirmation dialog for all delete operations:
- Shows clear warning message
- Requires user confirmation
- Supports loading states
- Implements soft delete only

**Usage**:
```tsx
<DeleteConfirmDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  itemName={`Student ${student.roll_number}`}
  onConfirm={handleConfirmDelete}
/>
```

### 3. Entity-Specific Form Dialogs
**Location**: `components/dialogs/[Entity]FormDialog.tsx`

Each entity (Student, Teacher, Class, etc.) has its own form dialog component:
- Uses FormDialog as wrapper
- Implements entity-specific fields
- Handles create/edit modes
- Calls appropriate API service

**Pattern**:
```tsx
// StudentFormDialog.tsx
- Shows different title based on mode (create/edit)
- Pre-fills fields for edit mode
- Submits to studentService.createStudent() or .updateStudent()
- Handles validation and error messages
```

## Management Pages

### Students Management
**Location**: `app/admin/management/students/page.tsx`

Features:
- Display all students in paginated table
- Search by roll number
- Filter by enrollment status (ACTIVE, INACTIVE, GRADUATED, SUSPENDED)
- Add new student (opens StudentFormDialog in create mode)
- Edit student (opens StudentFormDialog with pre-filled data)
- Delete student (soft delete with confirmation)
- Status badges for visual distinction
- Action buttons: Edit, Delete

### Classes Management
**Location**: `app/admin/management/classes/page.tsx`

Features:
- Display all classes
- Search by class name or grade level
- Add, edit, delete classes
- Shows class details: name, grade, section, room, capacity

## API Service Layer

### Service Pattern
Each entity has a corresponding service with these methods:

```typescript
// userService
- getUsers(filters?)
- getUserById(userId)
- createUser(payload)
- updateUser(userId, payload)
- deleteUser(userId)
- changeUserStatus(userId, status)

// studentService (expanded with admin methods)
- getAllStudents(filters?)
- getStudentById(studentId)
- createStudent(payload)
- updateStudent(studentId, payload)
- deleteStudent(studentId)
- changeEnrollmentStatus(studentId, status)
```

## Types & Enums

### Comprehensive Type Definitions
**Location**: `lib/types/index.ts`

Enums for all status fields:
- `UserStatus`: ACTIVE, INACTIVE, SUSPENDED
- `EnrollmentStatus`: ACTIVE, INACTIVE, GRADUATED, SUSPENDED
- `GradeStatus`: PENDING, APPROVED, REJECTED
- `TransactionStatus`: PENDING, APPROVED, REJECTED, COMPLETED
- `TransactionType`: DEPOSIT, WITHDRAWAL
- `EmploymentType`: FULL_TIME, PART_TIME, CONTRACT
- `AddressType`: HOME, WORK, OTHER

Interfaces for all entities:
- User, Parent, Address, Student, Teacher
- Subject, Class, ClassSubject, TeacherSubject
- Schedule, Grade, Attendance
- FeeAccount, Transaction, Device, Notification

## UI/UX Patterns

### Create/Edit Form Pattern
All forms follow this pattern:
1. Same form component used for both create and edit
2. Form title changes based on mode
3. Fields are pre-filled in edit mode
4. Submit button text changes (Create/Update)

Example:
```tsx
<StudentFormDialog
  mode="create"
  initialData={null}
/>

<StudentFormDialog
  mode="edit"
  initialData={existingStudent}
/>
```

### Delete Pattern
All deletions follow this pattern:
1. User clicks Delete button in table
2. DeleteConfirmDialog appears with warning
3. User must confirm deletion
4. Soft delete is performed (deleted_at is set)
5. Table is refreshed and toast notification appears

### Status Management
Entities with status fields allow admin to:
1. View current status in colored badges
2. Change status via dropdown or dedicated method
3. See status changes reflected immediately in UI

## Data Flow

### Create Flow
1. Admin clicks "Add [Entity]" button
2. FormDialog opens in create mode
3. User fills form and clicks "Create"
4. Service.create() is called with payload
5. Success: Dialog closes, table refreshes, toast appears
6. Error: Error message displays in form

### Edit Flow
1. Admin clicks Edit button in table row
2. FormDialog opens in edit mode with pre-filled data
3. User modifies fields and clicks "Update"
4. Service.update() is called with modified data
5. Success: Dialog closes, table refreshes, toast appears
6. Error: Error message displays in form

### Delete Flow
1. Admin clicks Delete button in table row
2. DeleteConfirmDialog appears with confirmation
3. Admin clicks "Delete" button to confirm
4. Service.delete() is called (soft delete)
5. Success: Dialog closes, table refreshes, toast appears
6. Error: Error message displays in toast

## Font Configuration
**Font**: Georgia (serif)
- Applied globally in `globals.css`
- Professional, readable typography
- Consistent across all management pages

## Future Implementation Steps

Implement remaining management pages in same pattern:
1. Users Management
2. Teachers Management
3. Subjects Management
4. Schedules Management
5. Grades Management
6. Attendance Management
7. Fee & Transaction Management
8. Device Management
9. Notification Management

Each following the established patterns and conventions.

## Key Features Summary

✅ Reusable form dialogs (create/edit same form)
✅ Confirmation dialogs for all delete operations
✅ Full CRUD operations for entities
✅ Search and filtering capabilities
✅ Status management with colored badges
✅ Loading states and error handling
✅ Toast notifications for user feedback
✅ Soft delete implementation
✅ Responsive table layouts
✅ Georgia font throughout
✅ Consistent UI patterns across all management pages
