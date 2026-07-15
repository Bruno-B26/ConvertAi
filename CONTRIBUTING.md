# Contributing

## Local development

```bash
# 1. Install dependencies (from the repo root)
npm install

# 2. Create environment files from the examples
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your local MongoDB URI and port

# 3. Start both apps in dev mode
npm run dev

# Or start them individually:
npm run dev -w apps/api    # NestJS on http://localhost:3001
npm run dev -w apps/web    # Next.js  on http://localhost:3000
```

## Adding a backend feature

1. Read `apps/api/.claude/rules/architecture.md` — every request follows the same flow (Controller → Service → Repository).
2. Read `apps/api/.claude/rules/modules.md` — each feature lives in its own module under `src/modules/`.
3. Generate the module, controller, service, and repository with the Nest CLI (`nest g module`, etc.).
4. Add DTOs with `class-validator` decorators for every endpoint that accepts a body.
5. Write unit tests for the service and e2e tests for the controller.

## Adding a frontend feature

1. Read `apps/web/.claude/rules/features.md` — understand how features are structured.
2. Read `apps/web/.claude/rules/routing.md` — pages live under `src/app/` following the Next.js App Router conventions.
3. Create your page/component in the appropriate directory.
4. Use existing shared components from `src/components/` before creating new ones.

## Before opening a PR

```bash
npm run lint     # fix all lint errors
npm run build    # make sure both apps compile
npm run test     # run all tests
```

- If you added a new environment variable, add it to `apps/api/.env.example`.
- One feature per branch, one feature per pull request.
- Never commit `.env`, `node_modules/`, `dist/`, or `.next/`.
