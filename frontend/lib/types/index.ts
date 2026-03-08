// User and Authentication Types
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

export enum FeeType {
  TUITION = 'tuition',
  TRANSPORT = 'transport',
  SPORTS = 'sports',
  LAB = 'lab',
  MISCELLANEOUS = 'miscellaneous',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  ONLINE = 'online',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ExamType {
  UNIT_TEST = 'unit_test',
  TERM_EXAM = 'term_exam',
  ASSIGNMENT = 'assignment',
}

export enum NotificationType {
  GRADE_PUBLISHED = 'grade_published',
  ATTENDANCE_ALERT = 'attendance_alert',
  FEE_DUE = 'fee_due',
  FEE_PAID = 'fee_paid',
  GENERAL = 'general',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  SUSPENDED = 'SUSPENDED',
}

export enum GradeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER',
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  phone?: string;
  profile_picture?: string;
  status: UserStatus;
  last_login?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Parent {
  id: number;
  user_id: number;
  phone: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Address {
  id: number;
  parent_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  type: AddressType;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  parent_id?: number;
  class_id?: number;
  date_of_birth: string;
  gender: string;
  place_of_birth?: string;
  enrollment_date: string;
  enrollment_status: EnrollmentStatus;
  roll_number?: string;
  current_grade?: string;
  section?: string;
  previous_school?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  medical_conditions?: string;
  special_needs?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Teacher {
  id: number;
  user_id: number;
  date_of_birth?: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  medical_conditions?: string;
  hire_date?: string;
  employment_type?: EmploymentType;
  specialization?: string;
  qualification?: string;
  years_of_experience?: number;
  subjects_can_teach?: string;
  grade_levels_can_teach?: string;
  bank_name?: string;
  bank_branch?: string;
  account_number?: string;
  account_type?: string;
  salary?: number;
  tax_id?: string;
  staff_id?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id: number;
  name: string;
  grade_level: string;
  section?: string;
  class_representative?: number;
  responsible_teacher?: number;
  capacity?: number;
  room_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeacherSubject {
  id: number;
  teacher_id: number;
  class_subject_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id: number;
  class_id: number;
  teacher_id: number;
  subject_id: number;
  day: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface Grade {
  id: number;
  student_id: number;
  teacher_id: number;
  class_subject_id: number;
  score: number;
  grade?: string;
  term: string;
  academic_year: string;
  exam_type?: ExamType;
  remarks?: string;
  date_recorded: string;
  approved_by?: number;
  status: GradeStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  date: string;
  status: AttendanceStatus;
  created_at?: string;
  updated_at?: string;
}

export interface FeeAccount {
  id: number;
  student_id: number;
  balance: number;
  updated_at: string;
}

export interface Transaction {
  id: number;
  student_id: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  created_at: string;
}

export interface Device {
  id: number;
  user_id: number;
  device_id: string;
  verified: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
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

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface DeviceVerification {
  deviceId: string;
  verificationCode: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Student and Parent Types
export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  classId: string;
  enrollmentDate: string;
  parentId?: string;
}

export interface Parent {
  id: string;
  userId: string;
  studentIds: string[];
}

// Class and Course Types
export interface Class {
  id: string;
  name: string;
  classCode: string;
  section: string;
  academicYear: string;
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
}

// Grade and Academic Types
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

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Fee and Payment Types
export interface FeeStructure {
  id: string;
  classId: string;
  feeType: FeeType;
  amount: number;
  dueDate: string;
  academicYear: string;
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

// Dashboard Statistics
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalFeesPending: number;
  attendancePercentage: number;
}

export interface AdminMetrics extends DashboardStats {
  feesCollected: number;
  pendingPayments: number;
  averageAttendance: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// File Upload
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Form Data Types
export interface CreateUserForm {
  email: string;
  fullName: string;
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

export interface PublishGradeForm {
  studentId: string;
  subjectId: string;
  marks: number;
  totalMarks: number;
  examType: ExamType;
  termId: string;
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
