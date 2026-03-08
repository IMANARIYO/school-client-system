import {
  User,
  UserRole,
  Class,
  Student,
  Grade,
  Attendance,
  AttendanceStatus,
  FeeStructure,
  FeeType,
  FeePayment,
  PaymentMethod,
  PaymentStatus,
  StudentFeeRecord,
  Subject,
  ExamType,
  Notification,
  NotificationType,
  AdminMetrics,
} from '@/lib/types';

// Users
export const dummyUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@school.com',
    fullName: 'Admin User',
    role: UserRole.ADMIN,
    phone: '9876543210',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'teacher-1',
    email: 'john.doe@school.com',
    fullName: 'John Doe',
    role: UserRole.TEACHER,
    phone: '9876543211',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'teacher-2',
    email: 'jane.smith@school.com',
    fullName: 'Jane Smith',
    role: UserRole.TEACHER,
    phone: '9876543212',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'student-1',
    email: 'alice@school.com',
    fullName: 'Alice Johnson',
    role: UserRole.STUDENT,
    phone: '9876543213',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'student-2',
    email: 'bob@school.com',
    fullName: 'Bob Wilson',
    role: UserRole.STUDENT,
    phone: '9876543214',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'student-3',
    email: 'charlie@school.com',
    fullName: 'Charlie Brown',
    role: UserRole.STUDENT,
    phone: '9876543215',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'parent-1',
    email: 'parent.alice@school.com',
    fullName: 'Mrs. Johnson',
    role: UserRole.PARENT,
    phone: '9876543216',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'parent-2',
    email: 'parent.bob@school.com',
    fullName: 'Mr. Wilson',
    role: UserRole.PARENT,
    phone: '9876543217',
    createdAt: new Date('2024-02-01').toISOString(),
  },
];

// Classes
export const dummyClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Mathematics - Class X',
    classCode: 'MATH-10A',
    section: 'A',
    academicYear: '2024-2025',
    teacherId: 'teacher-1',
  },
  {
    id: 'class-2',
    name: 'English - Class X',
    classCode: 'ENG-10B',
    section: 'B',
    academicYear: '2024-2025',
    teacherId: 'teacher-2',
  },
  {
    id: 'class-3',
    name: 'Science - Class IX',
    classCode: 'SCI-9A',
    section: 'A',
    academicYear: '2024-2025',
    teacherId: 'teacher-1',
  },
];

// Subjects
export const dummySubjects: Subject[] = [
  {
    id: 'subject-1',
    name: 'Mathematics',
    code: 'MATH',
    classId: 'class-1',
  },
  {
    id: 'subject-2',
    name: 'English',
    code: 'ENG',
    classId: 'class-2',
  },
  {
    id: 'subject-3',
    name: 'Physics',
    code: 'PHY',
    classId: 'class-3',
  },
  {
    id: 'subject-4',
    name: 'Chemistry',
    code: 'CHEM',
    classId: 'class-3',
  },
];

// Students
export const dummyStudents: Student[] = [
  {
    id: 'student-rec-1',
    userId: 'student-1',
    rollNumber: 'STU001',
    classId: 'class-1',
    enrollmentDate: new Date('2024-06-01').toISOString(),
    parentId: 'parent-1',
  },
  {
    id: 'student-rec-2',
    userId: 'student-2',
    rollNumber: 'STU002',
    classId: 'class-1',
    enrollmentDate: new Date('2024-06-01').toISOString(),
    parentId: 'parent-2',
  },
  {
    id: 'student-rec-3',
    userId: 'student-3',
    rollNumber: 'STU003',
    classId: 'class-2',
    enrollmentDate: new Date('2024-06-01').toISOString(),
  },
];

// Grades
export const dummyGrades: Grade[] = [
  {
    id: 'grade-1',
    studentId: 'student-rec-1',
    subjectId: 'subject-1',
    marks: 85,
    totalMarks: 100,
    percentage: 85,
    grade: 'A',
    examType: ExamType.UNIT_TEST,
    termId: 'term-1',
    createdAt: new Date('2024-09-15').toISOString(),
  },
  {
    id: 'grade-2',
    studentId: 'student-rec-1',
    subjectId: 'subject-1',
    marks: 92,
    totalMarks: 100,
    percentage: 92,
    grade: 'A',
    examType: ExamType.TERM_EXAM,
    termId: 'term-1',
    createdAt: new Date('2024-10-20').toISOString(),
  },
  {
    id: 'grade-3',
    studentId: 'student-rec-2',
    subjectId: 'subject-1',
    marks: 78,
    totalMarks: 100,
    percentage: 78,
    grade: 'B',
    examType: ExamType.UNIT_TEST,
    termId: 'term-1',
    createdAt: new Date('2024-09-15').toISOString(),
  },
];

// Attendance
export const dummyAttendance: Attendance[] = [
  {
    id: 'att-1',
    studentId: 'student-rec-1',
    classId: 'class-1',
    date: new Date('2024-10-01').toISOString(),
    status: AttendanceStatus.PRESENT,
  },
  {
    id: 'att-2',
    studentId: 'student-rec-1',
    classId: 'class-1',
    date: new Date('2024-10-02').toISOString(),
    status: AttendanceStatus.PRESENT,
  },
  {
    id: 'att-3',
    studentId: 'student-rec-1',
    classId: 'class-1',
    date: new Date('2024-10-03').toISOString(),
    status: AttendanceStatus.ABSENT,
  },
  {
    id: 'att-4',
    studentId: 'student-rec-2',
    classId: 'class-1',
    date: new Date('2024-10-01').toISOString(),
    status: AttendanceStatus.PRESENT,
  },
  {
    id: 'att-5',
    studentId: 'student-rec-2',
    classId: 'class-1',
    date: new Date('2024-10-02').toISOString(),
    status: AttendanceStatus.LATE,
  },
];

// Fee Structures
export const dummyFeeStructures: FeeStructure[] = [
  {
    id: 'fee-struct-1',
    classId: 'class-1',
    feeType: FeeType.TUITION,
    amount: 50000,
    dueDate: new Date('2024-06-30').toISOString(),
    academicYear: '2024-2025',
  },
  {
    id: 'fee-struct-2',
    classId: 'class-1',
    feeType: FeeType.TRANSPORT,
    amount: 10000,
    dueDate: new Date('2024-06-30').toISOString(),
    academicYear: '2024-2025',
  },
  {
    id: 'fee-struct-3',
    classId: 'class-1',
    feeType: FeeType.SPORTS,
    amount: 5000,
    dueDate: new Date('2024-06-30').toISOString(),
    academicYear: '2024-2025',
  },
];

// Fee Payments
export const dummyFeePayments: FeePayment[] = [
  {
    id: 'payment-1',
    studentId: 'student-rec-1',
    feeStructureId: 'fee-struct-1',
    amount: 50000,
    paymentDate: new Date('2024-06-15').toISOString(),
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.COMPLETED,
    transactionId: 'TXN001',
  },
  {
    id: 'payment-2',
    studentId: 'student-rec-1',
    feeStructureId: 'fee-struct-2',
    amount: 10000,
    paymentDate: new Date('2024-06-15').toISOString(),
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.COMPLETED,
    transactionId: 'TXN002',
  },
  {
    id: 'payment-3',
    studentId: 'student-rec-2',
    feeStructureId: 'fee-struct-1',
    amount: 50000,
    paymentDate: new Date().toISOString(),
    paymentMethod: PaymentMethod.ONLINE,
    status: PaymentStatus.PENDING,
  },
];

// Student Fee Records
export const dummyStudentFeeRecords: StudentFeeRecord[] = [
  {
    id: 'fee-record-1',
    studentId: 'student-rec-1',
    totalFeeAmount: 65000,
    paidAmount: 60000,
    pendingAmount: 5000,
    dueDate: new Date('2024-06-30').toISOString(),
    payments: dummyFeePayments.filter((p) => p.studentId === 'student-rec-1'),
  },
  {
    id: 'fee-record-2',
    studentId: 'student-rec-2',
    totalFeeAmount: 65000,
    paidAmount: 50000,
    pendingAmount: 15000,
    dueDate: new Date('2024-06-30').toISOString(),
    payments: dummyFeePayments.filter((p) => p.studentId === 'student-rec-2'),
  },
];

// Notifications
export const dummyNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'Grade Published',
    message: 'Your Mathematics Unit Test grades have been published',
    type: NotificationType.GRADE_PUBLISHED,
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/student/grades',
  },
  {
    id: 'notif-2',
    userId: 'parent-1',
    title: 'Fee Due',
    message: 'School fee payment is due by June 30, 2024',
    type: NotificationType.FEE_DUE,
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/parent/fees',
  },
  {
    id: 'notif-3',
    userId: 'teacher-1',
    title: 'Attendance Alert',
    message: 'Alice Johnson has been absent for 2 consecutive days',
    type: NotificationType.ATTENDANCE_ALERT,
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/teacher/attendance',
  },
];
