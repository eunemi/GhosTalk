# GhosTalk

## What This Is

A privacy-first, anonymous, ephemeral chat web app where users are auto-assigned ghost identities and can join temporary rooms for real-time communication. All messages are automatically deleted after 4 hours.

## Core Value

Zero-friction, fully anonymous, ephemeral real-time communication.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Users receive auto-assigned ghost identities upon entry without signing up.
- [ ] Users can join temporary chat rooms.
- [ ] Users can send and receive messages in real-time.
- [ ] Messages auto-delete after 4 hours.

### Out of Scope

- User accounts with passwords or emails — to ensure zero-friction, fully anonymous usage constraint.
- Complex media sharing (images/video) — to stick within the 4-hour hackathon constraint and zero cost limit.

## Context

Tech Stack: Next.js 15 (App Router) + Tailwind CSS + Shadcn UI for frontend. Supabase (PostgreSQL + Auth + Realtime + pg_cron) for Backend/DB. Vercel Hobby Plan for hosting.
Development Context: This is a hackathon build meant to be shipped in under 4 hours. Focus is on speed and simplicity while ensuring privacy and real-time capabilities.
Version Safety Rule: Web-search dependencies for latest stable version + CVE before writing package.json/install. Use ^ ranges. Run npm audit after install.

## Constraints

- **Tech Stack**: Next.js 15, Tailwind, Shadcn, Supabase, Vercel — chosen for rapid development and zero cost.
- **Budget**: Zero cost (no credit card) — strictly stick to free tiers.
- **Timeline**: 4-hour hackathon build — scope must remain tightly constrained to essentials.
- **UX**: Mobile-responsive and Dark mode by default — to provide a modern, device-agnostic interface quickly.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Modern default, good for fast prototyping | — Pending |
| Supabase Broadcast | Simple real-time messaging without a heavy WebSocket server | — Pending |
| pg_cron for deletion | Database-level cron is reliable and simple for ephemeral data | — Pending |

---
*Last updated: 2026-04-08 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
