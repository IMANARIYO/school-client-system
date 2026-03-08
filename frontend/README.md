# EduManage - School Management System

A modern, role-based school management system built with Next.js, Zustand, and TypeScript. The application serves four distinct user roles: **Admins**, **Teachers**, **Students**, and **Parents**, each with tailored dashboards and features.

## Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 16 with App Router
- **State Management**: Zustand (lightweight, performant)
- **API Client**: Axios with JWT interceptors
- **Form Handling**: React Hook Form
- **UI Components**: shadcn/ui + Tailwind CSS
- **Type Safety**: Full TypeScript with proper interfaces (NO `any` types)

### Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js app router
│   ├── login/                    # Authentication page
│   ├── admin/                    # Admin route group
│   │   ├── dashboard/            # Overview & metrics
│   │   ├── users/                # User management
│   │   └── classes/              # Class management
│   ├── teacher/                  # Teacher route group
│   │   ├── dashboard/            # Class & performance overview
│   │   ├── grades/               # Grade publishing & view
│   │   └── attendance/           # Attendance recording
│   ├── student/                  # Student route group
│   │   ├── dashboard/            # Academic overview
│   │   ├── grades/               # Grade visualization
│   │   └── fees/                 # Fee status & payment
│   ├── parent/                   # Parent route group
│   │   ├── dashboard/            # Children's overview
│   │   └── fees/                 # Family fee management
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Redirect to role-based dashboard
│   └── globals.css               # Global styles
│
├── components/
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── Header.tsx            # Top navigation bar
│   │   └── MainLayout.tsx        # Main app layout wrapper
│   ├── providers/
│   │   └── AuthProvider.tsx      # Auth initialization
│   ├── common/                   # Reusable components
│   │   ├── StatCard.tsx          # Metric display card
│   │   ├── LoadingSpinner.tsx    # Loading state
│   │   └── ErrorAlert.tsx        # Error messages
│   └── ui/                       # shadcn/ui components (pre-installed)
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces & enums
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts          # Auth state
│   │   ├── adminStore.ts         # Admin data (users, classes, etc)
│   │   ├── academicStore.ts      # Grades & attendance
│   │   ├── feeStore.ts           # Fee data
│   │   └── notificationStore.ts  # Notifications
│   ├── api/
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── dummyData.ts          # In-memory dummy data (for development)
│   │   └── services/             # API service layers
│   │       ├── authService.ts
│   │       ├── adminService.ts
│   │       ├── academicService.ts
│   │       └── feeService.ts
│   └── utils.ts                  # shadcn utilities (cn function)
│
├── middleware.ts                 # Route protection & redirects
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config with @ alias
└── tailwind.config.ts            # Tailwind configuration
```

## Key Features

### Authentication & Authorization
- Login system with role-based access control
- Token-based authentication with JWT
- Automatic logout on 401 Unauthorized
- Protected routes via middleware
- Device verification ready (mock implementation)

### Admin Dashboard
- **Metrics**: Total students, teachers, classes, fees, attendance
- **User Management**: Create, read, update, delete users
- **Class Management**: Manage classes and sections
- **Analytics**: Key performance indicators and trends

### Teacher Dashboard
- **Class Overview**: View assigned classes and student counts
- **Grade Management**: Publish and manage student grades
- **Attendance**: Record and track student attendance
- **Quick Actions**: Direct links to common tasks

### Student Dashboard
- **Academic Performance**: View grades and average performance
- **Attendance**: Track attendance percentage
- **Fee Status**: View payment history and pending amounts
- **Responsive Cards**: Visual representation of performance metrics

### Parent Dashboard
- **Children Overview**: Monitor all children's progress
- **Unified Fee Management**: View all children's fees
- **Academic Tracking**: See grades and attendance
- **Payment Alerts**: Outstanding fee notifications

## Code Quality Standards

### Type Safety
- ✅ **No `any` types** - All code uses proper TypeScript interfaces
- ✅ **Enum usage** - UserRole, ExamType, PaymentStatus, etc.
- ✅ **Interface definitions** - Comprehensive types in `lib/types.ts`

### Component Organization
- ✅ **Reusable components** - StatCard, LoadingSpinner, ErrorAlert
- ✅ **Modular imports** - All imports use `@/` absolute path alias
- ✅ **Separation of concerns** - Stores, services, components clearly separated
- ✅ **No duplication** - Shared components extracted into `components/common`

### State Management
- ✅ **Zustand stores** - Lightweight, performant state
- ✅ **API service layer** - Abstraction for easy backend swap
- ✅ **Dummy data hooks** - In-memory data for development/testing

### API Integration
- ✅ **Service layer pattern** - Easy to swap dummy data with real APIs
- ✅ **Axios interceptors** - Automatic token injection & error handling
- ✅ **Typed responses** - ApiResponse<T> for all API calls
- ✅ **Async/await pattern** - Modern async operations

## Demo Credentials

Test the application with these credentials:

```
Admin:    admin@school.com / password
Teacher:  john.doe@school.com / password
Student:  alice@school.com / password
Parent:   parent.alice@school.com / password
```

## Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Project Setup Notes
- TypeScript path alias `@/` is configured in `tsconfig.json`
- Middleware protects routes automatically
- All API services are ready for production API swap
- Dummy data is completely isolated in `lib/api/dummyData.ts`

## Swapping Dummy Data with Real APIs

The architecture is designed for easy backend integration:

### Step 1: Update API Service
```typescript
// lib/api/services/authService.ts
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{...}>> {
    // Replace dummy implementation with real API call
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  // ... other methods
};
```

### Step 2: Configure API URL
```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### Step 3: Done!
No changes needed in components or stores. They'll automatically use real data.

## Form Handling

React Hook Form is configured without Zod. Add custom validation:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormType>();

<input {...register('email', { required: 'Email is required' })} />
{errors.email && <p>{errors.email.message}</p>}
```

## Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui Components**: Pre-configured, customizable
- **Dark Theme**: Slate color palette with blue/green accents
- **Responsive**: Mobile-first design with breakpoints

## State Management Flow

```
User Actions → React Hook Form
   ↓
Components dispatch actions to Zustand Stores
   ↓
Stores update local state
   ↓
API Services called for backend sync
   ↓
Components re-render with new state
```

## Next Steps for Production

1. **Backend API Integration**
   - Replace dummy services with real API calls
   - Update environment variables
   - Test with staging API

2. **Authentication Enhancement**
   - Implement proper JWT token refresh
   - Add password reset flow
   - Device verification implementation

3. **Additional Features**
   - Real-time notifications (WebSocket/SSE)
   - File uploads (documents, images)
   - Advanced search and filtering
   - Reporting and export functionality

4. **Testing**
   - Unit tests for utilities and services
   - Component testing with React Testing Library
   - E2E tests with Playwright/Cypress

5. **Performance**
   - Image optimization
   - Code splitting by route
   - Database query optimization
   - Caching strategies

6. **Security**
   - Rate limiting
   - CSRF protection
   - Input validation & sanitization
   - Audit logging

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT

---

**Built with ❤️ using Next.js, Zustand, and TypeScript**
