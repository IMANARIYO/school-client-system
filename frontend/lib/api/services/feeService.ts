import {
  FeePayment,
  StudentFeeRecord,
  ApiResponse,
  PaymentMethod,
  PaymentStatus,
} from '@/lib/types';
import {
  dummyFeePayments,
  dummyStudentFeeRecords,
} from '@/lib/api/dummyData';

export const feeService = {
  async getPayments(studentId?: string): Promise<ApiResponse<FeePayment[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let payments = dummyFeePayments;
        if (studentId) {
          payments = payments.filter((p) => p.studentId === studentId);
        }
        resolve({
          success: true,
          data: payments,
        });
      }, 500);
    });
  },

  async createPayment(
    studentId: string,
    feeStructureId: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): Promise<ApiResponse<FeePayment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment: FeePayment = {
          id: `payment_${Date.now()}`,
          studentId,
          feeStructureId,
          amount,
          paymentDate: new Date().toISOString(),
          paymentMethod,
          status: PaymentStatus.PENDING,
        };
        resolve({
          success: true,
          data: payment,
        });
      }, 500);
    });
  },

  async getStudentFeeRecord(studentId: string): Promise<ApiResponse<StudentFeeRecord>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = dummyStudentFeeRecords.find(
          (r) => r.studentId === studentId
        );
        if (record) {
          resolve({
            success: true,
            data: record,
          });
        } else {
          resolve({
            success: false,
            error: 'Fee record not found',
          });
        }
      }, 500);
    });
  },

  async getAllStudentFeeRecords(): Promise<ApiResponse<StudentFeeRecord[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: dummyStudentFeeRecords,
        });
      }, 500);
    });
  },

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus
  ): Promise<ApiResponse<FeePayment>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = dummyFeePayments.find((p) => p.id === paymentId);
        if (payment) {
          resolve({
            success: true,
            data: { ...payment, status },
          });
        } else {
          resolve({
            success: false,
            error: 'Payment not found',
          });
        }
      }, 500);
    });
  },
};
