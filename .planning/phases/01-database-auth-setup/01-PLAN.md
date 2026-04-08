---
wave: 1
depends_on: []
files_modified:
  - ".env.local.example"
  - ".gitignore"
  - "lib/supabaseClient.ts"
autonomous: false
---

# Phase 1: Database & Auth Setup

## Verification Criteria

- Verification Command: `npx tsc --noEmit && npm run lint`
- Must Have: Supabase schema is created
- Must Have: Environment variables initialized
- Must Have: `.env.local` is in `.gitignore`
- Must Have: Supabase client instantiated

## Tasks

<task>
  <description>Supabase Project Config (Est: 5 min)</description>
  <read_first>
    - .planning/ROADMAP.md
  </read_first>
  <action>
    Manual task via Supabase Dashboard:
    1. Go to Authentication > Providers.
    2. Enable "Anonymous" sign-ins.
    3. Go to Project Settings > API and note down Project URL and anon public key.
  </action>
  <acceptance_criteria>
    - Anonymous Auth must be enabled in the Supabase Dashboard.
  </acceptance_criteria>
</task>

<task>
  <description>Database Schema Setup (Est: 5 min)</description>
  <read_first>
    - .planning/PROJECT.md
  </read_first>
  <action>
    Create the messages table in the Supabase SQL Editor:
    ```sql
    CREATE TABLE messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      content TEXT NOT NULL,
      room_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```
  </action>
  <acceptance_criteria>
    - The `messages` table exists in Supabase public schema with the required columns.
  </acceptance_criteria>
</task>

<task>
  <description>Row Level Security Setup (Est: 5 min)</description>
  <read_first>
    - .planning/REQUIREMENTS.md
  </read_first>
  <action>
    Apply Row Level Security policies via Supabase SQL Editor:
    ```sql
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow anon read" ON messages
      FOR SELECT USING (true);

    CREATE POLICY "Allow anon insert" ON messages
      FOR INSERT WITH CHECK (true);
    ```
  </action>
  <acceptance_criteria>
    - Both "Allow anon read" and "Allow anon insert" policies exist on the `messages` table.
  </acceptance_criteria>
</task>

<task>
  <description>Environment Security - Gitignore (Est: 2 min)</description>
  <read_first>
    - .gitignore (if exists)
  </read_first>
  <action>
    Create `.gitignore` if it doesn't exist. Add `.env.local`, `.env`, and `.env.*` to `.gitignore` to definitively prevent committing real secret keys to source control.
  </action>
  <acceptance_criteria>
    - `.gitignore` contains `.env.local`.
  </acceptance_criteria>
</task>

<task>
  <description>Supabase Client Config file (Est: 5 min)</description>
  <read_first>
    - .planning/config.json
  </read_first>
  <action>
    1. Check for the latest stable versions of `@supabase/ssr` and `@supabase/supabase-js` making sure there are no critical CVEs.
    2. Add them to `package.json` with `^` ranges and run `npm install` (initialize default package.json if missing).
    3. Run `npm audit`.
    4. Create `lib/supabaseClient.ts` importing `createBrowserClient` from `@supabase/ssr`.
    5. The client should connect using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  </action>
  <acceptance_criteria>
    - `package.json` contains `@supabase/ssr` and `@supabase/supabase-js`.
    - `lib/supabaseClient.ts` exists and calls `createBrowserClient` passing process.env variables.
  </acceptance_criteria>
</task>

<task>
  <description>Environment Variables Setup (Est: 3 min)</description>
  <read_first>
    - .planning/ROADMAP.md
  </read_first>
  <action>
    Create `.env.local.example` with the following variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
    ```
  </action>
  <acceptance_criteria>
    - `.env.local.example` exists containing explicitly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholder values.
  </acceptance_criteria>
</task>
