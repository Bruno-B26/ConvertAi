# Data Model — MongoDB Schemas

Todas as entidades têm `accountId: ObjectId` como campo obrigatório (multi-tenancy).
Toda query ao banco deve incluir `{ accountId }` como filtro — sem exceção.

Os schemas Mongoose ficam em `apps/api/src/modules/<feature>/schemas/<feature>.schema.ts`.

---

## Account

Representa o **tenant** (empresa/cliente contratante do SaaS).

```
_id:          ObjectId
name:         string              — nome da empresa
slug:         string (único)      — identificador amigável, gerado no cadastro
plan:         'free' | 'starter' | 'pro'   — placeholder para billing futuro
status:       'active' | 'suspended'

settings: {
  whatsappConnected: boolean      — true após escanear QR code
  whatsappPhone:     string|null  — número conectado
  whatsappQrCode:    string|null  — base64 do QR atual (temporário, null após conexão)
}

createdAt:    Date
updatedAt:    Date
```

---

## User

Um usuário pertence a uma Account. No MVP há só 1 por Account, mas o schema
suporta múltiplos (campo `role`).

```
_id:                   ObjectId
accountId:             ObjectId → Account   (índice)
name:                  string
email:                 string (único global)
passwordHash:          string
role:                  'owner' | 'admin' | 'member'   — só 'owner' no MVP
status:                'active' | 'suspended'

passwordResetToken:    string|null
passwordResetExpiresAt: Date|null

lastLoginAt:           Date|null
createdAt:             Date
updatedAt:             Date
```

**Índice:** `{ email: 1 }` unique, `{ accountId: 1 }`

---

## Campaign

Entidade central. Concentra filtros de busca, configuração de disparo e métricas.

```
_id:         ObjectId
accountId:   ObjectId → Account   (índice)
name:        string
description: string
channel:     'whatsapp'            — extensível para email/sms depois
objective:   string                — texto livre no MVP
status:      'draft'
           | 'searching'           — aguardando n8n retornar leads
           | 'review'              — leads prontos para o usuário revisar
           | 'ready'               — leads aprovados, aguardando disparar
           | 'running'             — disparos em andamento
           | 'paused'
           | 'completed'
           | 'failed'

searchFilter: {                    — embedded (1:1 com Campaign no MVP)
  cnae:        string[]
  locations:   [{ state: string, city: string|null }]
  companySize: 'micro'|'small'|'medium'|'large'|null
  keywords:    string[]
  maxLeads:    number              — limite enviado ao n8n
}

dispatchConfig: {                  — null até o usuário configurar
  messageTemplate:      string     — "Olá, {{nome}} da {{empresa}}..."
  variables:            string[]   — ['nome', 'empresa', ...]
  scheduledAt:          Date|null  — null = enviar imediatamente
  rateLimit:            number     — disparos por minuto
  maxRetries:           number
  retryIntervalMinutes: number
} | null

metrics: {                         — incrementados a cada callback do n8n
  leadsFound:        number
  leadsApproved:     number
  leadsRejected:     number
  messagesSent:      number
  messagesDelivered: number
  messagesReplied:   number
  meetingsScheduled: number
  conversions:       number
}

n8nSearchCorrelationId:   string|null   — UUID gerado ao disparar busca
n8nDispatchCorrelationId: string|null   — UUID gerado ao disparar campanha

createdAt:   Date
updatedAt:   Date
```

**Índices:** `{ accountId: 1 }`, `{ accountId: 1, status: 1 }`,
`{ n8nSearchCorrelationId: 1 }`, `{ n8nDispatchCorrelationId: 1 }`

---

## Lead

Um lead é uma empresa/contato encontrado para uma campanha específica.

```
_id:         ObjectId
accountId:   ObjectId → Account   (índice)
campaignId:  ObjectId → Campaign  (índice)

company: {
  name:            string
  cnpj:            string|null
  cnae:            string|null
  cnaeDescription: string|null
  size:            string|null
  foundedYear:     number|null
  website:         string|null
  address: {
    street:  string|null
    city:    string|null
    state:   string|null
    zipCode: string|null
  }
}

contact: {
  name:     string|null
  role:     string|null
  phone:    string|null
  whatsapp: string|null
  email:    string|null
}

status: 'found'               — recém chegado do n8n
      | 'approved'            — usuário aprovou
      | 'rejected'            — usuário rejeitou
      | 'prospecting'         — disparo iniciado
      | 'delivered'           — mensagem entregue
      | 'replied'             — prospect respondeu
      | 'meeting_scheduled'   — reunião agendada (n8n avisa)
      | 'converted'           — converteu (n8n avisa)
      | 'failed'              — falha definitiva no envio

source:     string            — qual provedor encontrou o lead
externalId: string|null       — ID no sistema externo do provedor
rawData:    Mixed             — resposta bruta da API (útil para debug)
notes:      string|null       — anotação manual do usuário

createdAt:  Date
updatedAt:  Date
```

**Índices:** `{ accountId: 1, campaignId: 1, status: 1 }` (índice composto — a query
mais frequente é "leads de uma campanha com determinado status")

---

## Dispatch

Log de cada mensagem enviada. Um Dispatch por Lead por tentativa de envio.

```
_id:        ObjectId
accountId:  ObjectId → Account   (índice)
campaignId: ObjectId → Campaign  (índice)
leadId:     ObjectId → Lead      (índice)

channel:     'whatsapp'
phone:       string              — número que recebeu a mensagem
messageSent: string              — mensagem após substituição de variáveis

status: 'pending'
      | 'sent'
      | 'delivered'
      | 'failed'
      | 'replied'

attemptCount:  number
lastAttemptAt: Date|null

sentAt:      Date|null
deliveredAt: Date|null
repliedAt:   Date|null
replyContent: string|null

externalMessageId: string|null   — ID retornado pelo n8n/WhatsApp
errorMessage:      string|null

createdAt:  Date
updatedAt:  Date
```

**Índices:** `{ accountId: 1, campaignId: 1 }`, `{ leadId: 1 }`,
`{ externalMessageId: 1 }` (para casar callbacks do n8n rapidamente)

---

## Diagrama de Relacionamentos

```
Account ──┬── User (1:N, MVP tem 1)
          ├── Campaign (1:N)
          │       └── Lead (1:N por Campaign)
          │               └── Dispatch (1:N por Lead)
          └── settings.whatsappQrCode (temporário)
```

Todas as entidades têm `accountId` para garantir isolamento entre tenants.
