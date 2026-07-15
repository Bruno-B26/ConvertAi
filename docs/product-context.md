# Contexto do Produto — ConvertAI

## Objetivo

Plataforma SaaS B2B/B2C de prospecção automatizada de leads. O usuário define filtros
de busca, o sistema encontra empresas compatíveis, o usuário revisa e aprova os leads,
configura uma campanha de disparo via WhatsApp e acompanha resultados num dashboard.

## Público-alvo

Times comerciais (B2B) e profissionais autônomos (B2C) que precisam prospectar
clientes em escala sem depender de listas manuais.

## Fluxo Completo do Produto

```
1. Login / Cadastro
       ↓
2. Criar Campanha  (nome, descrição, canal, objetivo)
       ↓
3. Definir Filtros  (CNAE, localização, porte, palavras-chave, limite de leads)
       ↓
4. Buscar Leads
   → backend dispara webhook ao n8n com os filtros
   → n8n consulta API externa de leads
   → n8n chama POST /api/webhooks/leads-result com os leads encontrados
   → Campaign.status muda para "review"
       ↓
5. Revisar Leads  (tabela paginada, aprovar/rejeitar individual ou em massa, exportar CSV)
       ↓
6. Configurar Disparo
   (template da mensagem com {{variáveis}}, horário, rate limit, máx. tentativas)
       ↓
7. Disparar Campanha
   → backend dispara webhook ao n8n com os leads aprovados + config
   → n8n executa envios via WhatsApp (sessão QR code)
   → n8n chama POST /api/webhooks/dispatch-status com status de cada mensagem
   → Campaign.status muda para "running"
       ↓
8. Dashboard  (funil: encontrados → aprovados → enviados → entregues → respondidos
               → reuniões agendadas → conversões)
```

## Arquitetura de Integrações (n8n)

O backend NestJS **nunca** chama APIs externas diretamente. O n8n é o orquestrador.

```
Backend  ──── webhook OUT ────►  n8n  ──── API externa (leads, WhatsApp)
Backend  ◄─── webhook IN  ────  n8n
```

### Webhooks que o backend DISPARA (saída)

| Evento                  | URL (env)                        | Payload enviado                               |
|-------------------------|----------------------------------|-----------------------------------------------|
| Busca de leads          | N8N_LEAD_SEARCH_WEBHOOK_URL      | `{ correlationId, accountId, filters }`       |
| Início de disparo       | N8N_DISPATCH_WEBHOOK_URL         | `{ correlationId, accountId, leads, config }` |
| Conectar WhatsApp       | N8N_WHATSAPP_CONNECT_WEBHOOK_URL | `{ accountId, callbackUrl }`                  |

### Webhooks que o backend RECEBE (entrada)

Todos exigem o header `X-Webhook-Secret: <WEBHOOK_SECRET>` (guard `WebhookSecretGuard`).

| Endpoint                              | Quem chama | O que faz                                          |
|---------------------------------------|------------|----------------------------------------------------|
| `POST /api/webhooks/leads-result`     | n8n        | Persiste leads encontrados, atualiza Campaign      |
| `POST /api/webhooks/dispatch-status`  | n8n        | Atualiza Dispatch + Lead + métricas da Campaign    |
| `POST /api/webhooks/whatsapp-qr`      | n8n        | Salva QR code em Account.settings para exibir     |
| `POST /api/webhooks/whatsapp-connected` | n8n      | Marca whatsappConnected: true na Account          |

### Correlação de Callbacks

Quando o backend dispara um webhook ao n8n, gera um `correlationId` (UUID) e salva em
`Campaign.n8nSearchCorrelationId` ou `Campaign.n8nDispatchCorrelationId`. O n8n devolve
esse mesmo ID no callback, permitindo casar a resposta com a campanha correta.

### Payload esperado: `POST /api/webhooks/leads-result`

```json
{
  "correlationId": "uuid-da-campanha",
  "leads": [
    {
      "company": { "name": "Empresa X", "cnpj": "...", "cnae": "...", ... },
      "contact": { "name": "João", "phone": "11999...", "whatsapp": "11999..." }
    }
  ]
}
```

### Payload esperado: `POST /api/webhooks/dispatch-status`

```json
{
  "correlationId": "uuid-da-campanha",
  "results": [
    {
      "externalMessageId": "msg-id-whatsapp",
      "status": "delivered | failed | replied | meeting_scheduled | converted",
      "replyContent": "Olá, tenho interesse!"
    }
  ]
}
```

## Multi-tenancy

- Cada empresa/cliente é uma **Account** isolada.
- No MVP: 1 User por Account, mas o schema já tem `role` para suportar múltiplos usuários.
- **Toda query ao banco deve filtrar por `accountId`** — dado de uma conta nunca pode
  vazar para outra.
- O `accountId` vem do JWT e é injetado via `@CurrentUser()` no controller.

## Autenticação

- Email + senha com JWT (Bearer token no header `Authorization`).
- Recuperação de senha via email (token temporário).
- Sem login social no MVP.
- Sem billing/assinatura no MVP (campo `plan` na Account existe para adicionar depois).

## Restrições e Decisões de Design

| Decisão                              | Motivo                                                    |
|--------------------------------------|-----------------------------------------------------------|
| n8n orquestra integrações externas   | Desacopla o backend de APIs de terceiros; n8n é mais fácil de configurar sem deploy |
| JWT armazenado em cookie httpOnly    | Mais seguro que localStorage; `credentials: 'include'` no fetch |
| SearchFilter embedded na Campaign   | Relação 1:1 no MVP; não há reúso entre campanhas         |
| Métricas desnormalizadas na Campaign | Leitura do dashboard sem aggregation pesada               |
| Sem rate-limit enforcement no backend| Usuário decide quantas campanhas rodam; complexidade adiada |
