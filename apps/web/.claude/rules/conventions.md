# Coding Conventions

## TypeScript

- Use `strict: true` in `tsconfig.json` (Next.js sets this by default).
- Avoid `any`. If you really need it, leave a comment explaining why.
- Use the `@/` alias for imports from `src/`:
  ```ts
  import { Button } from '@/components/ui/button';
  ```

## File and Symbol Naming

| Thing                | How to name it          | Example                          |
|----------------------|-------------------------|----------------------------------|
| File                 | `kebab-case`            | `user-card.tsx`                  |
| React component      | `PascalCase`            | `UserCard`                       |
| Hook                 | `camelCase`, starts `use` | `useUsers`                     |
| Variable/function    | `camelCase`             | `getUserById`                    |
| Constant             | `UPPER_SNAKE_CASE`      | `MAX_RESULTS`                    |
| Type / interface     | `PascalCase`            | `User`, `CreateUserDto`          |
| App Router files     | exact special names     | `page.tsx`, `layout.tsx`, etc.   |

## Exports

- **Named exports for components, hooks, services, types.**
- **`export default` only for App Router files** (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`) — Next.js requires it.

## Imports

Group imports in this order, with a blank line between groups:

```ts
// 1. External packages
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Aliased imports (your own code via @/)
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

// 3. Relative imports (same feature)
import { getUserById } from '../services/users-api';
import type { User } from '../types/user';
```

## Tailwind CSS

- **Use Tailwind classes directly in JSX.** Don't create `.module.css` files.
- **For conditional classes**, use the `clsx` package:
  ```tsx
  import clsx from 'clsx';

  <button className={clsx('rounded px-4 py-2', isActive && 'bg-blue-600')} />
  ```
- **Don't write inline `style={{ ... }}`** unless the value is truly dynamic (e.g. a calculated width).
- **Long class lists are fine.** That's how Tailwind works — don't try to extract them prematurely.
- **For repeated patterns (3+ uses), extract a component**, not a CSS class. Example: a `Button` component with built-in styles.
- **Custom colors and fonts** go in `tailwind.config.ts`. Never use arbitrary values like `text-[#FF5733]` for brand colors.
- **The only CSS file** is `src/app/globals.css`, which only contains:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

## Environment Variables

- **Public variables** (visible in the browser) must start with `NEXT_PUBLIC_`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```
- **Server-only secrets** have no prefix and are only available in Server Components / route handlers.
- **Keep `.env.example` up to date** with every variable the app needs.

## Async Code

- Always use `async/await`. Don't mix it with `.then()` / `.catch()` chains.
- Always `await` your promises — forgetting `await` is a common bug.

## Git

- One feature per branch, one feature per pull request.
- Commit messages describe what changed: `add user creation form`.
- Never commit `.env.local`, `node_modules/`, or `.next/`.
