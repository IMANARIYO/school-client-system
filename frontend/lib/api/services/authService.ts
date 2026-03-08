import { LoginCredentials, User, ApiResponse } from "@/lib/types";
import { dummyUsers } from "@/lib/api/dummyData";

interface RegisterData {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Login attempt:", credentials);
        const user = dummyUsers.find((u) => u.email === credentials.email);
        if (user && credentials.password === "password") {
          resolve({
            success: true,
            data: {
              user,
              token: `token_${user.id}`,
            },
          });
        } else {
          resolve({
            success: false,
            error: "Invalid email or password",
          });
        }
      }, 500);
    });
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          fullName: data.fullName,
          role: "student" as any,
          phone: data.phone,
          createdAt: new Date().toISOString(),
        };
        resolve({
          success: true,
          data: newUser,
        });
      }, 500);
    });
  },

  async verifyDevice(
    userId: string,
    code: string
  ): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: code === "123456",
          data: code === "123456",
        });
      }, 500);
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          const userId = token.split("_")[1];
          const user = dummyUsers.find((u) => u.id === userId);
          if (user) {
            resolve({
              success: true,
              data: user,
            });
            return;
          }
        }
        resolve({
          success: false,
          error: "Not authenticated",
        });
      }, 300);
    });
  },

  async logout(): Promise<ApiResponse<void>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 300);
    });
  },
};
