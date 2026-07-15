import { apiClient } from '@/lib/api-client';
import type {
  AuthResponse,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UserResponse,
} from '../types';

export function register(dto: RegisterDto): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', { method: 'POST', body: dto });
}

export function login(dto: LoginDto): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', { method: 'POST', body: dto });
}

export function logout(): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/auth/logout', { method: 'POST' });
}

export function getMe(): Promise<UserResponse> {
  return apiClient<UserResponse>('/auth/me');
}

export function forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/auth/forgot-password', { method: 'POST', body: dto });
}

export function resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/auth/reset-password', { method: 'POST', body: dto });
}
