# API Routes — ConvertAI

Base URL: `http://localhost:3001/api` (dev) / `https://api.seudominio.com/api` (prod)

Todas as rotas (exceto Auth e Webhooks) exigem `Authorization: Bearer <jwt>`.
O backend extrai `accountId` do JWT — **nunca aceitar `accountId` como parâmetro do cliente**.

---

## Auth — público, sem JWT

| Método | Rota                        | Body                                      | Retorno                  |
|--------|-----------------------------|-------------------------------------------|--------------------------|
| POST   | `/auth/register`            | `{ name, email, password }`               | `{ accessToken, user }`  |
| POST   | `/auth/login`               | `{ email, password }`                     | `{ accessToken, user }`  |
| POST   | `/auth/forgot-password`     | `{ email }`                               | `{ message }`            |
| POST   | `/auth/reset-password`      | `{ token, newPassword }`                  | `{ message }`            |
| GET    | `/auth/me`                  | —                                         | `UserResponseDto`        |

`/auth/register` cria a Account e o User (owner) atomicamente.

---

## Accounts — tenant do usuário logado

| Método | Rota           | Body                          | Retorno              |
|--------|----------------|-------------------------------|----------------------|
| GET    | `/accounts/me` | —                             | `AccountResponseDto` |
| PATCH  | `/accounts/me` | `{ name?, settings? }`        | `AccountResponseDto` |
| POST   | `/accounts/me/whatsapp-connect` | —                  | `{ message }`        |

`POST /whatsapp-connect` dispara o webhook ao n8n para iniciar o flow de QR code.
O QR chegará via `POST /webhooks/whatsapp-qr` e ficará em `account.settings.whatsappQrCode`.
O frontend faz polling em `GET /accounts/me` para exibir o QR assim que chegar.

---

## Campaigns

| Método | Rota                          | Body / Query                       | Retorno                    |
|--------|-------------------------------|------------------------------------|----------------------------|
| GET    | `/campaigns`                  | `?page&limit&status`               | `{ data, total, page }`    |
| POST   | `/campaigns`                  | `{ name, description, objective }` | `CampaignResponseDto`      |
| GET    | `/campaigns/:id`              | —                                  | `CampaignResponseDto`      |
| PATCH  | `/campaigns/:id`              | `{ name?, description?, searchFilter?, dispatchConfig? }` | `CampaignResponseDto` |
| DELETE | `/campaigns/:id`              | —                                  | `{ message }`              |
| POST   | `/campaigns/:id/search`       | —                                  | `{ message, correlationId }` |
| POST   | `/campaigns/:id/dispatch`     | —                                  | `{ message, correlationId }` |
| PATCH  | `/campaigns/:id/pause`        | —                                  | `CampaignResponseDto`      |
| PATCH  | `/campaigns/:id/resume`       | —                                  | `CampaignResponseDto`      |

**`POST /campaigns/:id/search`:** valida que `campaign.searchFilter` está preenchido,
gera `correlationId`, salva em `n8nSearchCorrelationId`, dispara webhook ao n8n,
muda `status` para `'searching'`.

**`POST /campaigns/:id/dispatch`:** valida que há leads `'approved'` e que
`dispatchConfig` está preenchido, gera `correlationId`, salva em
`n8nDispatchCorrelationId`, dispara webhook ao n8n, muda `status` para `'running'`.

---

## Leads

| Método | Rota                                | Body / Query                          | Retorno                      |
|--------|-------------------------------------|---------------------------------------|------------------------------|
| GET    | `/campaigns/:id/leads`              | `?page&limit&status&search`           | `{ data, total, page }`      |
| PATCH  | `/leads/:id`                        | `{ status?, notes? }`                 | `LeadResponseDto`            |
| POST   | `/campaigns/:id/leads/bulk`         | `{ action: 'approve'|'reject', leadIds: string[] }` | `{ updated: number }` |
| GET    | `/campaigns/:id/leads/export`       | `?status`                             | CSV download                 |

`PATCH /leads/:id` aceita apenas `status: 'approved' | 'rejected'` e `notes` —
o usuário não pode setar `'delivered'`, `'replied'`, etc. (esses vêm do n8n).

---

## Dispatches

| Método | Rota                           | Query              | Retorno                   |
|--------|--------------------------------|--------------------|---------------------------|
| GET    | `/campaigns/:id/dispatches`    | `?page&limit&status` | `{ data, total, page }` |

---

## Dashboard

| Método | Rota          | Query                | Retorno                        |
|--------|---------------|----------------------|--------------------------------|
| GET    | `/dashboard`  | `?from&to`           | Métricas agregadas de todas as campanhas da account |

---

## Webhooks — autenticados por X-Webhook-Secret, não por JWT

Header obrigatório: `X-Webhook-Secret: <WEBHOOK_SECRET>`

| Método | Rota                                 | Quem chama | O que acontece                                      |
|--------|--------------------------------------|------------|-----------------------------------------------------|
| POST   | `/webhooks/leads-result`             | n8n        | Persiste leads, atualiza `Campaign.metrics.leadsFound`, status → `'review'` |
| POST   | `/webhooks/dispatch-status`          | n8n        | Atualiza `Dispatch.status`, `Lead.status`, incrementa métricas |
| POST   | `/webhooks/whatsapp-qr`              | n8n        | Salva QR code em `Account.settings.whatsappQrCode` |
| POST   | `/webhooks/whatsapp-connected`       | n8n        | `Account.settings.whatsappConnected = true`, limpa QR |

---

## Padrão de Resposta de Erro

Todos os erros retornam:

```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "timestamp": "2026-07-14T21:00:00.000Z",
  "path": "/api/campaigns/abc"
}
```

O `HttpExceptionFilter` global (`src/common/filters/http-exception.filter.ts`)
garante esse formato para qualquer exceção — inclusive as lançadas pelo NestJS
(404, 401, 403, 422, 500).

---

## Padrão de Paginação

Todas as listagens aceitam `?page=1&limit=20` e retornam:

```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```
