import { ApiResponse, Class, Student, Grade, Attendance, AttendanceStatus, ExamType } from '@/lib/types';
import { dummyClasses, dummyStudents, dummyGrades, dummyAttendance } from '@/lib/api/dummyData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const teacherService = {
  async getMyClasses(): Promise<ApiResponse<Class[]>> {
    await delay(300);
    return {
      success: true,
      data: dummyClasses,
    };
  },

  async getClassById(classId: string): Promise<ApiResponse<Class>> {
    await delay(200);
    const classData = dummyClasses.find((c) => c.id === classId);
    if (!classData) {
      return {
        success: false,
        error: 'Class not found',
      };
    }
    return {
      success: true,
      data: classData,
    };
  },

  async getClassStudents(classId: string): Promise<ApiResponse<Student[]>> {
    await delay(300);
    const students = dummyStudents.filter((s) => s.classId === classId);
    return {
      success: true,
      data: students,
    };
  },

  async getGrades(classId?: string): Promise<ApiResponse<Grade[]>> {
    await delay(300);
    let grades = dummyGrades;
    if (classId) {
      grades = grades.filter((g) => {
        const student = dummyStudents.find((s) => s.id === g.studentId);
        return student?.classId === classId;
      });
    }
    return {
      success: true,
      data: grades,
    };
  },

  async createGrade(gradeData: {
    studentId: string;
    subjectId: string;
    marks: number;
    totalMarks: number;
    examType: ExamType;
    termId: string;
  }): Promise<ApiResponse<Grade>> {
    await delay(400);
    const percentage = Math.round((gradeData.marks / gradeData.totalMarks) * 100);
    let gradeValue = 'F';
    if (percentage >= 90) gradeValue = 'A+';
    else if (percentage >= 80) gradeValue = 'A';
    else if (percentage >= 70) gradeValue = 'B';
    else if (percentage >= 60) gradeValue = 'C';
    else if (percentage >= 50) gradeValue = 'D';

    const newGrade: Grade = {
      id: `grade_${Date.now()}`,
      studentId: gradeData.studentId,
      subjectId: gradeData.subjectId,
      marks: gradeData.marks,
      totalMarks: gradeData.totalMarks,
      percentage,
      grade: gradeValue,
      examType: gradeData.examType,
      termId: gradeData.termId,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newGrade,
    };
  },

  async updateGrade(gradeId: string, updates: Partial<Grade>): Promise<ApiResponse<Grade>> {
    await delay(400);
    const grade = dummyGrades.find((g) => g.id === gradeId);
    if (!grade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    const updated = { ...grade, ...updates };
    return {
      success: true,
      data: updated,
    };
  },

  async getAttendance(classId: string): Promise<ApiResponse<Attendance[]>> {
    await delay(300);
    const attendance = dummyAttendance.filter((a) => a.classId === classId);
    return {
      success: true,
      data: attendance,
    };
  },

  async markAttendance(data: {
    studentId: string;
    classId: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
  }): Promise<ApiResponse<Attendance>> {
    await delay(400);
    const newAttendance: Attendance = {
      id: `att_${Date.now()}`,
      studentId: data.studentId,
      classId: data.classId,
      date: data.date,
      status: data.status,
      remarks: data.remarks,
    };

    return {
      success: true,
      data: newAttendance,
    };
  },

  async updateAttendance(attendanceId: string, status: AttendanceStatus): Promise<ApiResponse<Attendance>> {
    await delay(400);
    const attendance = dummyAttendance.find((a) => a.id === attendanceId);
    if (!attendance) {
      return {
        success: false,
        error: 'Attendance record not found',
      };
    }

    const updated = { ...attendance, status };
    return {
      success: true,
      data: updated,
    };
  },

  async getClassAttendanceReport(classId: string): Promise<ApiResponse<{
    studentId: string;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
  }[]>> {
    await delay(500);
    const classAttendance = dummyAttendance.filter((a) => a.classId === classId);
    const studentIds = [...new Set(classAttendance.map((a) => a.studentId))];

    const report = studentIds.map((studentId) => {
      const records = classAttendance.filter((a) => a.studentId === studentId);
      const presentDays = records.filter((a) => a.status === AttendanceStatus.PRESENT).length;
      const absentDays = records.filter((a) => a.status === AttendanceStatus.ABSENT).length;
      const lateDays = records.filter((a) => a.status === AttendanceStatus.LATE).length;
      const percentage = records.length > 0 ? Math.round((presentDays / records.length) * 100) : 0;

      return {
        studentId,
        presentDays,
        absentDays,
        lateDays,
        percentage,
      };
    });

    return {
      success: true,
      data: report,
    };
  },
};
