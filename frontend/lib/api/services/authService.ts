import { LoginCredentials, User, ApiResponse, UserProfile } from "@/lib/types";
import { dummyUsers } from "@/lib/api/dummyData";
import { apiClient } from "../client";

interface RegisterData {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<
    ApiResponse<{ email: string; token: string; refreshToken: string }>
  > {
    try {
      const response = await apiClient.post<
        ApiResponse<{ email: string; token: string; refreshToken: string }>
      >("/v1/users/login", credentials);

      const result = response.data;

      return result.success && result.data
        ? { success: true, data: result.data, message: result.message }
        : { success: false, error: result.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
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
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        "/v1/users/me"
      );

      const result = response.data;

      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
          message: result.message,
        };
      }

      return {
        success: false,
        error: result.message || "Failed to fetch current user",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch current user",
      };
    }
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
