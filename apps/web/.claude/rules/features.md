# Feature Rules

A **feature** is a folder under `src/features/` that contains everything related to one part of the app: components, hooks, API calls, and types.

## When to create a new feature

Create a new feature folder when you start a new domain area. Examples: `users`, `auth`, `products`, `orders`. These usually match the backend modules one-to-one.

Don't create a feature folder for something used everywhere (like a generic Button) — that goes in `src/components/ui/`.

## Feature Template

Every feature folder looks like this:

```
src/features/users/
├── components/
│   ├── user-list.tsx           # only used inside the users feature
│   └── user-card.tsx
├── hooks/
│   ├── use-users.ts            # useQuery wrapper
│   └── use-create-user.ts      # useMutation wrapper
├── services/
│   └── users-api.ts            # functions that call the backend
└── types/
    └── user.ts                 # User, CreateUserDto, etc.
```

## What goes where

| File                     | Contents                                              |
|--------------------------|-------------------------------------------------------|
| `components/*.tsx`       | React components used **only** inside this feature    |
| `hooks/use-*.ts`         | React hooks (`useQuery`, `useMutation`, custom logic) |
| `services/*-api.ts`      | Functions like `getUsers()`, `createUser(...)` that hit the backend |
| `types/*.ts`             | TypeScript types and Zod schemas for this feature     |

## Rules

1. **A page imports from a feature, never the other way around.** `app/users/page.tsx` imports `UserList` from `features/users/components/`. The feature never imports from `app/`.
2. **One feature doesn't import another feature's internals.** If `OrdersFeature` needs user data, it calls a public hook from the users feature, never `users/services/users-api.ts` directly.
3. **Generic stuff (used by multiple features) lives in `src/components/ui/` or `src/lib/`.** Don't duplicate it inside a feature.
4. **Match the backend modules when possible.** If the backend has a `users` module, the frontend has a `users` feature. This makes the codebase easier to navigate.
