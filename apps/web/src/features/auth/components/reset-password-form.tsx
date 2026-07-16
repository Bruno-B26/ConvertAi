'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useResetPassword } from '../hooks/use-auth';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { mutate, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="w-full rounded-2xl bg-[#161616] border border-white/10 p-8 shadow-2xl">
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          Link de recuperação inválido ou expirado.
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/forgot-password"
            className="text-green-400 font-medium hover:text-green-300 transition-colors"
          >
            Solicitar novo link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-[#161616] border border-white/10 p-8 shadow-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Redefinir senha</h1>
        <p className="mt-1 text-sm text-gray-400">Escolha uma nova senha para sua conta.</p>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          mutate({ token, newPassword: data.newPassword }),
        )}
        className="space-y-5"
      >
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
            Nova senha
          </label>
          <input
            {...register('newPassword')}
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Lembrou a senha?{' '}
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
