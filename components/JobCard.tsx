import type { CachedJob } from '@/lib/cache'

interface JobCardProps {
  job: CachedJob
  matchScore?: number
}

function MatchBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <div className="flex items-center gap-1 bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-[16px]">check_circle</span>
        <span className="text-label-sm">{score}% Match</span>
      </div>
    )
  }
  if (score >= 50) {
    return (
      <div className="flex items-center gap-1 bg-surface-container-highest dark:bg-surface-container text-tertiary-container dark:text-on-tertiary-container px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-[16px]">trending_up</span>
        <span className="text-label-sm">{score}% Match</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 bg-surface-container dark:bg-surface-container text-on-surface-variant dark:text-surface-variant px-3 py-1 rounded-full">
      <span className="material-symbols-outlined text-[16px]">remove</span>
      <span className="text-label-sm">{score}% Match</span>
    </div>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Unknown date'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  if (days < 60) return '1 month ago'
  return `${Math.floor(days / 30)} months ago`
}

export default function JobCard({ job, matchScore }: JobCardProps) {
  const accentClass =
    matchScore !== undefined
      ? matchScore >= 80
        ? 'bg-secondary dark:bg-secondary-fixed-dim'
        : matchScore >= 50
        ? 'bg-tertiary-container dark:bg-on-tertiary-container'
        : null
      : null

  return (
    <div className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/30 dark:border-outline/30 hover:border-secondary dark:hover:border-secondary-fixed-dim hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] dark:hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      {accentClass && (
        <div className={`absolute top-0 left-0 w-full h-1 ${accentClass}`} />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg border border-outline-variant/20 dark:border-outline/20 flex items-center justify-center bg-surface dark:bg-surface-container overflow-hidden flex-shrink-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={`${job.company_name} logo`}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
              business
            </span>
          )}
        </div>

        {matchScore !== undefined && <MatchBadge score={matchScore} />}

        {/* Bookmark — Phase 2: implement with auth */}
        <button
          className="text-on-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors p-1 ml-auto"
          aria-label="Bookmark job"
          disabled
        >
          <span className="material-symbols-outlined">bookmark_border</span>
        </button>
      </div>

      <h3 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-1 line-clamp-2">
        {job.title}
      </h3>

      <p className="text-body-sm text-on-surface-variant dark:text-surface-variant mb-3">
        {job.company_name}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.job_type && (
          <span className="px-2 py-1 bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-variant rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.job_type}
          </span>
        )}
        {job.location && (
          <span className="px-2 py-1 bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="px-2 py-1 bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-variant rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.salary}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-body-sm text-on-surface-variant dark:text-surface-variant mt-auto">
        <span className="material-symbols-outlined text-[14px]">schedule</span>
        <span>{formatDate(job.publication_date)}</span>
      </div>

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-4 py-2 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2"
      >
        Apply Now
        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
      </a>
    </div>
  )
}
