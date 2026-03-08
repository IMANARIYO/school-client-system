import {
  User,
  Class,
  Student,
  FeeStructure,
  AdminMetrics,
  ApiResponse,
  CreateUserForm,
  CreateClassForm,
  CreateFeeStructureForm,
  UserRole,
  PaymentStatus,
} from '@/lib/types';
import {
  dummyUsers,
  dummyClasses,
  dummyStudents,
  dummyFeeStructures,
  dummyAttendance,
  dummyFeePayments,
} from '@/lib/api/dummyData';
import { apiClient } from '@/lib/api/client';

export const adminService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: dummyUsers,
        });
      }, 500);
    });
  },

  async createUser(formData: CreateUserForm): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
        };
        resolve({
          success: true,
          data: newUser,
        });
      }, 500);
    });
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dummyUsers.find((u) => u.id === userId);
        if (user) {
          resolve({
            success: true,
            data: { ...user, ...userData },
          });
        } else {
          resolve({
            success: false,
            error: 'User not found',
          });
        }
      }, 500);
    });
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 500);
    });
  },

  async getClasses(): Promise<ApiResponse<Class[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: dummyClasses,
        });
      }, 500);
    });
  },

  async createClass(formData: CreateClassForm): Promise<ApiResponse<Class>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClass: Class = {
          id: `class_${Date.now()}`,
          name: formData.name,
          classCode: formData.classCode,
          section: formData.section,
          academicYear: formData.academicYear,
          teacherId: formData.teacherId,
        };
        resolve({
          success: true,
          data: newClass,
        });
      }, 500);
    });
  },

  async updateClass(classId: string, classData: Partial<Class>): Promise<ApiResponse<Class>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const classItem = dummyClasses.find((c) => c.id === classId);
        if (classItem) {
          resolve({
            success: true,
            data: { ...classItem, ...classData },
          });
        } else {
          resolve({
            success: false,
            error: 'Class not found',
          });
        }
      }, 500);
    });
  },

  async deleteClass(classId: string): Promise<ApiResponse<void>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 500);
    });
  },

  async getStudents(): Promise<ApiResponse<Student[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: dummyStudents,
        });
      }, 500);
    });
  },

  async getFeeStructures(): Promise<ApiResponse<FeeStructure[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: dummyFeeStructures,
        });
      }, 500);
    });
  },

  async createFeeStructure(formData: CreateFeeStructureForm): Promise<ApiResponse<FeeStructure>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStructure: FeeStructure = {
          id: `fee_struct_${Date.now()}`,
          classId: formData.classId,
          feeType: formData.feeType,
          amount: formData.amount,
          dueDate: formData.dueDate,
          academicYear: formData.academicYear,
        };
        resolve({
          success: true,
          data: newStructure,
        });
      }, 500);
    });
  },

  async getMetrics(): Promise<ApiResponse<AdminMetrics>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const presentDays = dummyAttendance.filter((a) => a.status === 'present').length;
        const totalAttendanceRecords = dummyAttendance.length;
        const attendancePercentage = totalAttendanceRecords > 0 
          ? Math.round((presentDays / totalAttendanceRecords) * 100)
          : 0;

        const metrics: AdminMetrics = {
          totalStudents: dummyStudents.length,
          totalTeachers: dummyUsers.filter((u) => u.role === UserRole.TEACHER).length,
          totalClasses: dummyClasses.length,
          totalFeeCollected: dummyFeePayments
            .filter((p) => p.status === PaymentStatus.COMPLETED)
            .reduce((sum, p) => sum + p.amount, 0),
          pendingFees: dummyFeePayments
            .filter((p) => p.status === PaymentStatus.PENDING)
            .reduce((sum, p) => sum + p.amount, 0),
          attendancePercentage,
        };
        resolve({
          success: true,
          data: metrics,
        });
      }, 500);
    });
  },

  async assignClassRepresentative(
    classId: number,
    studentId: number
  ): Promise<ApiResponse<Class>> {
    try {
      const response = await apiClient.post(`/classes/${classId}/assign-representative`, null, {
        params: { studentId },
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to assign class representative',
      };
    }
  },

  async assignResponsibleTeacher(
    classId: number,
    teacherId: number
  ): Promise<ApiResponse<Class>> {
    try {
      const response = await apiClient.post(`/classes/${classId}/assign-teacher`, null, {
        params: { teacherId },
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to assign responsible teacher',
      };
    }
  },
};
