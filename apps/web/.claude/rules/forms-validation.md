# Forms & Validation

Every form uses **React Hook Form** (for state) and **Zod** (for validation). One pattern across the whole app.

## The Schema

Define the form's shape and validation rules in one place with Zod:

```ts
// src/features/users/types/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
```

The same Zod schema gives you both validation **and** the TypeScript type. Don't define them separately.

## The Form Component

```tsx
// src/features/users/components/create-user-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUserSchema, type CreateUserDto } from '../types/user';
import { useCreateUser } from '../hooks/use-create-user';

export function CreateUserForm() {
  const { mutate, isPending } = useCreateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = (data: CreateUserDto) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register('password')}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create user'}
      </button>
    </form>
  );
}
```

## Rules

1. **Every form is a Client Component** (`'use client'` at the top) — forms need state and event handlers.
2. **One Zod schema per form**, exported from `features/<feature>/types/`. Reuse it on the backend if you can.
3. **Inputs are registered with `register('fieldName')`**. Don't manage form state with `useState`.
4. **Display errors next to the field** using `errors.fieldName?.message`.
5. **Disable the submit button while `isPending`** to prevent double submission.
6. **Submission goes through a mutation hook**, not directly through the API service. The hook handles cache invalidation.
7. **For reusable inputs**, build wrapper components (`<TextField name="email" />`) in `src/components/ui/` once you have 3+ forms.
