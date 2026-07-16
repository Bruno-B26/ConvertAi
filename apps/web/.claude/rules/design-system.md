# Design System — ConvertAI

O ConvertAI usa um tema **dark** como padrão global. Não há modo claro. Toda tela nova
deve seguir os tokens e padrões abaixo para manter consistência visual.

---

## Paleta de cores

| Token            | Valor Tailwind / hex        | Uso                                      |
|------------------|-----------------------------|------------------------------------------|
| Fundo global     | `bg-[#0d0d0d]`              | `html`, `body`, fundo de toda a app      |
| Fundo de card    | `bg-[#161616]`              | Cards, modais, painéis elevados          |
| Fundo de input   | `bg-[#1e1e1e]`              | Inputs, selects, textareas               |
| Borda sutil      | `border-white/10`           | Bordas de cards e inputs em repouso      |
| Borda de foco    | `border-green-500/60`       | Borda do input em foco                   |
| Ring de foco     | `ring-green-500/40`         | Ring do input em foco                    |
| Primária (ação)  | `bg-green-500` / `#22c55e`  | Botão primário, links de destaque        |
| Primária hover   | `bg-green-400`              | Hover do botão primário                  |
| Texto primário   | `text-white`                | Títulos, labels, texto de destaque       |
| Texto secundário | `text-gray-400`             | Subtítulos, descrições, placeholders     |
| Texto muted      | `text-gray-500`             | Notas de rodapé, texto de baixo relevo   |
| Texto verde      | `text-green-400`            | Links, badges, métricas positivas        |
| Erro fundo       | `bg-red-500/10`             | Fundo de banner de erro                  |
| Erro borda       | `border-red-500/20`         | Borda de banner de erro                  |
| Erro texto       | `text-red-400`              | Texto de erro inline e em banners        |
| Sucesso fundo    | `bg-green-500/10`           | Fundo de banner de sucesso               |
| Sucesso borda    | `border-green-500/20`       | Borda de banner de sucesso               |
| Sucesso texto    | `text-green-400`            | Texto de banner de sucesso               |

> **Não use valores arbitrários de cor além dos listados acima.** Se precisar de uma cor
> nova, adicione-a em `tailwind.config.ts` como token nomeado (`brand`, `surface`, etc.).

---

## Componentes base reutilizáveis

Os trechos abaixo são o padrão aprovado. Copie-os ao criar novos formulários ou telas.

### Input de texto

```tsx
<input
  className="block w-full rounded-lg bg-[#1e1e1e] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-green-500/60 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-colors"
/>
```

### Label

```tsx
<label className="block text-sm font-medium text-gray-300 mb-1.5">
  Rótulo
</label>
```

### Mensagem de erro inline (abaixo do campo)

```tsx
<p className="mt-1.5 text-xs text-red-400">{errors.campo.message}</p>
```

### Banner de erro (em bloco, dentro do form)

```tsx
<div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
  Mensagem de erro.
</div>
```

### Banner de sucesso

```tsx
<div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
  Operação realizada com sucesso.
</div>
```

### Botão primário

```tsx
<button
  type="submit"
  disabled={isPending}
  className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-[#161616] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  {isPending ? 'Carregando...' : 'Confirmar'}
</button>
```

> Texto do botão primário é **preto** (`text-black`) sobre fundo verde. Nunca use
> `text-white` em botões verdes.

### Card / container de formulário

```tsx
<div className="w-full rounded-2xl bg-[#161616] border border-white/10 p-8 shadow-2xl">
  {/* conteúdo */}
</div>
```

### Link de ação secundária

```tsx
<Link href="/destino" className="text-green-400 font-medium hover:text-green-300 transition-colors">
  Texto do link
</Link>
```

---

## Layout de telas de autenticação

O arquivo `app/(auth)/layout.tsx` implementa o padrão split-screen:

```
┌─────────────────────────┬──────────────────────────┐
│  Painel Hero (lg:)      │  Formulário               │
│  bg-[#0d0d0d]           │  centralizado             │
│  grid verde sutil       │                           │
│  Logo + headline        │  Logo (só mobile)         │
│  badge + métrica        │  <Card com o form>        │
└─────────────────────────┴──────────────────────────┘
```

- Coluna esquerda: `hidden lg:flex lg:w-1/2` — nunca visível em mobile.
- Coluna direita: `w-full lg:w-1/2` — ocupa a tela toda em mobile.
- Toda nova tela de auth deve ser um `children` do layout, não um layout próprio.

---

## Logo

O logo é inline no JSX (sem imagem externa):

```tsx
<div className="flex items-center gap-2">
  <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3 3 7-7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
  <span className="text-white font-semibold text-lg">ConvertAI</span>
</div>
```

---

## Globals CSS

`src/app/globals.css` define o fundo padrão no nível do `html`/`body` para evitar
flash de cor branca durante SSR:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html,
  body {
    @apply bg-[#0d0d0d];
  }
}
```

Não adicione mais nada neste arquivo. Todo estilo vai em classes Tailwind no JSX.
