# AI Sales Trainer — Architecture Document

## System Architecture

**Pattern:** Distributed Monolith (Turborepo monorepo with pnpm workspaces)

```
┌──────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Auth Pages  │  │  Trainer UI  │  │  Results Dashboard │  │
│  │  (NextAuth)  │  │  (ElevenLabs │  │  (Score Breakdown) │  │
│  │             │  │   WebRTC)    │  │                    │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          Client-Side Encryption Layer                   │  │
│  │    AES-GCM 256-bit | PBKDF2 100k | IndexedDB Store    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js 14 Server (App Router)             │
│                                                               │
│  ┌────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │ Auth API   │ │ Conversation │ │ Analysis API           │ │
│  │ /api/auth  │ │ /api/convo   │ │ /api/analyze           │ │
│  │            │ │ /signed-url  │ │ (GPT-4 integration)    │ │
│  └────────────┘ └──────────────┘ └────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Middleware: Auth Check | Rate Limiting | Validation    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
              ┌──────────┐ ┌─────┐ ┌──────────┐
              │PostgreSQL│ │ 11L │ │  OpenAI   │
              │ (Prisma) │ │ API │ │  GPT-4    │
              └──────────┘ └─────┘ └──────────┘
```

## Repository Structure

```
ai-sales-trainer/
├── apps/
│   └── web/                    # Next.js 14 application
│       ├── app/                # App Router pages + API routes
│       │   ├── (auth)/auth/    # Login/Register (client component)
│       │   ├── trainer/        # Conversation UI (client component)
│       │   ├── results/        # Analysis dashboard
│       │   └── api/            # 7 API endpoints
│       ├── components/         # React components
│       │   ├── auth/           # AuthProvider, LoginForm, RegisterForm
│       │   ├── trainer/        # ConversationWidget, VoiceOrb, TranscriptPanel, ScenarioSelector
│       │   ├── results/        # AnalysisView, TranscriptReplay
│       │   └── ui/             # Navbar
│       └── lib/                # Utilities
│           ├── crypto/         # AES-GCM encryption, IndexedDB key store
│           ├── api/            # Auth check, rate limiting, GPT-4 analysis
│           ├── db/             # Prisma client singleton
│           └── validators/     # Zod schemas
├── packages/
│   ├── database/               # Prisma schema + client
│   ├── shared-types/           # TypeScript interfaces
│   └── config/                 # Shared constants, scenarios
├── docs/                       # Documentation
├── .claude/                    # Claude Code toolkit
└── docker-compose.yml          # Production deployment
```

## Data Model

```
User
├── id (cuid)
├── email (unique)
├── passwordHash (bcrypt cost 10)
├── name
├── role (USER | ADMIN)
├── createdAt, updatedAt
└── conversations[]

Conversation
├── id (cuid)
├── userId → User
├── title
├── scenario (string matching SCENARIOS config)
├── status (IN_PROGRESS | COMPLETED | CANCELLED)
├── duration (seconds)
├── createdAt, updatedAt
├── messages[]
└── analysis?

Message
├── id (cuid)
├── conversationId → Conversation
├── role (USER | ASSISTANT | SYSTEM)
├── content (text)
├── timestamp
└── @@index([conversationId], [timestamp])

Analysis
├── id (cuid)
├── conversationId → Conversation (unique)
├── overallScore (0-100)
├── rapport, discovery, presentation, objections, closing (0-100 each)
├── feedback (text)
├── strengths[] (string array)
├── improvements[] (string array)
└── createdAt, updatedAt
```

## API Endpoints

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | /api/auth/register | No | 5/15min | Create account |
| POST | /api/auth/[...nextauth] | No | - | NextAuth login/session |
| POST | /api/conversation | Yes | 10/min | Create conversation |
| GET | /api/conversation | Yes | 10/min | List conversations |
| GET | /api/conversation/signed-url | Yes | 10/min | ElevenLabs signed URL |
| POST | /api/conversation/[id]/messages | Yes | - | Save messages |
| POST | /api/conversation/[id]/complete | Yes | - | Complete session |
| POST | /api/analyze | Yes | 5/min | GPT-4 analysis |

## Security Architecture

### Zero-Knowledge Encryption
- API keys encrypted in browser using Web Crypto API
- PBKDF2 key derivation (100,000 iterations, SHA-256)
- AES-GCM 256-bit with unique IV (12 bytes) and salt (16 bytes) per operation
- Encrypted data stored in IndexedDB; server never receives plaintext keys

### Authentication
- NextAuth credentials provider with JWT sessions
- bcrypt password hashing (cost factor 10)
- Server-side session verification on all protected routes

### API Security
- Zod input validation on all POST endpoints
- Rate limiting per user (in-memory, per-instance)
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS
- HTTPS enforcement in production via middleware

## Deployment

- **Docker:** Multi-stage build (base → deps → builder → runner)
- **Database:** PostgreSQL 16 (Alpine) with persistent volume
- **CI/CD:** Push to main → Coolify auto-deploys
- **Environment:** All secrets via environment variables (.env.example as template)

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 App Router | Server components, API routes, SSR |
| Database | PostgreSQL + Prisma | Type-safe ORM, migrations, studio |
| Voice AI | ElevenLabs Conversational AI | WebRTC, <500ms latency, signed URLs |
| Analysis | OpenAI GPT-4 | Best quality for nuanced sales analysis |
| Auth | NextAuth | Battle-tested, JWT sessions, extensible |
| Styling | Tailwind CSS | Utility-first, consistent design system |
| Monorepo | Turborepo + pnpm | Fast builds, workspace dependencies |
| Encryption | Web Crypto API | Browser-native, zero-knowledge |
