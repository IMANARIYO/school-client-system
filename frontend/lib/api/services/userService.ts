"use client";

import { User, UsersStatus } from "@/lib/types";
import { ApiResponse } from "@/lib/types";
import { dummyUsers } from "@/lib/api/dummyData";

interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  profile_picture?: string;
}

interface UpdateUserPayload {
  phone?: string;
  profile_picture?: string;
  status?: UsersStatus;
}

export const userService = {
  async getUsers(filters?: { role?: string }): Promise<ApiResponse<User[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = [...dummyUsers];

        if (filters?.role) {
          users = users.filter((u) => u.role === filters.role);
        }

        resolve({
          success: true,
          data: users,
        });
      }, 300);
    });
  },

  async getUserById(userId: number): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dummyUsers.find((u) => u.id === userId);
        if (user) {
          resolve({
            success: true,
            data: user,
          });
        } else {
          resolve({
            success: false,
            error: "User not found",
          });
        }
      }, 300);
    });
  },

  async createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Math.max(...dummyUsers.map((u) => u.id || 0), 0) + 1,
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          role: payload.role as any,
          phone: payload.phone,
          profile_picture: payload.profile_picture,
          status: "ACTIVE" as UserStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        dummyUsers.push(newUser);

        resolve({
          success: true,
          data: newUser,
        });
      }, 500);
    });
  },

  async updateUser(
    userId: number,
    payload: UpdateUserPayload
  ): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dummyUsers.find((u) => u.id === userId);
        if (user) {
          if (payload.phone) user.phone = payload.phone;
          if (payload.profile_picture)
            user.profile_picture = payload.profile_picture;
          if (payload.status) user.status = payload.status;
          user.updated_at = new Date().toISOString();

          resolve({
            success: true,
            data: user,
          });
        } else {
          resolve({
            success: false,
            error: "User not found",
          });
        }
      }, 500);
    });
  },

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dummyUsers.find((u) => u.id === userId);
        if (user) {
          user.deleted_at = new Date().toISOString();
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: "User not found",
          });
        }
      }, 500);
    });
  },

  async changeUserStatus(
    userId: number,
    status: UserStatus
  ): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = dummyUsers.find((u) => u.id === userId);
        if (user) {
          user.status = status;
          user.updated_at = new Date().toISOString();
          resolve({
            success: true,
            data: user,
          });
        } else {
          resolve({
            success: false,
            error: "User not found",
          });
        }
      }, 500);
    });
  },
};
