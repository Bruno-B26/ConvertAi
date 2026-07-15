# Architecture Rules

## The Data Flow

Every screen follows the same path:

```
[1] URL                — handled by app/.../page.tsx
    ↓
[2] Middleware         — Next.js middleware.ts (auth checks, redirects)
    ↓
[3] Layout / Page      — Server Component by default
    ↓
[4] Component          — server or client component
    ↓
[5] Hook (client)      — useQuery / useMutation / custom hooks
    ↓
[6] API Service        — calls the NestJS backend
    ↓
NestJS Backend
```

For Server Components (no `'use client'`), step 5 is skipped and the API service is called directly from the page.

## What Each Layer Does

| Layer       | Can do                                                       | Cannot do                                        |
|-------------|--------------------------------------------------------------|--------------------------------------------------|
| Page        | Define a route, fetch initial data, render layout           | Have its own state, run effects, business logic  |
| Component   | Display data, forward user events                            | Fetch from the backend directly                  |
| Hook        | Manage client state, call API services, derive data         | Render JSX                                       |
| API Service | Make HTTP requests to the backend, parse the response        | Touch the DOM, manage state                      |

## Folder Structure

```
src/
├── app/                          # routes (App Router)
│   ├── layout.tsx                # root layout
│   ├── page.tsx                  # home page
│   ├── globals.css               # Tailwind directives only
│   ├── (auth)/                   # route group: login/register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (app)/                    # route group: authenticated app
│       └── users/
│           ├── page.tsx
│           ├── loading.tsx
│           ├── error.tsx
│           └── [id]/page.tsx
├── features/                     # one folder per feature
│   └── users/
│       ├── components/           # feature-specific components
│       ├── hooks/                # feature-specific hooks
│       ├── services/             # API calls for this feature
│       └── types/                # types/DTOs for this feature
├── components/
│   ├── ui/                       # generic primitives (Button, Input, Card)
│   └── layout/                   # Header, Sidebar, Footer
├── lib/
│   ├── api-client.ts             # shared fetch wrapper
│   └── utils.ts                  # general helpers
├── hooks/                        # cross-feature hooks (useDebounce, etc)
├── providers/                    # context providers (QueryClient, etc)
└── middleware.ts                 # Next.js middleware
```

## Rule of Thumb

If you don't know where to put a piece of code, ask: **"What does this code do?"**

- "It defines a URL" → `src/app/.../page.tsx`
- "It's a button that's used everywhere" → `src/components/ui/`
- "It's a form only used in the users feature" → `src/features/users/components/`
- "It calls the backend" → `src/features/<feature>/services/`
- "It manages client state for a feature" → `src/features/<feature>/hooks/`
