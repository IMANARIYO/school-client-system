import { create } from 'zustand';
import { Grade, Attendance, Subject } from '@/lib/types';

interface AcademicStore {
  grades: Grade[];
  attendance: Attendance[];
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;

  setGrades: (grades: Grade[]) => void;
  addGrade: (grade: Grade) => void;
  updateGrade: (grade: Grade) => void;

  setAttendance: (attendance: Attendance[]) => void;
  addAttendance: (record: Attendance) => void;
  updateAttendance: (record: Attendance) => void;

  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;

  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAcademicStore = create<AcademicStore>((set) => ({
  grades: [],
  attendance: [],
  subjects: [],
  isLoading: false,
  error: null,

  setGrades: (grades) => set({ grades }),
  addGrade: (grade) =>
    set((state) => ({
      grades: [...state.grades, grade],
    })),
  updateGrade: (grade) =>
    set((state) => ({
      grades: state.grades.map((g) => (g.id === grade.id ? grade : g)),
    })),

  setAttendance: (attendance) => set({ attendance }),
  addAttendance: (record) =>
    set((state) => ({
      attendance: [...state.attendance, record],
    })),
  updateAttendance: (record) =>
    set((state) => ({
      attendance: state.attendance.map((a) =>
        a.id === record.id ? record : a
      ),
    })),

  setSubjects: (subjects) => set({ subjects }),
  addSubject: (subject) =>
    set((state) => ({
      subjects: [...state.subjects, subject],
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
