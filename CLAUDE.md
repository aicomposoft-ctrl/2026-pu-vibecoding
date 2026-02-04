# AI Sales Trainer - Claude Code Context

## What & Why

AI Sales Trainer: B2B sales professionals practice voice conversations with AI agents, get instant feedback.

**Stack:** Next.js 14 (monorepo), PostgreSQL, ElevenLabs AI, OpenAI GPT-4  
**Architecture:** Distributed Monolith (Turborepo + pnpm)  
**Security:** Client-side encryption (AES-GCM 256-bit, zero-knowledge)

## Repository Structure

```
ai-sales-trainer/
├── apps/web/                 # Next.js 14
│   ├── app/(auth)/auth/      # Login/Register
│   ├── app/trainer/          # Conversation UI
│   ├── app/results/          # Analysis
│   ├── app/api/              # API routes
│   ├── components/           # React components
│   └── lib/                  # Utilities (crypto, db, api)
├── packages/
│   ├── database/             # Prisma
│   ├── shared-types/         # TypeScript
│   └── config/               # Configs
└── docker-compose.yml
```

## Quick Commands

```bash
pnpm install          # Install
pnpm dev              # Dev server
pnpm test             # Unit tests
pnpm test:e2e         # E2E tests
pnpm prisma:studio    # DB GUI
```

## Development Workflow

1. `git checkout -b feature/name`
2. `docker-compose -f docker-compose.dev.yml up db -d`
3. `pnpm dev`
4. Make changes (follow `.claude/rules/`)
5. `pnpm test` (TDD)
6. `git commit -m "feat(scope): description"`
7. Push + PR

## Key Patterns

**Client-Side Encryption:**
```typescript
const { encrypted, iv, salt } = await encryptApiKey(key, password);
await indexedDB.put('api-keys', { encrypted, iv, salt });
```

**Conversation Flow:**
```typescript
const { signedUrl } = await fetch('/api/conversation/signed-url');
const conversation = await ElevenLabs.startSession({ signedUrl });
```

**Git Commits:**
```
feat(trainer): add pause button
fix(auth): session expiry
test(crypto): roundtrip test
```

## Security Requirements

✅ API keys NEVER on server (client-side only)  
✅ All routes verify auth  
✅ bcrypt passwords (cost 10)  
✅ HTTPS enforced  
✅ Input validation (Zod)

## Deployment

```bash
# Local
docker build -t ai-sales-trainer . && docker-compose up

# Production
git push origin main  # Coolify auto-deploys
```

## Docs

- PRD: `/docs/PRD.md`
- Architecture: `/docs/Architecture.md`
- Research: `/docs/Research_Findings.md`
