'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';
import { useRegister } from '../hooks/use-auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const THROTTLE_TTL = 60; // segundos — mesmo TTL configurado no backend

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isThrottled = error instanceof ApiError && error.statusCode === 429;

  useEffect(() => {
    if (isThrottled) {
      setCountdown(THROTTLE_TTL);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isThrottled, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const blocked = isThrottled && countdown > 0;

  return (
    <div className="w-full rounded-2xl bg-[#161616] border border-white/10 p-8 shadow-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-gray-400">Comece a prospectar com ConvertAI</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
            Nome completo
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            autoComplete="name"
            className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            placeholder="Seu nome"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
            E-mail corporativo
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            placeholder="voce@empresa.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
            Senha
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="new-password"
            className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {isThrottled ? (
              countdown > 0 ? (
                <>
                  Muitas tentativas. Aguarde{' '}
                  <span className="font-semibold tabular-nums">{countdown}s</span>{' '}
                  para tentar novamente.
                </>
              ) : (
                'Você já pode tentar novamente.'
              )
            ) : (
              error.message
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || blocked}
          className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending
            ? 'Criando conta...'
            : blocked
              ? `Aguarde ${countdown}s`
              : 'Criar conta grátis'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{' '}
        <Link
          href="/login"
          className="text-green-400 font-medium hover:text-green-300 transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
