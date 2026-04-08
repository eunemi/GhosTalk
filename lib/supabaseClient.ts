import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '⚠️ Missing Supabase env vars!\n' +
      'Create .env.local with:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n' +
      'Get these from: supabase.com > Settings > API'
    )
    // Return a client with placeholder to prevent crash during build
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
