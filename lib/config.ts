function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

// Lazy getters — evaluated at call time, not at module load / build time
export function getSupabaseUrl(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseAnonKey(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function getAppUrl(): string {
  return requireEnv('NEXT_PUBLIC_APP_URL')
}

// Server-only — call only inside API routes or server components
export function getServiceKey(): string {
  return requireEnv('SUPABASE_SERVICE_KEY')
}

export function getCronSecret(): string {
  return requireEnv('CRON_SECRET')
}
