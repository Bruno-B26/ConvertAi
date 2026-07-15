# Routing Rules (App Router)

In the App Router, **the folder structure inside `src/app/` IS your routing**. Files have special names that Next.js recognizes.

## Special Files

| File              | What it does                                                          |
|-------------------|-----------------------------------------------------------------------|
| `page.tsx`        | The page itself (must export a default React component)               |
| `layout.tsx`      | Wraps all child pages (header, sidebar, providers go here)            |
| `loading.tsx`     | Shown while a server component is loading                             |
| `error.tsx`       | Shown when a page throws an error (must be a Client Component)        |
| `not-found.tsx`   | Shown when `notFound()` is called or a route doesn't exist            |
| `route.ts`        | Defines an HTTP endpoint (we **don't use these** — backend is NestJS) |

## Folder Conventions

| Folder name        | What it means                                                           |
|--------------------|-------------------------------------------------------------------------|
| `users/`           | Static segment → `/users`                                               |
| `[id]/`            | Dynamic segment → `/users/123`                                          |
| `(auth)/`          | Route group → doesn't appear in the URL, just organizes files          |
| `_components/`     | Private folder → ignored by routing (good for colocating helpers)       |

## Example Page

```tsx
// src/app/(app)/users/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getUserById } from '@/features/users/services/users-api';
import { UserCard } from '@/features/users/components/user-card';

interface PageProps {
  params: { id: string };
}

export default async function UserDetailPage({ params }: PageProps) {
  const user = await getUserById(params.id);
  if (!user) notFound();

  return (
    <main className="container mx-auto p-6">
      <UserCard user={user} />
    </main>
  );
}
```

## Layout Example

```tsx
// src/app/(app)/layout.tsx
import { Header } from '@/components/layout/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
```

## Rules

1. **`page.tsx` is a Server Component by default.** Don't add `'use client'` to it. If you need interactivity, build a Client Component inside `features/` and import it here.
2. **`page.tsx` fetches initial data.** Use `await` on an API service. The page can be `async`.
3. **Use `loading.tsx` and `error.tsx`** in each route folder that fetches data. Don't handle loading/error states inside the page itself.
4. **Use route groups (`(name)/`) to share a layout** across pages without affecting the URL. Good for splitting `(auth)` and `(app)` sections.
5. **Use `notFound()` from `next/navigation`** to trigger the 404 page when data is missing.
6. **Metadata for SEO** goes in a `metadata` export from the page or layout:
   ```tsx
   export const metadata = { title: 'Users' };
   ```

## Next.js Middleware

`src/middleware.ts` runs before every matching request. Use it for auth checks and redirects only.

```ts
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|register|_next|api).*)'],
};
```

**Rules for middleware:**
- No data fetching, no heavy logic. Keep it fast — it runs on every request.
- Only one `middleware.ts` per project (at the root of `src/`).
