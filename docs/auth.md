# Autenticação — Notas de Implementação (Fase 2)

Este documento registra **como** a Fase 2 (Autenticação) foi implementada — decisões de
arquitetura, contratos novos e como testar localmente. As rotas em si já estão descritas
em `docs/api-routes.md`; aqui o foco é o "porquê" e o que um dev que acabou de puxar essas
mudanças precisa saber antes de mexer no código.

## Status

Fase 2 completa: registro, login, `GET /auth/me`, logout, recuperação/redefinição de senha
(backend + frontend). Ver checklist em `docs/development-roadmap.md`.

## Arquitetura do backend

`modules/auth`, `modules/accounts` e `modules/users` seguem a separação
controller → service → repository descrita em `apps/api/.claude/CLAUDE.md`.

Ponto importante: **`AuthService` só depende de `AccountsService` e `UsersService`**,
nunca dos repositories de outro módulo (regra de `apps/api/.claude/modules.md`: "export
only the service"). Cada módulo exporta só o service; o repository fica interno.

- `UsersService` encapsula tudo relacionado a senha (`bcrypt` hash/compare, geração e
  validação de token de reset). Ele **nunca** retorna o `passwordHash` para fora do
  módulo — os métodos devolvem um `UserRecord` (id, accountId, name, email, role,
  createdAt) sem o hash.
- `AccountsService.create(name)` gera o slug e cria a Account. `AuthService.register`
  chama `usersService.ensureEmailAvailable()` → `accountsService.create()` →
  `usersService.create()`, nessa ordem, para não deixar uma Account órfã se o e-mail já
  existir.

## Correções de segurança aplicadas nesta etapa

1. **`PATCH /accounts/me` tinha mass assignment.** O controller usava `@Body() body: {
   name?: string }` (interface solta) em vez de um DTO de classe — o `ValidationPipe`
   global (`whitelist: true, forbidNonWhitelisted: true`) só filtra propriedades quando o
   body é uma classe com decorators, então uma interface inline passava batido. Um
   `PATCH` malicioso conseguia sobrescrever `plan`, `status`, `slug`. Corrigido com
   `accounts/dto/update-account.dto.ts` (`class-validator`), restrito a `name` e
   `settings.{whatsappConnected,whatsappPhone,whatsappQrCode}`.
2. **Update parcial de `settings` apagava os outros campos.** `accounts.repository.ts`
   fazia `$set: { settings: data.settings }`, substituindo o subdocumento inteiro.
   Agora `updateById` usa dot-notation (`settings.whatsappPhone`, etc.) para só tocar os
   campos enviados.
3. **Reset de senha.** Token de 32 bytes aleatórios (`crypto.randomBytes`); só o **hash
   SHA-256** do token é persistido em `User.passwordResetToken`; expira em 1h
   (`passwordResetExpiresAt`); é de uso único (limpo depois do reset bem-sucedido).
   `POST /auth/forgot-password` sempre responde a mesma mensagem genérica, exista ou não
   o e-mail, para não permitir enumeração de contas.

## Novo webhook de saída para o n8n

Adicionado `N8N_PASSWORD_RESET_WEBHOOK_URL` (ver `.env.example`), seguindo a Regra de Ouro
nº 2 do `CLAUDE.md` raiz: o backend nunca chama APIs externas diretamente, quem envia o
e-mail de fato é o n8n.

- Payload: `{ email, name, resetUrl }` — `resetUrl` já vem pronto
  (`{CORS_ORIGIN}/reset-password?token=...`).
- Disparado por `N8nWebhookService` (`apps/api/src/common/n8n/n8n-webhook.service.ts`),
  um cliente HTTP mínimo (`fetch` nativo do Node) com uma responsabilidade: `POST` de um
  payload numa URL configurável, logando erro sem derrubar o request que o chamou (se o
  n8n estiver fora do ar, `forgot-password` continua respondendo `200`).
- Esse serviço é genérico e deve ser **reaproveitado** nas Fases 3–6 para os outros
  webhooks já documentados em `docs/product-context.md` (busca de leads, disparo,
  conectar WhatsApp) — não criar um novo cliente HTTP por feature.

## Frontend

- `features/auth/{components,hooks,services,types}` — padrão de feature já usado no
  restante do projeto.
- `components/layout/sidebar.tsx` — client component com o botão de logout
  (`useLogout`), plugado em `app/(app)/layout.tsx` no lugar do placeholder original.
- Páginas: `app/(auth)/{login,register,forgot-password,reset-password}`.
  `reset-password/page.tsx` é `async` e lê `token` de `searchParams` (que no Next 15 é
  uma `Promise`), repassando como prop para o client component do formulário.

### Layout e design das telas de auth

O layout `app/(auth)/layout.tsx` implementa um **split-screen de duas colunas**:

- **Coluna esquerda** (oculta em mobile, `hidden lg:flex`) — painel hero com fundo
  `#0d0d0d`, grid verde sutil via `backgroundImage` inline, logo, badge, headline
  em branco, subtexto cinza e métrica social em verde.
- **Coluna direita** — área de formulário centralizada. Em mobile ocupa a tela toda e
  exibe o logo no topo.

Todos os formulários de auth (`login-form`, `register-form`, `forgot-password-form`,
`reset-password-form`) seguem o mesmo card escuro. Os tokens de cor e as classes de
input/botão padrão estão documentados em `apps/web/.claude/rules/design-system.md`.

### Correção de bug no logout (`use-auth.ts`)

O hook `useLogout` usa `onSettled` (não `onSuccess`). Motivo: se o request
`POST /auth/logout` falhar por qualquer razão (rede, timeout), `onSuccess` nunca
dispararia e o usuário ficaria preso com o cache sujo. Com `onSettled`, o cache é
sempre limpo e o redirect para `/login` sempre acontece.

## Como testar localmente (sem n8n rodando)

Não há instância de n8n no ambiente de dev, então pra exercitar o fluxo de recuperação de
senha de ponta a ponta sem sair clicando no escuro:

1. Suba um listener HTTP na porta do `N8N_PASSWORD_RESET_WEBHOOK_URL` (5678 por padrão)
   que só loga o body recebido:

   ```js
   const http = require('http');
   http.createServer((req, res) => {
     let body = '';
     req.on('data', (c) => (body += c));
     req.on('end', () => {
       console.log(body); // aqui vem { email, name, resetUrl }
       res.writeHead(200).end('{"ok":true}');
     });
   }).listen(5678);
   ```

2. Chame `POST /auth/forgot-password` com um e-mail cadastrado.
3. Pegue o `token` de dentro do `resetUrl` capturado pelo listener.
4. Chame `POST /auth/reset-password` com esse token — ele só funciona uma vez e expira
   em 1h.

Sem esse listener, `forgot-password` ainda responde `200` normalmente (o erro de conexão
com o n8n só é logado no console da API).

## Débitos conhecidos

- `AccountResponseDto.settings` vaza o `_id` interno do subdocumento Mongoose (visível em
  `GET /accounts/me`). `settings` está definido como schema aninhado sem `{ _id: false }`
  em `accounts/schemas/account.schema.ts`. Não corrigido ainda — baixo risco, mas vale
  limpar antes de expor essa resposta para fora do time.
- Não existe endpoint de "trocar senha" para um usuário já logado (só o fluxo de "esqueci
  a senha"). Ficou fora do escopo original da Fase 2; considerar para uma fase futura de
  "conta/perfil".

## Próximo passo

Fase 3 — Campanhas (`docs/development-roadmap.md`).
