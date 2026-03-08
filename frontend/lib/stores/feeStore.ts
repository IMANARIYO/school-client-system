import { create } from 'zustand';
import { FeePayment, StudentFeeRecord } from '@/lib/types';

interface FeeStore {
  payments: FeePayment[];
  studentFeeRecords: StudentFeeRecord[];
  isLoading: boolean;
  error: string | null;

  setPayments: (payments: FeePayment[]) => void;
  addPayment: (payment: FeePayment) => void;
  updatePayment: (payment: FeePayment) => void;

  setStudentFeeRecords: (records: StudentFeeRecord[]) => void;
  updateStudentFeeRecord: (record: StudentFeeRecord) => void;
  getStudentFeeRecord: (studentId: string) => StudentFeeRecord | undefined;

  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useFeeStore = create<FeeStore>((set, get) => ({
  payments: [],
  studentFeeRecords: [],
  isLoading: false,
  error: null,

  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),
  updatePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    })),

  setStudentFeeRecords: (records) => set({ studentFeeRecords: records }),
  updateStudentFeeRecord: (record) =>
    set((state) => ({
      studentFeeRecords: state.studentFeeRecords.map((r) =>
        r.id === record.id ? record : r
      ),
    })),
  getStudentFeeRecord: (studentId) => {
    const state = get();
    return state.studentFeeRecords.find((r) => r.studentId === studentId);
  },

  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
