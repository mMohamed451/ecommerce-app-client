import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRef } from 'react';

export function useAuth() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, setTokens, logout: logoutStore } = useAuthStore();
  
  // Use ref to store redirect path across mutation calls
  const redirectRef = useRef<string | undefined>();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => {
      return authApi.login(data);
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Login successful!');
      
      // Use stored redirect path if provided, otherwise default to dashboard
      const redirectPath = redirectRef.current;
      
      // Determine final path
      let finalPath = '/dashboard';
      if (redirectPath) {
        // Remove locale prefix if present (next-intl handles it)
        if (redirectPath.startsWith('/en/') || redirectPath.startsWith('/ar/')) {
          finalPath = redirectPath.replace(/^\/(en|ar)/, '') || '/dashboard';
        } else {
          finalPath = redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath;
        }
      }
      
      // Ensure path is valid
      if (!finalPath || finalPath === '/') {
        finalPath = '/dashboard';
      }
      
      // Clear redirect ref before navigation
      redirectRef.current = undefined;
      
      // Navigate using router.push (next-intl will handle locale automatically)
      // Note: Using router.push for client-side navigation
      // The middleware checks cookies but tokens are in localStorage,
      // so protected routes will work client-side but middleware won't see auth
      router.push(finalPath);
    },
    onError: (error: any) => {
      redirectRef.current = undefined; // Clear on error
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.[0] || 
                           error.message || 
                           'Login failed';
      toast.error(errorMessage);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Registration successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.[0] || 
                           error.message || 
                           'Registration failed';
      toast.error(errorMessage);
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful!');
      router.push('/auth/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Password reset failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Still logout locally even if API fails
      logoutStore();
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  return {
    user,
    isAuthenticated,
    login: (data: LoginRequest, redirect?: string) => {
      // Store redirect in ref before mutation
      redirectRef.current = redirect;
      // Call mutation with only login data (no redirect)
      loginMutation.mutate(data);
    },
    register: registerMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
}
