// Authentication Types
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface DeviceVerification {
  userId: string;
  device: string;
  code: string;
  verified: boolean;
  verifiedAt?: string;
}

// Academic Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
}

export interface Class {
  id: string;
  name: string;
  classCode: string;
  section: string;
  academicYear: string;
  teacherId: string;
}

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  classId: string;
  enrollmentDate: string;
  parentId?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  examType: ExamType;
  termId: string;
  createdAt: string;
}

export enum ExamType {
  UNIT_TEST = 'unit_test',
  TERM_EXAM = 'term_exam',
  PRACTICAL = 'practical',
  PROJECT = 'project',
  ASSIGNMENT = 'assignment',
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remark?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  LEAVE = 'leave',
}

// Fee Management Types
export interface FeeStructure {
  id: string;
  classId: string;
  feeType: FeeType;
  amount: number;
  dueDate: string;
  academicYear: string;
}

export enum FeeType {
  TUITION = 'tuition',
  TRANSPORT = 'transport',
  SPORTS = 'sports',
  LIBRARY = 'library',
  UNIFORM = 'uniform',
  EXTRA_CURRICULAR = 'extra_curricular',
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  remarks?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CHEQUE = 'cheque',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  ONLINE = 'online',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  totalFeeAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  payments: FeePayment[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export enum NotificationType {
  GRADE_PUBLISHED = 'grade_published',
  ATTENDANCE_ALERT = 'attendance_alert',
  FEE_DUE = 'fee_due',
  ASSIGNMENT_SUBMITTED = 'assignment_submitted',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
}

// Teacher Types
export interface TeacherProfile {
  id: string;
  userId: string;
  employeeId: string;
  department: string;
  qualification: string;
  specialization: string;
  joinDate: string;
  assignedClasses: Class[];
}

// Parent Types
export interface ParentProfile {
  id: string;
  userId: string;
  childrenIds: string[];
  occupation?: string;
  address?: string;
}

// Admin Types
export interface AdminMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalFeeCollected: number;
  pendingFees: number;
  attendancePercentage: number;
}

export interface AdminActions {
  type: AdminActionType;
  targetId: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export enum AdminActionType {
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  CREATE_CLASS = 'create_class',
  UPDATE_CLASS = 'update_class',
  DELETE_CLASS = 'delete_class',
  MANAGE_FEES = 'manage_fees',
  MANAGE_GRADES = 'manage_grades',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface CreateUserForm {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
}

export interface CreateClassForm {
  name: string;
  classCode: string;
  section: string;
  academicYear: string;
  teacherId: string;
}

export interface CreateFeeStructureForm {
  classId: string;
  feeType: FeeType;
  amount: number;
  dueDate: string;
  academicYear: string;
}

export interface RecordAttendanceForm {
  classId: string;
  date: string;
  attendance: Array<{
    studentId: string;
    status: AttendanceStatus;
    remark?: string;
  }>;
}

export interface PublishGradeForm {
  studentId: string;
  subjectId: string;
  marks: number;
  totalMarks: number;
  examType: ExamType;
  termId: string;
}

// Common Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  classId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
