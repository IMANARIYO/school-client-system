import { ApiResponse, Grade, Attendance, StudentFeeRecord, Student, EnrollmentStatus } from '@/lib/types';
import { dummyGrades, dummyAttendance, dummyStudentFeeRecords, dummyStudents } from '@/lib/api/dummyData';

interface CreateStudentPayload {
  user_id: number;
  parent_id?: number;
  class_id?: number;
  date_of_birth: string;
  gender: string;
  place_of_birth?: string;
  enrollment_date: string;
  roll_number?: string;
  current_grade?: string;
  section?: string;
  previous_school?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  medical_conditions?: string;
  special_needs?: string;
}

interface UpdateStudentPayload {
  parent_id?: number;
  class_id?: number;
  current_grade?: string;
  section?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  medical_conditions?: string;
  special_needs?: string;
  enrollment_status?: EnrollmentStatus;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentService = {
  async getMyProfile(studentId: string): Promise<ApiResponse<Student>> {
    await delay(300);
    const student = dummyStudents.find((s) => s.id === studentId);

    if (!student) {
      return {
        success: false,
        error: 'Student not found',
      };
    }

    return {
      success: true,
      data: student,
    };
  },

  async getMyGrades(studentId: string): Promise<ApiResponse<Grade[]>> {
    await delay(300);
    const grades = dummyGrades.filter((g) => g.studentId === studentId);

    return {
      success: true,
      data: grades,
    };
  },

  async getGradesBySubject(studentId: string, subjectId: string): Promise<ApiResponse<Grade[]>> {
    await delay(300);
    const grades = dummyGrades.filter(
      (g) => g.studentId === studentId && g.subjectId === subjectId
    );

    return {
      success: true,
      data: grades,
    };
  },

  async getAcademicPerformance(studentId: string): Promise<ApiResponse<{
    overallPercentage: number;
    averageGrade: string;
    strongSubjects: string[];
    improvementAreas: string[];
  }>> {
    await delay(400);
    const grades = dummyGrades.filter((g) => g.studentId === studentId);

    if (grades.length === 0) {
      return {
        success: true,
        data: {
          overallPercentage: 0,
          averageGrade: 'N/A',
          strongSubjects: [],
          improvementAreas: [],
        },
      };
    }

    const totalPercentage = grades.reduce((sum, g) => sum + g.percentage, 0);
    const overallPercentage = Math.round(totalPercentage / grades.length);

    let averageGrade = 'F';
    if (overallPercentage >= 90) averageGrade = 'A+';
    else if (overallPercentage >= 80) averageGrade = 'A';
    else if (overallPercentage >= 70) averageGrade = 'B';
    else if (overallPercentage >= 60) averageGrade = 'C';
    else if (overallPercentage >= 50) averageGrade = 'D';

    const subjectAverages = Array.from(new Set(grades.map((g) => g.subjectId))).map((subjectId) => {
      const subjectGrades = grades.filter((g) => g.subjectId === subjectId);
      const avg = subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length;
      return { subjectId, avg };
    });

    const strongSubjects = subjectAverages
      .filter((s) => s.avg >= 80)
      .map((s) => s.subjectId);

    const improvementAreas = subjectAverages
      .filter((s) => s.avg < 70)
      .map((s) => s.subjectId);

    return {
      success: true,
      data: {
        overallPercentage,
        averageGrade,
        strongSubjects,
        improvementAreas,
      },
    };
  },

  async getMyAttendance(studentId: string): Promise<ApiResponse<Attendance[]>> {
    await delay(300);
    const attendance = dummyAttendance.filter((a) => a.studentId === studentId);

    return {
      success: true,
      data: attendance,
    };
  },

  async getAttendancePercentage(studentId: string): Promise<ApiResponse<number>> {
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

  async getMyFees(studentId: string): Promise<ApiResponse<StudentFeeRecord>> {
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

  async getFeeSummary(studentId: string): Promise<ApiResponse<{
    totalDue: number;
    totalPaid: number;
    pending: number;
    paidPercentage: number;
  }>> {
    await delay(300);
    const feeRecord = dummyStudentFeeRecords.find((f) => f.studentId === studentId);

    if (!feeRecord) {
      return {
        success: false,
        error: 'No fee records found',
      };
    }

    const paidPercentage = Math.round((feeRecord.paidAmount / feeRecord.totalFeeAmount) * 100);

    return {
      success: true,
      data: {
        totalDue: feeRecord.totalFeeAmount,
        totalPaid: feeRecord.paidAmount,
        pending: feeRecord.pendingAmount,
        paidPercentage,
      },
    };
  },

  // Admin Management Methods
  async getAllStudents(filters?: {
    class_id?: number;
    enrollment_status?: EnrollmentStatus;
  }): Promise<ApiResponse<Student[]>> {
    await delay(300);
    let students = [...dummyStudents];
    
    if (filters?.class_id) {
      students = students.filter((s) => s.class_id === filters.class_id);
    }
    
    if (filters?.enrollment_status) {
      students = students.filter((s) => s.enrollment_status === filters.enrollment_status);
    }
    
    return {
      success: true,
      data: students,
    };
  },

  async createStudent(payload: CreateStudentPayload): Promise<ApiResponse<Student>> {
    await delay(500);
    const newStudent: Student = {
      id: Math.max(...dummyStudents.map((s: any) => s.id || 0), 0) + 1,
      ...payload,
      enrollment_status: 'ACTIVE' as EnrollmentStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    dummyStudents.push(newStudent as any);
    
    return {
      success: true,
      data: newStudent,
    };
  },

  async updateStudent(
    studentId: number,
    payload: UpdateStudentPayload
  ): Promise<ApiResponse<Student>> {
    await delay(500);
    const student = dummyStudents.find((s: any) => s.id === studentId);
    if (student) {
      Object.assign(student, payload);
      student.updated_at = new Date().toISOString();
      
      return {
        success: true,
        data: student,
      };
    }
    return {
      success: false,
      error: 'Student not found',
    };
  },

  async deleteStudent(studentId: number): Promise<ApiResponse<void>> {
    await delay(500);
    const student = dummyStudents.find((s: any) => s.id === studentId);
    if (student) {
      student.deleted_at = new Date().toISOString();
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: 'Student not found',
    };
  },

  async changeEnrollmentStatus(
    studentId: number,
    status: EnrollmentStatus
  ): Promise<ApiResponse<Student>> {
    await delay(500);
    const student = dummyStudents.find((s: any) => s.id === studentId);
    if (student) {
      student.enrollment_status = status;
      student.updated_at = new Date().toISOString();
      return {
        success: true,
        data: student,
      };
    }
    return {
      success: false,
      error: 'Student not found',
    };
  },
};
