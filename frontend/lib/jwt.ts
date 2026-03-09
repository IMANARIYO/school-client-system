// lib/utils/jwt.ts
import { jwtDecode } from "jwt-decode";
import { UserRole } from "@/lib/types";

interface JWTClaims {
  userId: string;
  role: UserRole;
  fullName?: string;
  email?: string;
  permissions?: string[];
}

/**
 * Extract role from JWT token string
 */
export function getRoleFromToken(token: string): UserRole | null {
  try {
    const decoded = jwtDecode<JWTClaims>(token);
    return decoded.role || null;
  } catch (err) {
    return null;
  }
}
