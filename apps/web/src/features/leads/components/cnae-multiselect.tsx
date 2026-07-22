'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { CNAE_OPTIONS, type CnaeOption } from '../data/cnaes';

interface CnaeMultiselectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CnaeMultiselect({ value, onChange }: CnaeMultiselectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = useMemo<CnaeOption[]>(() => {
    const q = search.toLowerCase().trim();
    if (!q) return CNAE_OPTIONS;
    return CNAE_OPTIONS.filter(
      (c) =>
        c.code.includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q),
    );
  }, [search]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, CnaeOption[]> = {};
    for (const option of filtered) {
      if (!groups[option.sector]) groups[option.sector] = [];
      groups[option.sector].push(option);
    }
    return groups;
  }, [filtered]);

  function toggle(code: string) {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  }

  const firstSelected = value.length > 0
    ? CNAE_OPTIONS.find((c) => c.code === value[0])
    : null;

  const triggerLabel =
    value.length === 0
      ? null
      : value.length === 1
      ? firstSelected?.description
      : `${value.length} segmentos selecionados`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
          'bg-[#1e1e1e] border',
          open
            ? 'border-green-500/60 ring-1 ring-green-500/40'
            : 'border-white/10 hover:border-white/20',
        )}
      >
        <span className="flex-1 truncate">
          {triggerLabel ? (
            <span className="text-white">{triggerLabel}</span>
          ) : (
            <span className="text-gray-500">Todos os segmentos</span>
          )}
        </span>
        <ChevronDown className={clsx('shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[480px] max-w-[calc(100vw-2rem)] max-h-80 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="p-2 border-b border-white/10 shrink-0">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar segmento ou código CNAE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#161616] border border-white/10 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {Object.keys(groupedFiltered).length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">Nenhum segmento encontrado</p>
            ) : (
              Object.entries(groupedFiltered).map(([sector, options]) => (
                <div key={sector}>
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#1e1e1e]">
                    {sector}
                  </p>
                  {options.map((option) => {
                    const checked = value.includes(option.code);
                    return (
                      <label
                        key={option.code}
                        className={clsx(
                          'flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors',
                          checked ? 'bg-green-500/10' : 'hover:bg-white/5',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(option.code)}
                          className="mt-0.5 accent-green-500 w-4 h-4 shrink-0"
                        />
                        <span className="flex-1 min-w-0">
                          <span className={clsx('block text-sm leading-snug', checked ? 'text-white' : 'text-gray-300')}>
                            {option.description}
                          </span>
                          <span className="text-xs text-gray-500">{option.code}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {value.length > 0 && (
            <div className="p-2 border-t border-white/10 shrink-0 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {value.length} selecionado{value.length > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
