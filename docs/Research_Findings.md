# AI Sales Trainer — Research Findings

## Voice AI Platform Comparison

| Platform | Latency | WebRTC | Signed URLs | Customization | Pricing |
|----------|---------|--------|-------------|---------------|---------|
| ElevenLabs Conversational AI | <500ms | Yes | Yes | Agent personas, voice cloning | Per-minute |
| OpenAI Realtime API | ~600ms | No (WebSocket) | No | GPT-4o driven | Per-token |
| Deepgram | ~300ms | No | No | STT only (no synthesis) | Per-minute |
| Hume AI | ~800ms | Yes | No | Emotion detection | Per-minute |

**Decision:** ElevenLabs Conversational AI — best combination of low latency, WebRTC support, signed URL security pattern, and customizable buyer personas.

## Sales Training Methodology

### Industry Research
- Average B2B sales rep conducts 52 calls/day (Bridge Group, 2024)
- Only 2% of cold calls result in meetings (Cognism, 2024)
- Sales teams using AI training tools show 28% improvement in conversion rates (Gartner, 2025)
- Top-performing reps practice 3x more than average performers

### Scoring Framework
Based on Miller Heiman, SPIN Selling, and Challenger Sale methodologies:

1. **Rapport Building (20%)** — Based on Cialdini's principles of influence
   - First impression within 30 seconds
   - Active listening signals
   - Mirroring and matching

2. **Needs Discovery (25%)** — Based on SPIN Selling (Rackham)
   - Situation, Problem, Implication, Need-payoff questions
   - Open-ended vs. closed questions ratio
   - Pain point identification depth

3. **Value Presentation (20%)** — Based on Challenger Sale methodology
   - Teaching moment delivery
   - Tailored value proposition
   - Competitive differentiation

4. **Objection Handling (20%)** — Based on LAER framework
   - Listen, Acknowledge, Explore, Respond
   - Reframing techniques
   - Social proof usage

5. **Closing Technique (15%)** — Based on consultative selling
   - Next step progression
   - Urgency creation
   - Commitment quality

### Dimension Weights Rationale
- Discovery weighted highest (25%) because effective needs identification is the strongest predictor of deal closure
- Closing weighted lowest (15%) because it naturally follows from strong discovery and presentation
- Equal weights for rapport, presentation, and objection handling (20%) as foundational skills

## Encryption Research

### Why Client-Side Encryption?
- Users store third-party API keys (ElevenLabs, OpenAI)
- Server compromise should not expose user credentials
- Zero-knowledge architecture: server has no ability to decrypt

### Algorithm Selection
| Algorithm | Key Size | Mode | IV Size | Performance |
|-----------|----------|------|---------|-------------|
| AES-GCM | 256-bit | Authenticated | 12 bytes | ~500MB/s |
| AES-CBC | 256-bit | Block | 16 bytes | ~400MB/s |
| ChaCha20-Poly1305 | 256-bit | Stream | 12 bytes | ~600MB/s |

**Decision:** AES-GCM 256-bit via Web Crypto API
- Authenticated encryption (integrity + confidentiality)
- Native browser support (Web Crypto API)
- NIST recommended
- GCM mode provides both encryption and authentication tag

### Key Derivation
| Algorithm | Iterations | Hash | Time (browser) |
|-----------|-----------|------|----------------|
| PBKDF2 | 100,000 | SHA-256 | ~200ms |
| PBKDF2 | 600,000 | SHA-256 | ~1.2s |
| Argon2id | - | - | Not in Web Crypto API |

**Decision:** PBKDF2 with 100,000 iterations
- Minimum recommended by OWASP (2024)
- Available in Web Crypto API (no external dependencies)
- 200ms derivation time acceptable for user experience

## Authentication Research

### Session Strategy
| Strategy | Storage | Scalability | Security |
|----------|---------|-------------|----------|
| JWT (stateless) | Client cookie | Excellent | Good (no server state) |
| Database sessions | Server DB | Limited | Good (revocable) |
| Redis sessions | Redis | Good | Good (revocable, fast) |

**Decision:** JWT sessions via NextAuth
- No additional infrastructure (Redis) required
- 30-day expiry with automatic refresh
- Session data embedded in token (no DB lookup per request)

### Password Hashing
| Algorithm | Cost | Time | Memory |
|-----------|------|------|--------|
| bcrypt (cost 10) | 10 | ~100ms | ~4KB |
| bcrypt (cost 12) | 12 | ~300ms | ~4KB |
| Argon2id | - | ~200ms | ~64MB |

**Decision:** bcrypt with cost factor 10
- OWASP recommended minimum
- Well-supported in Node.js ecosystem (bcryptjs)
- 100ms hashing time balances security and UX

## Rate Limiting Research

### Strategy
| Endpoint | Window | Max Requests | Rationale |
|----------|--------|-------------|-----------|
| Auth/Register | 15 min | 5 | Prevent brute-force / enumeration |
| Analyze | 1 min | 5 | GPT-4 API cost control |
| Conversation | 1 min | 10 | ElevenLabs cost control |

### Implementation
- In-memory Map (per-instance) for MVP
- Token bucket algorithm with sliding window
- Keyed by authenticated user ID (not IP, to avoid proxy issues)
- Future: Redis-based for multi-instance deployments
