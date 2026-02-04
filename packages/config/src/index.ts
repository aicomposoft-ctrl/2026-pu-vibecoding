// ============================================
// AI Sales Trainer — Shared Configuration
// ============================================

export const APP_NAME = 'AI Sales Trainer';

export const CRYPTO_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  saltLength: 16,
  pbkdf2Iterations: 100_000,
  hashAlgorithm: 'SHA-256',
} as const;

export const AUTH_CONFIG = {
  bcryptCost: 10,
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  passwordMinLength: 8,
} as const;

export const RATE_LIMIT_CONFIG = {
  analyze: { windowMs: 60_000, maxRequests: 5 },
  conversation: { windowMs: 60_000, maxRequests: 10 },
  auth: { windowMs: 15 * 60_000, maxRequests: 5 },
} as const;

export const SCENARIOS = [
  {
    id: 'cold-call-saas',
    name: 'Cold Call — SaaS Product',
    description: 'Practice cold calling a CTO about your SaaS solution for team productivity.',
    difficulty: 'EASY' as const,
    industry: 'Technology',
    buyerPersona: 'CTO at a mid-size tech company, skeptical but open to efficiency gains.',
    objectives: [
      'Establish rapport within 30 seconds',
      'Identify at least 2 pain points',
      'Present value proposition clearly',
      'Handle initial objection',
      'Secure next meeting',
    ],
  },
  {
    id: 'discovery-enterprise',
    name: 'Discovery Call — Enterprise',
    description: 'Run a discovery call with a VP of Operations at a Fortune 500 company.',
    difficulty: 'MEDIUM' as const,
    industry: 'Enterprise',
    buyerPersona: 'VP of Operations, data-driven, has budget but needs strong ROI case.',
    objectives: [
      'Ask open-ended discovery questions',
      'Uncover decision-making process',
      'Identify budget and timeline',
      'Map stakeholders',
      'Agree on next steps',
    ],
  },
  {
    id: 'objection-handling',
    name: 'Objection Handling — Price Negotiation',
    description: 'Handle price objections from a procurement manager who has a competing offer.',
    difficulty: 'HARD' as const,
    industry: 'General',
    buyerPersona: 'Procurement Manager, experienced negotiator, has a lower-priced alternative.',
    objectives: [
      'Acknowledge the concern',
      'Reframe value vs. price',
      'Use social proof effectively',
      'Find creative deal structure',
      'Close without heavy discounting',
    ],
  },
  {
    id: 'demo-presentation',
    name: 'Product Demo — Marketing Platform',
    description: 'Deliver a compelling product demo to a marketing director.',
    difficulty: 'MEDIUM' as const,
    industry: 'Marketing',
    buyerPersona: 'Marketing Director, visually oriented, wants to see ROI metrics.',
    objectives: [
      'Tailor demo to prospect needs',
      'Highlight key differentiators',
      'Show relevant use cases',
      'Handle technical questions',
      'Drive urgency for decision',
    ],
  },
] as const;

export const ANALYSIS_CATEGORIES = [
  { key: 'rapport', label: 'Rapport Building', weight: 0.2 },
  { key: 'discovery', label: 'Needs Discovery', weight: 0.25 },
  { key: 'presentation', label: 'Value Presentation', weight: 0.2 },
  { key: 'objections', label: 'Objection Handling', weight: 0.2 },
  { key: 'closing', label: 'Closing Technique', weight: 0.15 },
] as const;
