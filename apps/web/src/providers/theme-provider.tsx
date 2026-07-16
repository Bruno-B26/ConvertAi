'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'dark' | 'light';

interface ThemeContextValue {
  mode: Mode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('dark');

  // Lê a preferência salva ou do sistema na montagem
  useEffect(() => {
    const saved = localStorage.getItem('theme-mode') as Mode | null;
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setMode('light');
    }
  }, []);

  // Aplica o atributo no <html>
  useEffect(() => {
    const html = document.documentElement;
    if (mode === 'light') {
      html.setAttribute('data-mode', 'light');
    } else {
      html.removeAttribute('data-mode');
    }
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggle = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
