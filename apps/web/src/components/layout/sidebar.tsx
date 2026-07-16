'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMe, useLogout } from '@/features/auth/hooks/use-auth';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-screen flex-col justify-between py-6 px-3">
      {/* Logo */}
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 px-3 mb-8">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-text-on" />
            </svg>
          </div>
          <span className="font-display font-semibold text-text-1 text-base">ConvertAI</span>
        </Link>

        {/* Navegação */}
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent-soft text-accent'
                    : 'text-text-2 hover:bg-surface-raised hover:text-text-1',
                ].join(' ')}
              >
                <span className={active ? 'text-accent' : 'text-text-3'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé com usuário e logout */}
      <div className="border-t border-border pt-4 px-1">
        {user && (
          <div className="px-2 mb-3">
            <p className="text-xs font-medium text-text-1 truncate">{user.name}</p>
            <p className="text-xs text-text-3 truncate" title={user.email}>{user.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-2 hover:bg-surface-raised hover:text-text-1 disabled:opacity-40 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isPending ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </div>
  );
}
