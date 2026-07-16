'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ApiError } from '@/lib/api-client';
import { useLogin } from '../hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const THROTTLE_TTL = 60; // segundos — mesmo TTL configurado no backend

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isThrottled = error instanceof ApiError && error.statusCode === 429;

  // Inicia contagem regressiva quando o erro 429 chega
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const blocked = isThrottled && countdown > 0;

  return (
    <div className="w-full rounded-2xl bg-[#161616] border border-white/10 p-8 shadow-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Entrar</h1>
        <p className="mt-1 text-sm text-gray-400">Acesse seu painel de prospecção</p>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          mutate({ email: data.email, password: data.password }),
        )}
        className="space-y-5"
      >
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
            autoComplete="current-password"
            className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-[#1e1e1e] accent-green-500 cursor-pointer"
            />
            <span className="text-sm text-gray-400">Manter conectado</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            Esqueci a senha
          </Link>
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
              'E-mail ou senha incorretos.'
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || blocked}
          className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending
            ? 'Entrando...'
            : blocked
              ? `Aguarde ${countdown}s`
              : 'Entrar na plataforma'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Ainda não é cliente?{' '}
        <Link
          href="/register"
          className="text-green-400 font-medium hover:text-green-300 transition-colors"
        >
          Quero saber mais
        </Link>
      </p>
    </div>
  );
}
