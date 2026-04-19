# OpCenter — Back-office Inteligente

Sistema de back-office modular com diagrama de arquitetura interativo para PMEs brasileiras.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL (dados principais + auditoria append-only) |
| Cache / Filas | Redis + BullMQ |
| Infra | Docker Compose (dev) → Railway/Render → AWS ECS (produção) |
| Auth | JWT + Passport + multi-tenant por `tenantId` |

## Módulos 

- **Arquitetura** — Diagrama interativo com 4 camadas e 6 módulos clicáveis
- **Dashboard** — KPIs pré-configurados por nicho com alertas proativos
- **Workflows** — Motor de processos com SLA, kanban e lógica condicional
- **Centralização** — Perfil 360° de clientes com linha do tempo unificada
- **Automação** — Regras "Quando → Então" sem código + log de execuções
- **Conhecimento** — Playbooks vinculados às etapas dos workflows
- **Auditoria** — Trilha imutável de todos os eventos (append-only)

## Início rápido

```bash
# 1. Subir infra (Postgres + Redis)
docker compose up postgres redis -d

# 2. Instalar dependências
npm install

# 3. Frontend (porta 3000)
npm run dev

# 4. Backend (porta 3001)
npm run dev:api
```

## Estrutura do repositório

```
opcenter/
├── apps/
│   ├── web/          # React + Vite (frontend)
│   └── api/          # NestJS (backend)
├── packages/
│   └── shared/       # Tipos compartilhados TS
├── docker-compose.yml
└── README.md
```

## Roadmap do MVP (7 dias)

| Dias | Entrega |
|---|---|
| 1–2 | Fundação: auth, multi-tenant, importação CSV |
| 3–4 | Workflows com kanban, notificações e histórico |
| 5–6 | Dashboard com KPIs, primeira automação, WhatsApp |
| 7 | Polimento, treinamento e handoff |

## Variáveis de ambiente

```env
# apps/api/.env
DATABASE_URL=postgresql://opcenter:secret@localhost:5432/opcenter_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=change_me_in_production
PORT=3001
NODE_ENV=development

# apps/web/.env
VITE_API_URL=http://localhost:3001
```
## URL para acesso
https://igorandreis23.github.io/Code-back-office/#/workflows
