# CLAUDE.md

## Monorepo Overview

This is an npm workspaces monorepo with two apps:

- **apps/web** — Next.js frontend (App Router)
- **apps/api** — NestJS backend (REST API)

Each app has its **own `CLAUDE.md`** and **`.claude/rules/`** with detailed conventions for that app.

## Root Commands

```bash
npm run dev        # run both apps in parallel (concurrently)
npm run build      # build all workspaces
npm run lint       # lint all workspaces
npm run test       # test all workspaces
```

## Where to Find Detailed Rules

- Working on the **frontend**? Read `apps/web/CLAUDE.md`
- Working on the **backend**? Read `apps/api/CLAUDE.md`

Do **not** duplicate app-specific rules here. This file only covers monorepo-level concerns.

## Golden Rules

1. Run commands from the **repo root** — npm workspaces handles routing to the correct app.
2. To target a single app: `npm run dev -w apps/web` or `npm run dev -w apps/api`.
3. Do not commit `node_modules/`, `.next/`, `dist/`, `.env`, or `.env.local`.
