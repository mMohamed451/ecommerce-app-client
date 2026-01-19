import axiosInstance from '../axios';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  RefreshTokenRequest,
} from '@/types/auth';
import { ApiResponse } from '@/types';

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    // Backend returns Result<T> with Data property, which gets serialized to camelCase
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Login failed');
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Registration failed');
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/forgot-password', data);
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/reset-password', data);
  },

  // Refresh Token
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh', data);
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Token refresh failed');
  },

  // Logout
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    const result = response.data;
    if (result.isSuccess && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to get current user');
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post('/auth/verify-email', { token });
  },

  // Resend Verification Email
  resendVerificationEmail: async (): Promise<void> => {
    await axiosInstance.post('/auth/resend-verification');
  },
};
