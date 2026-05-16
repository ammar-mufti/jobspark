'use client'

import { useState, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import SearchFilters from '@/components/SearchFilters'
import JobCard from '@/components/JobCard'
import JobCardSkeleton from '@/components/JobCardSkeleton'
import type { CachedJob } from '@/lib/cache'

interface Filters {
  jobType: string[]
  datePosted: string
}

const JOBS_PER_PAGE = 12

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [filters, setFilters] = useState<Filters>({ jobType: [], datePosted: '' })
  const [jobs, setJobs] = useState<CachedJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)

  const filteredJobs = jobs.filter((job) => {
    if (filters.jobType.length > 0) {
      const jt = (job.job_type ?? '').toLowerCase().replace(/[- ]/g, '_')
      if (!filters.jobType.some((t) => jt.includes(t))) return false
    }
    if (filters.datePosted) {
      if (!job.publication_date) return false
      const days = parseInt(filters.datePosted, 10)
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      if (new Date(job.publication_date).getTime() < cutoff) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))
  const currentJobs = filteredJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSearched(true)
    setPage(1)

    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (location) params.set('location', location)

      const res = await fetch(`/api/jobs/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setJobs(data.jobs ?? [])
    } catch {
      setError('Unable to load jobs right now. Please try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [query, location])

  function handleClearFilters() {
    setFilters({ jobType: [], datePosted: '' })
    setPage(1)
  }

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="jobs" />

      {/* Hero */}
      <section className="bg-surface-container-low dark:bg-surface-container pt-28 pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-headline-lg md:text-display text-primary dark:text-inverse-primary mb-3 font-bold">
            Find your next remote job
          </h1>
          <p className="text-body-lg text-on-surface-variant dark:text-surface-variant mb-8 max-w-2xl">
            Search thousands of remote positions and get AI-powered match scores based on your resume.
          </p>
          <SearchBar
            query={query}
            location={location}
            onQueryChange={setQuery}
            onLocationChange={setLocation}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8">
        {!searched ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline mb-4">work</span>
            <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
              Start your job search
            </h2>
            <p className="text-body-md text-on-surface-variant dark:text-surface-variant max-w-sm">
              Search by job title, keywords, or company name above to see remote opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-gutter">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <SearchFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </aside>

            {/* Results */}
            <div>
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="material-symbols-outlined text-[48px] text-error mb-4">error_outline</span>
                  <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-body-md text-on-surface-variant dark:text-surface-variant mb-6">
                    {error}
                  </p>
                  <button
                    onClick={handleSearch}
                    className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-6 py-2 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
                  <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
                    No results found
                  </h2>
                  <p className="text-body-md text-on-surface-variant dark:text-surface-variant max-w-sm">
                    Try different keywords or remove some filters.
                  </p>
                </div>
              )}

              {!loading && !error && filteredJobs.length > 0 && (
                <>
                  <p className="text-body-sm text-on-surface-variant dark:text-surface-variant mb-4">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {currentJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-outline-variant dark:border-outline rounded-lg hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-on-surface-variant dark:text-surface-variant disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, idx) =>
                          p === '...' ? (
                            <span key={`ellipsis-${idx}`} className="text-on-surface-variant px-2">
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p as number)}
                              className={
                                page === p
                                  ? 'w-10 h-10 flex items-center justify-center rounded-lg bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md'
                                  : 'w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant dark:border-outline text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-label-md'
                              }
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-outline-variant dark:border-outline rounded-lg hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-on-surface-variant dark:text-surface-variant disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
