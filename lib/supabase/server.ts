import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns true once the server-side Supabase env vars are present. Lets route
 * handlers persist when configured and cleanly no-op while the client has not
 * yet provisioned a Supabase project.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

/**
 * Server-only Supabase client using the service-role key, which bypasses RLS.
 * NEVER import this from a client component — it would leak the service-role key
 * to the browser. Throws if called without env keys, so always guard with
 * isSupabaseConfigured() first.
 */
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).',
    )
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
