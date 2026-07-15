# CLAUDE.md — ConvertAI

## O que é este projeto

**ConvertAI** é um SaaS B2B/B2C de prospecção automatizada de leads via WhatsApp.
O usuário define filtros (CNAE, localização, porte), o sistema busca leads, o usuário
revisa e aprova, configura uma campanha de disparo e acompanha resultados num dashboard.

Toda integração externa (busca de leads, disparo de WhatsApp) é orquestrada pelo **n8n**
via webhooks — o backend nunca chama APIs externas diretamente.

## Estrutura do Monorepo

```
ConvertAI/
├── apps/api/        # NestJS — REST API + lógica de negócio
├── apps/web/        # Next.js 15 App Router — frontend
├── docker/          # docker-compose (MongoDB 7 + Mongo Express)
└── docs/            # documentação técnica detalhada
```

## Comandos Raiz

```bash
npm run dev:full     # comando único: sobe Docker (Mongo) + api (3001) + web (3000)
npm run dev          # sobe só api (3001) + web (3000) em paralelo, sem tocar no Docker
npm run build        # build de todos os workspaces
npm run lint         # lint de todos os workspaces
npm run test         # testes de todos os workspaces
```

`dev:full` exige Docker Desktop **aberto** (não só instalado). Detalhes e troubleshooting
em `docs/environment-setup.md`.

Para um workspace só: `npm run dev -w apps/api` ou `npm run dev -w apps/web`.

## Regras de Ouro

1. Rode comandos da **raiz do repo** — npm workspaces roteia para o app certo.
2. Backend **nunca** chama APIs externas diretamente. Toda integração passa pelo n8n via webhook.
3. Cada feature nova: uma branch, um PR, nunca misturar features no mesmo PR.
4. Não commitar `.env`, `.env.local`, `node_modules/`, `.next/`, `dist/`.

## Documentação Detalhada

Leia antes de implementar qualquer feature:

@docs/product-context.md
@docs/data-model.md
@docs/api-routes.md
@docs/development-roadmap.md
@docs/environment-setup.md
@docs/auth.md

## Onde Estão as Regras de Código

- Backend (NestJS) → `apps/api/.claude/CLAUDE.md`
- Frontend (Next.js) → `apps/web/.claude/rules/CLAUDE.md`
