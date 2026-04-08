# GhosTalk 👻

A privacy-first, anonymous, ephemeral chat web app where users are auto-assigned ghost identities and can join temporary rooms for real-time communication. All messages are automatically deleted after 4 hours.

**Core Value:** Zero-friction, fully anonymous, ephemeral real-time communication.

## Tech Stack
- Frontend: Next.js 15 (App Router), Tailwind CSS, Shadcn UI
- Backend: Supabase (Auth, Realtime Postgres Changes, Database)
- Database Pruning: `pg_cron`

## Features
- **Anonymous Ghost Passports:** Users implicitly log in via Supabase Anonymous Auth and are assigned seeded Adjective-Animal names (e.g. `Velvet-Narwhal`).
- **Low-Latency Realtime:** Sub-second multi-user syncing via Supabase Realtime Channels combined with optimistic optimistic UI rendering. 
- **Absolute Ephemerality**: Chat logs are destroyed on a rolling 4-hour cycle natively in the database.

---

## Auto-Delete via pg_cron 

To fulfill our privacy guarantees without running costly custom NodeJS workers, GhosTalk utilizes PostgreSQL's native `pg_cron` extension to routinely sweep and destroy out-of-bounds messages natively within the database layer. 

> **Note:** The Supabase Free Tier fully supports `pg_cron` natively out of the box with zero configuration!

### How it Works
1. Every 5 minutes, `cron.schedule` executes a background sweep.
2. The query maps across the `messages` table and hard-deletes any record whose `created_at` timestamp is older than `NOW() - INTERVAL '4 hours'`.

### SQL Configuration & Manual Triggers
The exact SQL required to attach this daemon to your Supabase instance is available in `database/pg_cron_setup.sql`.

If an administrator wishes to trigger the purge manually without waiting for the 5-minute interval, you can execute the Supabase DB Function via SQL or an RPC call natively:
```sql
SELECT purge_old_messages();
```

## Running Locally

1. Clone repo, `npm install`.
2. Add your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
3. Run `npm run dev` to launch the Ghost UI!
