import { ApiResponse, Student, Grade, Attendance, StudentFeeRecord } from '@/lib/types';
import { dummyStudents, dummyGrades, dummyAttendance, dummyStudentFeeRecords } from '@/lib/api/dummyData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const parentService = {
  async getMyChildren(): Promise<ApiResponse<Student[]>> {
    await delay(300);
    // In a real app, filter by parent ID
    return {
      success: true,
      data: dummyStudents,
    };
  },

  async getChildGrades(studentId: string): Promise<ApiResponse<Grade[]>> {
    await delay(300);
    const grades = dummyGrades.filter((g) => g.studentId === studentId);

    return {
      success: true,
      data: grades,
    };
  },

  async getChildAttendance(studentId: string): Promise<ApiResponse<Attendance[]>> {
    await delay(300);
    const attendance = dummyAttendance.filter((a) => a.studentId === studentId);

    return {
      success: true,
      data: attendance,
    };
  },

  async getChildAttendancePercentage(studentId: string): Promise<ApiResponse<number>> {
    await delay(300);
    const attendance = dummyAttendance.filter((a) => a.studentId === studentId);

    if (attendance.length === 0) {
      return {
        success: true,
        data: 0,
      };
    }

    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const percentage = Math.round((presentDays / attendance.length) * 100);

    return {
      success: true,
      data: percentage,
    };
  },

  async getChildFees(studentId: string): Promise<ApiResponse<StudentFeeRecord>> {
    await delay(300);
    const feeRecord = dummyStudentFeeRecords.find((f) => f.studentId === studentId);

    if (!feeRecord) {
      return {
        success: false,
        error: 'No fee records found',
      };
    }

    return {
      success: true,
      data: feeRecord,
    };
  },

  async getAcademicSummary(studentId: string): Promise<ApiResponse<{
    studentName: string;
    className: string;
    averagePercentage: number;
    attendancePercentage: number;
    feeStatus: string;
    pendingFeeAmount: number;
  }>> {
    await delay(400);
    const student = dummyStudents.find((s) => s.id === studentId);
    const grades = dummyGrades.filter((g) => g.studentId === studentId);
    const attendance = dummyAttendance.filter((a) => a.studentId === studentId);
    const feeRecord = dummyStudentFeeRecords.find((f) => f.studentId === studentId);

    if (!student) {
      return {
        success: false,
        error: 'Student not found',
      };
    }

    const averagePercentage =
      grades.length > 0
        ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
        : 0;

    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const attendancePercentage =
      attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;

    const feeStatus = feeRecord
      ? feeRecord.pendingAmount === 0
        ? 'Paid'
        : 'Pending'
      : 'N/A';

    const pendingFeeAmount = feeRecord?.pendingAmount || 0;

    return {
      success: true,
      data: {
        studentName: student.userId,
        className: student.classId,
        averagePercentage,
        attendancePercentage,
        feeStatus,
        pendingFeeAmount,
      },
    };
  },
};
