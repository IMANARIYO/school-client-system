import { create } from 'zustand';
import { Grade, Attendance, StudentFee, Student } from '@/lib/types';

interface StudentStore {
  student: Student | null;
  grades: Grade[];
  attendance: Attendance[];
  fees: StudentFee[];
  isLoading: boolean;
  error: string | null;

  setStudent: (student: Student | null) => void;
  setGrades: (grades: Grade[]) => void;
  setAttendance: (attendance: Attendance[]) => void;
  setFees: (fees: StudentFee[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  student: null,
  grades: [],
  attendance: [],
  fees: [],
  isLoading: false,
  error: null,

  setStudent: (student) => set({ student }),
  setGrades: (grades) => set({ grades }),
  setAttendance: (attendance) => set({ attendance }),
  setFees: (fees) => set({ fees }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
