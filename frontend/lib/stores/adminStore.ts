import { create } from 'zustand';
import { User, Class, Student, FeeStructure, AdminMetrics } from '@/lib/types';

interface AdminStore {
  users: User[];
  classes: Class[];
  students: Student[];
  feeStructures: FeeStructure[];
  metrics: AdminMetrics | null;
  isLoading: boolean;
  error: string | null;

  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  setClasses: (classes: Class[]) => void;
  addClass: (classData: Class) => void;
  updateClass: (classData: Class) => void;
  deleteClass: (classId: string) => void;

  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;

  setFeeStructures: (structures: FeeStructure[]) => void;
  addFeeStructure: (structure: FeeStructure) => void;

  setMetrics: (metrics: AdminMetrics) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  classes: [],
  students: [],
  feeStructures: [],
  metrics: null,
  isLoading: false,
  error: null,

  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  setClasses: (classes) => set({ classes }),
  addClass: (classData) =>
    set((state) => ({
      classes: [...state.classes, classData],
    })),
  updateClass: (classData) =>
    set((state) => ({
      classes: state.classes.map((c) => (c.id === classData.id ? classData : c)),
    })),
  deleteClass: (classId) =>
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== classId),
    })),

  setStudents: (students) => set({ students }),
  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),
  updateStudent: (student) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === student.id ? student : s
      ),
    })),
  deleteStudent: (studentId) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== studentId),
    })),

  setFeeStructures: (structures) => set({ feeStructures: structures }),
  addFeeStructure: (structure) =>
    set((state) => ({
      feeStructures: [...state.feeStructures, structure],
    })),

  setMetrics: (metrics) => set({ metrics }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
