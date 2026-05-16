import { createServiceClient } from './supabase'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export interface CachedJob {
  id: string
  title: string
  company_name: string
  company_logo: string | null
  category: string | null
  job_type: string | null
  publication_date: string | null
  location: string | null
  salary: string | null
  description_text: string | null
  url: string
  tags: string[]
  fetched_at: string
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd()
}

export async function getCachedJobs(
  query: string,
  location: string
): Promise<CachedJob[] | null> {
  const supabase = createServiceClient()
  const cutoff = new Date(Date.now() - CACHE_TTL_MS).toISOString()

  const { data, error } = await supabase
    .from('cached_jobs')
    .select('*')
    .gte('fetched_at', cutoff)
    .ilike('title', `%${query}%`)
    .order('publication_date', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[cache] read error:', error.message)
    return null
  }

  if (!data || data.length === 0) return null

  if (location) {
    const loc = location.toLowerCase()
    return (data as CachedJob[]).filter(
      (j) => !j.location || j.location.toLowerCase().includes(loc)
    )
  }

  return data as CachedJob[]
}

export async function storeCachedJobs(jobs: CachedJob[]): Promise<void> {
  if (jobs.length === 0) return
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('cached_jobs')
    .upsert(jobs, { onConflict: 'id' })

  if (error) {
    console.error('[cache] write error:', error.message)
  }
}
