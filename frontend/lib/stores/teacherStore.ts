import { create } from 'zustand';
import { Grade, Attendance, Class, Student } from '@/lib/types';

interface TeacherStore {
  classes: Class[];
  students: Student[];
  grades: Grade[];
  attendance: Attendance[];
  isLoading: boolean;
  error: string | null;

  setClasses: (classes: Class[]) => void;
  setStudents: (students: Student[]) => void;
  setGrades: (grades: Grade[]) => void;
  setAttendance: (attendance: Attendance[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, updates: Partial<Grade>) => void;

  addAttendance: (record: Attendance) => void;
  updateAttendance: (id: string, updates: Partial<Attendance>) => void;
}

export const useTeacherStore = create<TeacherStore>((set) => ({
  classes: [],
  students: [],
  grades: [],
  attendance: [],
  isLoading: false,
  error: null,

  setClasses: (classes) => set({ classes }),
  setStudents: (students) => set({ students }),
  setGrades: (grades) => set({ grades }),
  setAttendance: (attendance) => set({ attendance }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addGrade: (grade) =>
    set((state) => ({
      grades: [...state.grades, grade],
    })),

  updateGrade: (id, updates) =>
    set((state) => ({
      grades: state.grades.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),

  addAttendance: (record) =>
    set((state) => ({
      attendance: [...state.attendance, record],
    })),

  updateAttendance: (id, updates) =>
    set((state) => ({
      attendance: state.attendance.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
}));
