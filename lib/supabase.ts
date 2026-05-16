import { createClient } from '@supabase/supabase-js'
import { config, getServiceKey } from './config'

// Anon client — safe for browser use. RLS enforced.
export function createAnonClient() {
  return createClient(config.supabase.url, config.supabase.anonKey)
}

// Service client — bypasses RLS. NEVER import in client components.
// Only call from API routes (server-side).
export function createServiceClient() {
  return createClient(config.supabase.url, getServiceKey(), {
    auth: { persistSession: false },
  })
}
