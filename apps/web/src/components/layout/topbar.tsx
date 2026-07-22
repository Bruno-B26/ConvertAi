'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMe, useLogout } from '@/features/auth/hooks/use-auth';
import { useTheme } from '@/providers/theme-provider';

const NAV_ITEMS = [
  { href: '/buscar', label: 'Buscar' },
  { href: '/aprovacao', label: 'Aprovação' },
  { href: '/campaigns', label: 'Campanhas' },
  { href: '/dashboard', label: 'Painel' },
];

/* ── Ícones inline ─────────────────────────────────────────── */

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 13.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Topbar ────────────────────────────────────────────────── */

export function Topbar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();
  const { mode, toggle } = useTheme();
  const pathname = usePathname();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fecha ao navegar
  useEffect(() => { setProfileOpen(false); }, [pathname]);

  // Iniciais do usuário para o avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="h-14 shrink-0 bg-surface border-b border-border flex items-center px-6 gap-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-2">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--accent-text-on)' }} />
          </svg>
        </div>
        <span className="font-display font-semibold text-text-1 text-sm">ConvertAI</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'text-accent bg-accent-soft'
                  : 'text-text-2 hover:text-text-1 hover:bg-surface-raised',
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Lado direito */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Toggle dark/light */}
        <button
          type="button"
          onClick={toggle}
          title={mode === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-3 hover:text-text-1 hover:bg-surface-raised transition-colors"
        >
          {mode === 'dark' ? <IconSun /> : <IconMoon />}
        </button>

        {/* Botão de perfil + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-accent-soft border border-accent/30 flex items-center justify-center text-accent text-xs font-bold hover:border-accent/60 transition-colors"
            title="Perfil"
          >
            {initials}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 w-56 bg-surface border border-border rounded-lg shadow-md py-1 z-50">
              {/* Info do usuário */}
              {user && (
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-text-1 truncate">{user.name}</p>
                  <p className="text-xs text-text-3 truncate">{user.email}</p>
                </div>
              )}

              {/* Meu usuário */}
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-2 hover:text-text-1 hover:bg-surface-raised transition-colors"
              >
                <IconUser />
                Meu usuário
              </Link>

              {/* Logout */}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => logout()}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-soft transition-colors disabled:opacity-40"
                >
                  <IconLogout />
                  {isPending ? 'Saindo...' : 'Sair da conta'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
