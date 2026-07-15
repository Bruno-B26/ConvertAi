# Data Fetching & API Calls

The frontend never talks to MongoDB. It talks to the **NestJS backend** over HTTP. Always.

## The Layers

```
Component → Hook → API Service → fetch() → NestJS Backend
```

- **API Service**: a plain function that calls `fetch` and returns typed data.
- **Hook**: wraps the API service with TanStack Query (`useQuery` for reads, `useMutation` for writes).
- **Component**: calls the hook (in Client Components) or the API service directly (in Server Components).

## The Base API Client

A single fetch wrapper that adds the base URL, headers, and error handling.

```ts
// src/lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `Request failed: ${response.status}`);
  }

  return response.json();
}
```

## API Service Example

A typed function per backend endpoint. One file per feature.

```ts
// src/features/users/services/users-api.ts
import { apiClient } from '@/lib/api-client';
import type { User, CreateUserDto } from '../types/user';

export function getUsers() {
  return apiClient<User[]>('/users');
}

export function getUserById(id: string) {
  return apiClient<User>(`/users/${id}`);
}

export function createUser(dto: CreateUserDto) {
  return apiClient<User>('/users', { method: 'POST', body: dto });
}
```

## Hook Example (Client Components)

Use TanStack Query for client-side data. It handles caching, loading states, and refetching automatically.

```ts
// src/features/users/hooks/use-users.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser } from '../services/users-api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

## Using in Components

**Server Component (page):**

```tsx
import { getUsers } from '@/features/users/services/users-api';

export default async function UsersPage() {
  const users = await getUsers();
  return <UserList users={users} />;
}
```

**Client Component:**

```tsx
'use client';
import { useUsers } from '@/features/users/hooks/use-users';

export function UserList() {
  const { data, isLoading, error } = useUsers();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load.</p>;
  return <ul>{data?.map((u) => <li key={u.id}>{u.email}</li>)}</ul>;
}
```

## Rules

1. **Never call `fetch` inside a component.** Go through an API service.
2. **API services return typed data.** Use `apiClient<User>(...)`, not `apiClient<any>(...)`.
3. **Types match the backend DTOs.** Keep them in sync manually for now (or generate from OpenAPI if the backend exposes it).
4. **Use TanStack Query in Client Components, not `useState` + `useEffect`.** Manual fetching is bug-prone (no caching, no retries, race conditions).
5. **Don't store server data in React Context.** TanStack Query already caches globally.
6. **Use `useQuery` for reads, `useMutation` for writes.** After a mutation, `invalidateQueries` to refetch the affected data.
7. **The backend URL goes in `NEXT_PUBLIC_API_URL`** in `.env.local`. Never hard-code URLs.
