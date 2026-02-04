# AI Sales Trainer — Product Requirements Document

## Overview

AI Sales Trainer is a web application that enables B2B sales professionals to practice realistic voice conversations with AI-powered buyer personas. After each session, the system provides detailed performance analysis across five key sales dimensions.

## Problem Statement

Sales representatives lack consistent, accessible practice environments. Traditional role-playing is scheduling-dependent, inconsistent, and rarely provides structured quantitative feedback. New hires face long ramp-up periods with no safe place to fail.

## Target Users

- **Primary:** B2B sales development representatives (SDRs) and account executives (AEs)
- **Secondary:** Sales managers monitoring team skill progression
- **Tertiary:** Sales enablement teams creating training programs

## Core Features

### 1. Authentication & User Management
- Email/password registration and login (NextAuth credentials provider)
- JWT-based sessions (30-day expiry)
- Password requirements: minimum 8 characters, bcrypt hashed (cost 10)

### 2. Scenario Selection
Four built-in training scenarios with increasing difficulty:

| Scenario | Difficulty | Description |
|----------|-----------|-------------|
| Cold Call — SaaS Product | Easy | Practice cold calling a CTO |
| Discovery Call — Enterprise | Medium | Run discovery with VP of Operations |
| Objection Handling — Price Negotiation | Hard | Handle price objections from procurement |
| Product Demo — Marketing Platform | Medium | Deliver a product demo to marketing director |

Each scenario includes: buyer persona description, industry context, and 5 measurable objectives.

### 3. Voice Conversation Training
- Real-time voice conversation via ElevenLabs Conversational AI
- WebRTC connection with sub-500ms latency
- Signed URL authentication pattern (server generates, client connects)
- Visual feedback: animated VoiceOrb showing connection state
- Live transcript panel showing messages as they occur
- Session timer tracking duration

### 4. Performance Analysis
After each conversation, GPT-4 analyzes the transcript across 5 dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Rapport Building | 20% | Trust and connection establishment |
| Needs Discovery | 25% | Pain point and needs identification |
| Value Presentation | 20% | Value proposition delivery |
| Objection Handling | 20% | Objection response quality |
| Closing Technique | 15% | Commitment progression |

Output: Overall weighted score (0-100), per-dimension scores, narrative feedback, 3 strengths, 3 areas for improvement.

### 5. Results Dashboard
- List view: All past conversations with scores, dates, durations
- Detail view: Full score breakdown, transcript replay, actionable feedback
- Color-coded scores: green (≥80), yellow (≥60), red (<60)

### 6. Client-Side Encryption (Zero-Knowledge)
- User API keys encrypted client-side with AES-GCM 256-bit
- Key derivation: PBKDF2 with 100,000 iterations and SHA-256
- Encrypted keys stored in IndexedDB (never sent to server)
- Unique IV (12 bytes) and salt (16 bytes) per encryption operation

## Non-Functional Requirements

- **Security:** OWASP Top 10 compliance, Zod input validation, rate limiting, security headers
- **Performance:** Voice latency <500ms, page load <2s
- **Scalability:** Distributed monolith ready for service extraction
- **Deployment:** Docker multi-stage build, Coolify auto-deploy from main branch

## User Flows

### Flow 1: First-Time User
1. Register → Login → Select scenario → Start conversation → End → View analysis

### Flow 2: Returning User
1. Login → Select scenario (or view past results) → Practice → Analyze → Compare progress

## Success Metrics
- Session completion rate >70%
- Average sessions per user per week >3
- Analysis score improvement over 10 sessions
