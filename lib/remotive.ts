import { CachedJob, stripHtml, truncate } from './cache'

const REMOTIVE_API = 'https://remotive.com/api/remote-jobs'
const DESCRIPTION_MAX = 1500

interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo: string
  category: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
  tags: string[]
}

interface RemotiveResponse {
  jobs: RemotiveJob[]
}

export async function fetchRemotiveJobs(
  search: string,
  limit: number = 50
): Promise<CachedJob[]> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('limit', String(limit))

  const res = await fetch(`${REMOTIVE_API}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Remotive API error: ${res.status} ${res.statusText}`)
  }

  const data: RemotiveResponse = await res.json()

  return data.jobs.map((job): CachedJob => ({
    id: String(job.id),
    title: job.title,
    company_name: job.company_name,
    company_logo: job.company_logo || null,
    category: job.category || null,
    job_type: job.job_type || null,
    publication_date: job.publication_date || null,
    location: job.candidate_required_location || null,
    salary: job.salary || null,
    description_text: truncate(stripHtml(job.description || ''), DESCRIPTION_MAX),
    url: job.url,
    tags: job.tags || [],
    fetched_at: new Date().toISOString(),
  }))
}
