# Roadmap de Desenvolvimento — MVP

## Status Atual

**Fase 1 concluída.** A estrutura geral está pronta e rodando. Ambas as apps
compilam e sobem sem erros. O banco de dados está containerizado.

---

## Fase 1 — Fundação ✅ CONCLUÍDA

O que foi feito:

- [x] Monorepo npm workspaces configurado
- [x] Docker Compose (MongoDB 7 na porta 27018 + Mongo Express na 8081)
- [x] NestJS scaffold completo:
  - `main.ts` com ValidationPipe global, CORS, GlobalExceptionFilter
  - `app.module.ts` com ConfigModule, DatabaseModule e todos os módulos
  - `config/configuration.ts` com todas as env vars tipadas
  - `database/database.module.ts` com MongooseModule async
  - `common/filters/http-exception.filter.ts` — formato padrão de erro
  - `common/guards/jwt-auth.guard.ts` — guard JWT (usa passport-jwt)
  - `common/guards/webhook-secret.guard.ts` — guard para callbacks do n8n
  - `common/decorators/current-user.decorator.ts` — `@CurrentUser()`
  - `common/middlewares/request-id.middleware.ts` — X-Request-Id
  - `modules/auth/strategies/jwt.strategy.ts` — JwtStrategy configurada
  - Skeletons dos módulos: auth, accounts, users, campaigns, leads, dispatches, webhooks
- [x] Next.js 15 scaffold completo:
  - App Router com route groups `(auth)` e `(app)`
  - `middleware.ts` — redireciona para `/login` se sem cookie
  - `providers/query-provider.tsx` — TanStack Query configurado
  - `lib/api-client.ts` — fetch wrapper tipado com `credentials: 'include'`
  - Estrutura de features: auth, campaigns, leads, dispatches, dashboard
  - Layouts placeholder para `(auth)` e `(app)`
- [x] Documentação técnica em `docs/`

---

## Fase 2 — Autenticação

**Pré-requisito para tudo. Implementar primeiro.**

### Backend (`modules/auth` + `modules/accounts` + `modules/users`)

- [ ] `Account` schema + repository
- [ ] `User` schema + repository
- [ ] `POST /auth/register` — cria Account + User (owner), retorna JWT
- [ ] `POST /auth/login` — valida senha, retorna JWT
- [ ] `GET /auth/me` — retorna dados do usuário logado
- [ ] `POST /auth/forgot-password` — gera token, envia email
- [ ] `POST /auth/reset-password` — valida token, troca senha
- [ ] `GET /accounts/me` — dados da account do usuário logado
- [ ] `PATCH /accounts/me` — atualizar nome/settings

### Frontend (`features/auth`)

- [ ] Tela de login (`app/(auth)/login/page.tsx`)
- [ ] Tela de registro (`app/(auth)/register/page.tsx`)
- [ ] Tela de recuperação de senha (`app/(auth)/forgot-password/page.tsx`)
- [ ] Hook `useAuth` + serviço `auth-api.ts`
- [ ] Armazenar JWT no cookie `access_token` após login
- [ ] Logout (apagar cookie, redirecionar para /login)

---

## Fase 3 — Campanhas

### Backend (`modules/campaigns`)

- [ ] `Campaign` schema + repository
- [ ] `GET /campaigns` — lista com paginação e filtro por status
- [ ] `POST /campaigns` — criar campanha (status: draft)
- [ ] `GET /campaigns/:id` — detalhes + métricas
- [ ] `PATCH /campaigns/:id` — editar nome, descrição, searchFilter, dispatchConfig
- [ ] `DELETE /campaigns/:id` — soft delete (campo `deletedAt`)
- [ ] `PATCH /campaigns/:id/pause` e `/resume`

### Frontend (`features/campaigns`)

- [ ] Lista de campanhas com status e métricas resumidas
- [ ] Formulário de criação de campanha
- [ ] Formulário de filtros de busca (CNAE, localização, porte, limite)
- [ ] Formulário de configuração de disparo (template + variáveis + rate limit)
- [ ] Página de detalhes da campanha com métricas

---

## Fase 4 — Busca e Revisão de Leads

### Backend (`modules/leads` + integração n8n)

- [ ] `Lead` schema + repository
- [ ] `POST /campaigns/:id/search` — dispara webhook ao n8n
- [ ] `POST /webhooks/leads-result` — recebe leads do n8n, persiste, atualiza Campaign
- [ ] `GET /campaigns/:id/leads` — lista paginada com filtros
- [ ] `PATCH /leads/:id` — aprovar/rejeitar/anotar
- [ ] `POST /campaigns/:id/leads/bulk` — aprovar/rejeitar em massa
- [ ] `GET /campaigns/:id/leads/export` — CSV download
- [ ] `POST /campaigns/:id/dispatch` — dispara webhook ao n8n

### Frontend (`features/leads`)

- [ ] Tabela de leads com paginação e filtro por status
- [ ] Aprovação/rejeição individual (botões na linha)
- [ ] Seleção em massa + botão de aprovar/rejeitar tudo selecionado
- [ ] Exportar CSV
- [ ] Estado de loading enquanto aguarda n8n (`status: 'searching'`)

---

## Fase 5 — Disparo e Acompanhamento

### Backend (`modules/dispatches` + `modules/webhooks`)

- [ ] `Dispatch` schema + repository
- [ ] `POST /webhooks/dispatch-status` — atualiza Dispatch, Lead, métricas da Campaign
- [ ] `GET /campaigns/:id/dispatches` — histórico de mensagens

### Frontend (`features/dispatches`)

- [ ] Histórico de mensagens com status (enviada, entregue, respondida, falhou)
- [ ] Indicador de progresso do disparo em tempo real (polling)

---

## Fase 6 — Dashboard e Settings

### Backend

- [ ] `GET /dashboard` — métricas agregadas de todas as campanhas
- [ ] `POST /accounts/me/whatsapp-connect` — inicia flow de QR code
- [ ] `POST /webhooks/whatsapp-qr` — recebe QR do n8n
- [ ] `POST /webhooks/whatsapp-connected` — confirma conexão

### Frontend (`features/dashboard` + settings)

- [ ] Funil visual: encontrados → aprovados → enviados → entregues → respondidos → reuniões → conversões
- [ ] Cards de métricas globais
- [ ] Tela de settings com conexão WhatsApp (exibir QR code via polling)

---

## Ordem de Trabalho Recomendada para Dois Devs em Paralelo

```
Dev A                          Dev B
─────────────────────────────────────────────────────────
Fase 2: Auth backend    ◄──►   Fase 2: Auth frontend
Fase 3: Campaigns API   ◄──►   Fase 3: Campaigns UI
Fase 4: Leads API       ◄──►   Fase 4: Leads UI
Fase 5: Dispatch API    ◄──►   Fase 5: Dispatch UI
Fase 6: Dashboard API   ◄──►   Fase 6: Dashboard UI
```

A fronteira entre os dois é o contrato da API (`docs/api-routes.md`).
Backend implementa primeiro o endpoint; frontend mocka a resposta até o endpoint existir.
