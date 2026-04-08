-- ==========================================
-- GHOSTALK SUPABASE SETUP
-- Run this in: Supabase Dashboard > SQL Editor
-- ==========================================

-- STEP 1: Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  room_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: Create index for fast room-based queries
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- STEP 3: Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- STEP 4: RLS Policies — allow anonymous read/write
CREATE POLICY "allow_select" ON messages
  FOR SELECT USING (true);

CREATE POLICY "allow_insert" ON messages
  FOR INSERT WITH CHECK (true);

-- STEP 5: Auto-delete function (messages older than 4 hours)
-- This runs via Supabase Edge Function or pg_cron if available
CREATE OR REPLACE FUNCTION purge_old_messages()
RETURNS void AS $$
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '4 hours';
$$ LANGUAGE sql;

-- STEP 6: Enable Realtime for messages table
-- Go to: Database > Replication > Toggle ON for messages table
-- (This step is done in the Supabase Dashboard UI, not SQL)

-- ==========================================
-- AFTER RUNNING THIS SQL:
-- 1. Go to Authentication > Providers > Enable "Anonymous Sign-Ins"
-- 2. Go to Database > Replication > Enable for "messages" table
-- ==========================================
