'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { CnaeMultiselect } from './cnae-multiselect';
import { UF_OPTIONS } from '../data/ufs';
import type { SearchFilters } from '../types';

const PORTE_OPTIONS = [
  { value: '', label: 'Qualquer porte' },
  { value: 'ME', label: 'Microempresa (ME)' },
  { value: 'EPP', label: 'Pequeno porte (EPP)' },
  { value: 'DEMAIS', label: 'Médio/Grande porte' },
];

const FATURAMENTO_OPTIONS = [
  { value: '', label: 'Qualquer faixa' },
  { value: '0-50000', label: 'Até R$ 50 mil' },
  { value: '50000-360000', label: 'R$ 50 mil – R$ 360 mil' },
  { value: '360000-1000000', label: 'R$ 360 mil – R$ 1M' },
  { value: '1000000-10000000', label: 'R$ 1M – R$ 10M' },
  { value: '10000000+', label: 'Acima de R$ 10M' },
];

const SITUACAO_OPTIONS = [
  { value: 'ATIVA', label: 'Ativa' },
  { value: 'INAPTA', label: 'Inapta' },
  { value: 'BAIXADA', label: 'Baixada' },
  { value: 'SUSPENSA', label: 'Suspensa' },
];

const searchSchema = z
  .object({
    cnae: z.array(z.string()),
    uf: z.string(),
    municipio: z.string(),
    situacaoCadastral: z.enum(['ATIVA', 'INAPTA', 'BAIXADA', 'SUSPENSA']),
    porte: z.string(),
    faturamento: z.string(),
    dataAberturaMin: z.string(),
    dataAberturaMax: z.string(),
    somenteMei: z.boolean(),
    comContato: z.boolean(),
    limite: z.coerce.number().min(1, 'Mínimo 1').max(1000, 'Máximo 1000'),
  })
  .refine(
    (data) => data.cnae.length > 0 || data.uf !== '',
    { message: 'Informe ao menos um segmento (CNAE) ou selecione um estado', path: ['cnae'] },
  )
  .refine(
    (data) => !(data.municipio && !data.uf),
    { message: 'Selecione o estado antes de informar o município', path: ['municipio'] },
  );

type SearchFormData = z.infer<typeof searchSchema>;

const DEFAULT_VALUES: SearchFormData = {
  cnae: [],
  uf: '',
  municipio: '',
  situacaoCadastral: 'ATIVA',
  porte: '',
  faturamento: '',
  dataAberturaMin: '',
  dataAberturaMax: '',
  somenteMei: false,
  comContato: false,
  limite: 100,
};

interface SearchFiltersFormProps {
  onSearch: (filters: SearchFilters) => void;
  isSearching: boolean;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex w-11 h-6 rounded-full transition-colors shrink-0',
        checked ? 'bg-green-500' : 'bg-white/10',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  );
}

export function SearchFiltersForm({ onSearch, isSearching }: SearchFiltersFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const selectedUf = watch('uf');

  useEffect(() => {
    if (!selectedUf) setValue('municipio', '');
  }, [selectedUf, setValue]);

  const inputClass =
    'block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors';

  const selectClass = clsx(inputClass, 'appearance-none cursor-pointer pr-8');

  return (
    <form onSubmit={handleSubmit((d) => onSearch(d as SearchFilters))} className="rounded-xl bg-[#161616] border border-white/10 p-5 space-y-4">
      {/* Row 1: CNAE + Estado + Município */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* CNAE */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Segmento (CNAE)</label>
          <Controller
            name="cnae"
            control={control}
            render={({ field }) => (
              <CnaeMultiselect value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Estado</label>
          <div className="relative">
            <select {...register('uf')} className={selectClass}>
              <option value="">Qualquer estado</option>
              {UF_OPTIONS.map((uf) => (
                <option key={uf.value} value={uf.value}>{uf.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        {/* Município */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Município</label>
          <input
            {...register('municipio')}
            placeholder={selectedUf ? 'Cidade...' : 'Selecione o estado'}
            disabled={!selectedUf}
            className={clsx(inputClass, !selectedUf && 'opacity-40 cursor-not-allowed')}
          />
          {errors.municipio && (
            <p className="mt-1 text-xs text-red-400">{errors.municipio.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Porte + Faturamento + Submit */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {/* Porte */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Porte</label>
            <div className="relative">
              <select {...register('porte')} className={selectClass}>
                {PORTE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Faturamento */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Faturamento</label>
            <div className="relative">
              <select {...register('faturamento')} className={selectClass}>
                {FATURAMENTO_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-lg bg-green-500 px-8 py-2.5 text-sm font-semibold text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Buscando...
            </span>
          ) : (
            'Buscar leads'
          )}
        </button>
      </div>

      {/* CNAE validation error */}
      {errors.cnae && (
        <p className="text-xs text-red-400">{errors.cnae.message}</p>
      )}

      {/* Advanced toggle */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown className={clsx('transition-transform', advancedOpen && 'rotate-180')} />
          Filtros avançados
        </button>
      </div>

      {/* Advanced section */}
      {advancedOpen && (
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Situação Cadastral */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Situação Cadastral</label>
              <div className="relative">
                <select {...register('situacaoCadastral')} className={selectClass}>
                  {SITUACAO_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Data de abertura mín */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Abertura a partir de</label>
              <input
                type="date"
                {...register('dataAberturaMin')}
                className={clsx(inputClass, '[color-scheme:dark]')}
              />
            </div>

            {/* Data de abertura máx */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Abertura até</label>
              <input
                type="date"
                {...register('dataAberturaMax')}
                className={clsx(inputClass, '[color-scheme:dark]')}
              />
            </div>

            {/* Limite */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Limite de leads
                <span className="ml-1 text-gray-600">(máx. 1000)</span>
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                {...register('limite', { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.limite && (
                <p className="mt-1 text-xs text-red-400">{errors.limite.message}</p>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <Controller
              name="somenteMei"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Toggle checked={field.value} onChange={field.onChange} />
                  <span className="text-sm text-gray-300">Somente MEI</span>
                </label>
              )}
            />
            <Controller
              name="comContato"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Toggle checked={field.value} onChange={field.onChange} />
                  <span className="text-sm text-gray-300">Apenas com telefone ou e-mail</span>
                </label>
              )}
            />
          </div>
        </div>
      )}
    </form>
  );
}
