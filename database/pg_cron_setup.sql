-- STEP 5.1: Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- STEP 5.2: Schedule auto-delete job (every 5 minutes)
SELECT cron.schedule(
  'delete-old-messages',
  '*/5 * * * *',
  $$DELETE FROM messages WHERE created_at < NOW() - INTERVAL '4 hours';$$
);

-- STEP 5.3: Verify job is registered
SELECT * FROM cron.job;

-- STEP 5.4: Supabase DB Function for manual purge (optional admin use)
CREATE OR REPLACE FUNCTION purge_old_messages()
RETURNS void AS $$
  DELETE FROM messages WHERE created_at < NOW() - INTERVAL '4 hours';
$$ LANGUAGE sql;
