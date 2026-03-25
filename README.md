# Real Estate CRM

A comprehensive CRM system for real estate companies to manage properties, clients, leads, contracts, and invoices.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 11, TypeScript, Node.js 22 |
| Database | PostgreSQL 16 + Prisma 7 |
| Admin Portal | React 19, Vite, Tailwind CSS 4 |
| Agent Portal | React 19, Vite, Tailwind CSS 4 |
| Mobile (Agent) | Flutter |
| IAM | [Authme](https://github.com/Islamawad132/Authme) (OAuth 2.0 / OIDC) |
| API Docs | Swagger / OpenAPI |
| Deployment | Docker Compose |

## Features

### Admin Portal
- **Dashboard** — KPIs, revenue charts, lead pipeline, agent performance
- **Properties** — Full CRUD, images, map view, filters, bulk actions
- **Clients** — Management, duplicate detection, interaction history
- **Leads** — Pipeline (kanban), activities, follow-ups, conversion
- **Contracts** — Sale/rental agreements, auto-generate invoices
- **Invoices** — Payment tracking, overdue alerts
- **Reports** — Revenue, conversion, performance reports (PDF/CSV export)
- **Agent Management** — Workload, assignments, performance
- **Settings** — Company info, configurations

### Agent Portal
- **Dashboard** — My stats, today's follow-ups, recent activities
- **Leads** — My pipeline, log activities, schedule follow-ups
- **Clients** — My clients, quick contact (call/WhatsApp/email)
- **Properties** — Browse available, my assigned properties
- **Contracts** — View my contracts and invoice schedules

### Mobile App (Flutter — Agents Only)
- All agent portal features optimized for mobile
- Push notifications (new leads, follow-up reminders)
- Offline support with sync
- Share properties via WhatsApp/email
- Biometric login

## Project Structure

```
real-estate-crm/
├── src/                    # NestJS Backend
│   ├── auth/               # Authme integration
│   ├── properties/         # Property management
│   ├── clients/            # Client management
│   ├── leads/              # Lead pipeline
│   ├── contracts/          # Contracts
│   ├── invoices/           # Invoices & payments
│   ├── dashboard/          # Stats & analytics
│   ├── reports/            # Report generation
│   ├── activities/         # Audit trail
│   ├── uploads/            # File uploads
│   ├── common/             # Guards, decorators, DTOs, utils
│   └── prisma/             # Prisma service
├── admin-ui/               # Admin Portal (React)
├── agent-ui/               # Agent Portal (React)
├── mobile/                 # Flutter App
├── prisma/                 # Schema & migrations
├── test/                   # E2E tests
├── docs/                   # Documentation
├── docker-compose.yml      # Production
└── docker-compose.dev.yml  # Development
```

## Authentication & Authorization

Uses **Authme** as the IAM server:
- **Realm:** `real-estate`
- **Roles:** `admin`, `manager`, `agent`
- **Auth Flow:** OAuth 2.0 Authorization Code + PKCE
- **Token Validation:** JWT via Authme JWKS endpoint

## Database Models

- **Property** — Real estate listings (apartments, villas, land, offices, shops)
- **PropertyImage** — Property photos
- **Client** — Buyers, sellers, renters, landlords
- **Lead** — Sales pipeline (New → Contacted → Qualified → Negotiation → Won/Lost)
- **LeadActivity** — Lead interaction log
- **Contract** — Sale and rental agreements
- **Invoice** — Payment tracking
- **Activity** — System-wide audit trail
- **Setting** — Application configuration

## Development Phases

| Phase | Description | Timeline |
|-------|-------------|----------|
| 1 — Foundation | Monorepo, Prisma, Authme, Properties & Clients CRUD | Week 1-2 |
| 2 — Core CRM | Leads, Contracts, Invoices, Activities, Dashboard APIs | Week 3-4 |
| 3 — Admin Portal | React admin app with all management pages | Week 5-6 |
| 4 — Agent Portal | React agent app with scoped views | Week 7-8 |
| 5 — Mobile App | Flutter agent app with push notifications | Week 9-10 |
| 6 — Polish | PDF generation, emails, testing, production deployment | Week 11-12 |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Islamawad132/real-estate-crm.git
cd real-estate-crm

# Start with Docker (recommended)
docker compose -f docker-compose.dev.yml up

# Or manually
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev        # Backend at http://localhost:3000
npm run admin:dev        # Admin Portal at http://localhost:5173
npm run agent:dev        # Agent Portal at http://localhost:5174
```

## API Documentation

Swagger UI available at `http://localhost:3000/api/docs` when the backend is running.

## Team (AI Agents)

| Agent | Role |
|-------|------|
| 🎯 PM (OpenClaw) | Project management, code review, daily updates |
| ⚙️ Backend Agent 1 | Core modules (properties, clients, leads, auth) |
| ⚙️ Backend Agent 2 | Business logic (contracts, invoices, reports, dashboard) |
| 🎨 Frontend Agent 1 | Admin Portal |
| 🎨 Frontend Agent 2 | Agent Portal |
| 📱 Mobile Agent | Flutter app |
| 🧪 QA Agent | Testing (unit, E2E, integration) |
| 🔧 DevOps Agent | Docker, CI/CD, deployment, monitoring |

## License

Private — All rights reserved.
