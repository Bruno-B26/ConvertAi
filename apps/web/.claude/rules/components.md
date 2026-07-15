# Component Rules

The biggest decision in the App Router is **Server Component or Client Component**. Get this right and most other things fall into place.

## Server Components (default)

Every component is a Server Component **unless you write `'use client'` at the top**.

Server Components:
- Run on the server only. Never sent to the browser as JavaScript.
- Can `await` data directly. Great for pages and read-only displays.
- **Cannot** use `useState`, `useEffect`, `onClick`, or any browser API.

## Client Components

A Client Component is any file that starts with `'use client'`. Once a component is a Client Component, everything imported into it also runs on the client.

Use Client Components only when you need:
- React state (`useState`, `useReducer`)
- Effects (`useEffect`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `localStorage`)
- TanStack Query hooks (`useQuery`, `useMutation`)

## How to decide

Ask: **"Does this component need to react to something the user does?"**

- No → Server Component (no directive needed)
- Yes → Client Component (`'use client'` at the top)

## Example: Server Component

```tsx
// src/features/users/components/user-card.tsx
import type { User } from '../types/user';

export function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{user.displayName ?? user.email}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
}
```

## Example: Client Component

```tsx
// src/features/users/components/user-search.tsx
'use client';

import { useState } from 'react';

export function UserSearch({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState('');

  return (
    <input
      type="text"
      value={term}
      onChange={(e) => {
        setTerm(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder="Search users..."
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  );
}
```

## Rules

1. **Default to Server Components.** Add `'use client'` only when you need it.
2. **Push `'use client'` as deep as possible.** Don't mark a whole page as a client component just because one button needs `onClick`. Make the button a small client component instead.
3. **Components are named exports.** No `export default` (except `page.tsx` and `layout.tsx`, which Next.js requires).
4. **Props are typed with an `interface` or `type`** right above the component.
5. **Keep components small.** If a component exceeds ~150 lines, split it.
6. **No business logic in components.** Components render data and forward events. Logic goes in hooks or services.
7. **Conditional class names**: use the `clsx` package (or `cn` helper). Don't build strings with `+` or template literals.
