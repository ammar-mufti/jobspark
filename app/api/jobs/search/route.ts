import { NextRequest, NextResponse } from 'next/server'
import { getCachedJobs, storeCachedJobs } from '@/lib/cache'
import { fetchRemotiveJobs } from '@/lib/remotive'

export const runtime = 'nodejs'

function sanitise(value: string): string {
  return value.replace(/[<>"'%;()&+]/g, '').slice(0, 100).trim()
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawQuery = searchParams.get('q') ?? ''
    const rawLocation = searchParams.get('location') ?? ''
    const rawJobType = searchParams.get('job_type') ?? ''

    const query = sanitise(rawQuery)
    const location = sanitise(rawLocation)
    const jobType = sanitise(rawJobType)

    // 1. Check cache first
    const cached = await getCachedJobs(query, location)
    if (cached && cached.length > 0) {
      const filtered = jobType
        ? cached.filter((j) => j.job_type?.toLowerCase() === jobType.toLowerCase())
        : cached
      return NextResponse.json({ jobs: filtered, source: 'cache' })
    }

    // 2. Cache miss — call Remotive
    const jobs = await fetchRemotiveJobs(query || 'software')

    // 3. Store for future requests (fire and forget — don't block response)
    storeCachedJobs(jobs).catch((err) =>
      console.error('[search] cache write failed:', err)
    )

    // 4. Apply filters and return
    let results = jobs
    if (location) {
      const loc = location.toLowerCase()
      results = results.filter(
        (j) => !j.location || j.location.toLowerCase().includes(loc)
      )
    }
    if (jobType) {
      results = results.filter(
        (j) => j.job_type?.toLowerCase() === jobType.toLowerCase()
      )
    }

    return NextResponse.json({ jobs: results, source: 'api' })
  } catch (err) {
    console.error('[search] unhandled error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch jobs. Please try again.' },
      { status: 500 }
    )
  }
}
