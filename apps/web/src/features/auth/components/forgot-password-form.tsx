'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useForgotPassword } from '../hooks/use-auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { mutate, isPending, isSuccess, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm border border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recuperar senha</h1>
        <p className="mt-1 text-sm text-gray-500">
          Informe seu email para receber as instruções de recuperação.
        </p>
      </div>

      {isSuccess ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Se o email existir em nossa base, você receberá instruções em instantes.
        </p>
      ) : (
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="voce@empresa.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
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
            {isPending ? 'Enviando...' : 'Enviar instruções'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Lembrou a senha?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Entrar
        </Link>
      </p>
    </div>
  );
}
