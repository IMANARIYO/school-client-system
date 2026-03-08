import {
  Grade,
  Attendance,
  Subject,
  ApiResponse,
  PublishGradeForm,
  RecordAttendanceForm,
} from '@/lib/types';
import {
  dummyGrades,
  dummyAttendance,
  dummySubjects,
} from '@/lib/api/dummyData';

export const academicService = {
  async getGrades(studentId?: string): Promise<ApiResponse<Grade[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let grades = dummyGrades;
        if (studentId) {
          grades = grades.filter((g) => g.studentId === studentId);
        }
        resolve({
          success: true,
          data: grades,
        });
      }, 500);
    });
  },

  async publishGrade(formData: PublishGradeForm): Promise<ApiResponse<Grade>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const grade: Grade = {
          id: `grade_${Date.now()}`,
          studentId: formData.studentId,
          subjectId: formData.subjectId,
          marks: formData.marks,
          totalMarks: formData.totalMarks,
          percentage: (formData.marks / formData.totalMarks) * 100,
          grade:
            (formData.marks / formData.totalMarks) * 100 >= 90
              ? 'A'
              : (formData.marks / formData.totalMarks) * 100 >= 80
                ? 'B'
                : (formData.marks / formData.totalMarks) * 100 >= 70
                  ? 'C'
                  : 'D',
          examType: formData.examType,
          termId: formData.termId,
          createdAt: new Date().toISOString(),
        };
        resolve({
          success: true,
          data: grade,
        });
      }, 500);
    });
  },

  async getAttendance(classId?: string, studentId?: string): Promise<ApiResponse<Attendance[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let attendance = dummyAttendance;
        if (classId) {
          attendance = attendance.filter((a) => a.classId === classId);
        }
        if (studentId) {
          attendance = attendance.filter((a) => a.studentId === studentId);
        }
        resolve({
          success: true,
          data: attendance,
        });
      }, 500);
    });
  },

  async recordAttendance(formData: RecordAttendanceForm): Promise<ApiResponse<Attendance[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records: Attendance[] = formData.attendance.map((item) => ({
          id: `att_${Date.now()}_${Math.random()}`,
          studentId: item.studentId,
          classId: formData.classId,
          date: formData.date,
          status: item.status,
          remark: item.remark,
        }));
        resolve({
          success: true,
          data: records,
        });
      }, 500);
    });
  },

  async getSubjects(classId?: string): Promise<ApiResponse<Subject[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let subjects = dummySubjects;
        if (classId) {
          subjects = subjects.filter((s) => s.classId === classId);
        }
        resolve({
          success: true,
          data: subjects,
        });
      }, 500);
    });
  },

  async getAttendancePercentage(studentId: string): Promise<ApiResponse<number>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentAttendance = dummyAttendance.filter(
          (a) => a.studentId === studentId
        );
        const present = studentAttendance.filter(
          (a) => a.status === 'present'
        ).length;
        const percentage =
          studentAttendance.length > 0
            ? (present / studentAttendance.length) * 100
            : 0;
        resolve({
          success: true,
          data: Math.round(percentage),
        });
      }, 500);
    });
  },
};
