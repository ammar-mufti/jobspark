import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseAnonKey, getServiceKey } from './config'

// Anon client — safe for browser use. RLS enforced.
export function createAnonClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey())
}

// Service client — bypasses RLS. NEVER import in client components.
// Only call from API routes (server-side).
export function createServiceClient() {
  return createClient(getSupabaseUrl(), getServiceKey(), {
    auth: { persistSession: false },
  })
}
