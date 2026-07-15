# Error Handling

Errors come from three places on the frontend. Each has its own handling.

| Where the error happens          | How to handle it                                            |
|----------------------------------|-------------------------------------------------------------|
| Server Component (page fetch)    | `error.tsx` next to the page                                |
| Client Component (TanStack Query)| Check the `error` returned by `useQuery` / `useMutation`    |
| Unexpected runtime error         | Closest `error.tsx` boundary catches it                     |

## `error.tsx` Boundary

Place an `error.tsx` next to any page that fetches data. It must be a Client Component.

```tsx
// src/app/(app)/users/error.tsx
'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function UsersError({ error, reset }: ErrorProps) {
  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-4">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <button
        onClick={reset}
        className="mt-3 rounded-md bg-red-600 px-3 py-1 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
```

## Errors in Client Components

TanStack Query gives you `isError` and `error` for free. Handle them in the component:

```tsx
const { data, isLoading, isError, error } = useUsers();

if (isLoading) return <p>Loading...</p>;
if (isError) return <p className="text-red-600">{error.message}</p>;
```

## Errors in Mutations

Show the error from the mutation, usually next to the form:

```tsx
const { mutate, isPending, error } = useCreateUser();

return (
  <form onSubmit={handleSubmit((data) => mutate(data))}>
    {/* form fields */}
    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </form>
);
```

## `not-found.tsx`

Trigger with `notFound()` from `next/navigation`. Useful when a fetched resource doesn't exist:

```tsx
// src/app/(app)/users/[id]/page.tsx
const user = await getUserById(params.id);
if (!user) notFound();
```

Place a `not-found.tsx` next to the page (or at the root for a global one):

```tsx
// src/app/(app)/users/[id]/not-found.tsx
export default function UserNotFound() {
  return <p>User not found.</p>;
}
```

## Rules

1. **Every page that fetches data has a sibling `error.tsx` and `loading.tsx`.**
2. **Don't `try/catch` in components.** Let errors bubble up to the `error.tsx` boundary, or let TanStack Query expose them.
3. **Never display the raw error to the user as-is in production.** The base API client (see `data-and-api.md`) gives you a clean `message` — use that.
4. **Don't `console.log` errors and continue.** Either show them in the UI or let them throw.
5. **The error message comes from the backend.** The backend's global filter (see backend rules) returns `{ message, statusCode, ... }` — the API client extracts `message`.
