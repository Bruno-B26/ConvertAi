'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authApi from '../services/auth-api';
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '../types';

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordDto) => authApi.forgotPassword(dto),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: ResetPasswordDto) => authApi.resetPassword(dto),
    onSuccess: () => {
      router.push('/login');
    },
  });
}
