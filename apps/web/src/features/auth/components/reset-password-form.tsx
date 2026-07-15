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
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm border border-gray-200">
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Link de recuperação inválido.
        </p>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Solicitar novo link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm border border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Redefinir senha</h1>
        <p className="mt-1 text-sm text-gray-500">Escolha uma nova senha para sua conta.</p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutate({ token, newPassword: data.newPassword }))}
        className="space-y-4"
      >
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nova senha
          </label>
          <input
            {...register('newPassword')}
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mínimo 8 caracteres"
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    </div>
  );
}
