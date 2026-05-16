function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const config = {
  supabase: {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  app: {
    url: requireEnv('NEXT_PUBLIC_APP_URL'),
  },
} as const

// Server-only — call only inside API routes or server components
export function getServiceKey(): string {
  return requireEnv('SUPABASE_SERVICE_KEY')
}

export function getCronSecret(): string {
  return requireEnv('CRON_SECRET')
}
