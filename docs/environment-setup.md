# Environment Setup — Como Rodar Localmente

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- OrbStack ou Docker Desktop
- Git

## Primeira vez (clone novo)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Docker (MongoDB)
cp docker/.env.example docker/.env
# Edite docker/.env se quiser mudar usuário/senha do Mongo

# Backend
cp apps/api/.env.example apps/api/.env
# OBRIGATÓRIO: edite apps/api/.env e troque os secrets:
#   JWT_SECRET=<string aleatória longa>
#   WEBHOOK_SECRET=<string aleatória longa>
# Dica: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
# Só tem NEXT_PUBLIC_API_URL — não precisa editar em dev
```

### 3. Subir tudo com um único comando

Com Docker Desktop **aberto e rodando** (não basta estar instalado):

```bash
# Da raiz do projeto:
npm run dev:full
```

Isso faz `docker compose up -d` (sobe MongoDB + Mongo Express em background) e em
seguida `npm run dev` (API + web em paralelo via `concurrently`):

- **MongoDB** → `localhost:27018`
- **Mongo Express** → `http://localhost:8081` (login `admin` / `admin`, configurado em `docker/.env`)
- **API** → `http://localhost:3001/api`
- **Web** → `http://localhost:3000`

Alternativa manual, subindo cada peça separadamente:

```bash
cd docker && docker compose up -d   # sobe só o Mongo
cd ..
npm run dev                          # sobe só API + web
```

> **Troubleshooting — `EADDRINUSE` na API:** se a porta 3000 já estiver ocupada por
> outro processo (ex.: um `next dev` esquecido de uma sessão anterior), o Next.js sobe
> automaticamente na 3001 — a mesma porta da API — e a API falha ao subir. Descubra e
> encerre o processo antigo antes de rodar `npm run dev:full` de novo:
> ```powershell
> Get-NetTCPConnection -LocalPort 3000 -State Listen | Select OwningProcess
> Stop-Process -Id <PID> -Force
> ```

## Portas em uso

| Serviço       | Porta  | URL                        |
|---------------|--------|----------------------------|
| Next.js (web) | 3000   | http://localhost:3000      |
| NestJS (api)  | 3001   | http://localhost:3001/api  |
| MongoDB       | 27018  | mongodb://localhost:27018  |
| Mongo Express | 8081   | http://localhost:8081      |

> **Atenção:** a porta 27017 pode estar em uso por outro projeto.
> O ConvertAI usa 27018 intencionalmente para evitar conflito.

## Variáveis de Ambiente — Referência Completa

### `apps/api/.env`

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000

# MongoDB
MONGO_URI=mongodb://root:password@localhost:27018/convertai?authSource=admin

# JWT — gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<secret-aleatorio>
JWT_EXPIRES_IN=7d

# Webhook — mesmo comando acima. Configure o MESMO valor no n8n.
WEBHOOK_SECRET=<secret-aleatorio>

# n8n — ajuste para o ambiente onde o n8n está rodando
N8N_LEAD_SEARCH_WEBHOOK_URL=http://localhost:5678/webhook/lead-search
N8N_DISPATCH_WEBHOOK_URL=http://localhost:5678/webhook/dispatch
N8N_WHATSAPP_CONNECT_WEBHOOK_URL=http://localhost:5678/webhook/whatsapp-connect
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Comandos Úteis

```bash
# Subir Mongo + API + web com um comando (Docker Desktop precisa estar aberto)
npm run dev:full

# Rodar só a API
npm run dev -w apps/api

# Rodar só o frontend
npm run dev -w apps/web

# Build de produção
npm run build

# Lint
npm run lint

# Testes
npm run test

# Parar o Docker
cd docker && docker compose down

# Ver logs do banco
cd docker && docker compose logs -f mongo
```

## Fluxo de Git (dois devs)

```bash
# Sempre parta da main atualizada
git checkout main && git pull

# Crie branch para a feature
git checkout -b feat/nome-da-feature

# Trabalhe, commite
git add apps/api/src/modules/auth/...
git commit -m "feat(auth): adiciona registro e login"

# Abra PR para main — nunca commita direto na main
```

Convenção de commits:
- `feat(módulo): descrição` — nova funcionalidade
- `fix(módulo): descrição` — correção de bug
- `refactor(módulo): descrição` — refatoração sem mudança de comportamento
- `docs: descrição` — documentação
