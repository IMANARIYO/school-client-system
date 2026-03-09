'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { jwtDecode } from "jwt-decode";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { LoginCredentials, UserRole, UserProfile, JWTClaims } from '@/lib/types';
import { authService } from '@/lib/api/services/authService';
import { useAuthStore } from '@/lib/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';



export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.TEACHER]: 'Teacher',
      [UserRole.STUDENT]: 'Student',
      [UserRole.PARENT]: 'Parent',
    };
    return roleNames[role] || role;
  };
  const onSubmit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1️⃣ Login and get JWT
      const loginResponse = await authService.login(credentials);

      if (!loginResponse.success || !loginResponse.data) {
        setError(loginResponse.error || "Login failed");
        return;
      }

      const token = loginResponse.data.token;

      // 2️⃣ Store only JWT
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);

        document.cookie = `token=${token}; path=/;`;
      }

      // 3️⃣ Decode token to get role
      const decoded = jwtDecode<JWTClaims>(token);

      // 4️⃣ Redirect based on role (server-trusted)
      const dashboardMap: Record<UserRole, string> = {
        [UserRole.ADMIN]: '/admin/dashboard',
        [UserRole.TEACHER]: '/teacher/dashboard',
        [UserRole.STUDENT]: '/student/dashboard',
        [UserRole.PARENT]: '/parent/dashboard',
      };

      toast({
        title: `Welcome back!`,
        description: `Logged in as ${getRoleName(decoded.role)}. Redirecting...`,
      });

      setTimeout(() => {
        router.push(dashboardMap[decoded.role] || '/');
      }, 1000);

    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-900/10 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <GraduationCap className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">EduManage</CardTitle>
            <CardDescription className="text-slate-400">
              School Management System
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <Input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="admin@school.com"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Password</label>
                <Input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 text-center mb-3">Demo Credentials</p>
              <div className="space-y-2 text-xs">
                <p className="text-slate-300">
                  <span className="text-slate-400">Admin:</span> admin@school.com / password
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Teacher:</span> john.doe@school.com / password
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Student:</span> alice@school.com / password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}