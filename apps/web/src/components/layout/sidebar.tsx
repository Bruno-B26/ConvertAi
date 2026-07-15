'use client';

import Link from 'next/link';
import { useMe, useLogout } from '@/features/auth/hooks/use-auth';

export function Sidebar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <Link href="/dashboard" className="block px-2 text-lg font-semibold text-white">
          ConvertAI
        </Link>

        <nav className="mt-8 space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Dashboard
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-800 pt-4">
        {user && (
          <p className="truncate px-2 text-xs text-gray-400" title={user.email}>
            {user.email}
          </p>
        )}
        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          className="mt-2 w-full rounded-md px-2 py-2 text-left text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
        >
          {isPending ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </div>
  );
}
