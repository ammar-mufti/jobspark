'use client'

interface Filters {
  jobType: string[]
  datePosted: string
}

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}

const JOB_TYPES = ['full_time', 'part_time', 'contract', 'freelance', 'internship']
const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

const DATE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
]

export default function SearchFilters({ filters, onChange, onClear }: SearchFiltersProps) {
  function toggleJobType(type: string) {
    const current = filters.jobType
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    onChange({ ...filters, jobType: updated })
  }

  function setDatePosted(value: string) {
    onChange({ ...filters, datePosted: value })
  }

  return (
    <aside className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/50 dark:border-outline/30 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headline-sm text-primary dark:text-inverse-primary">Filters</h2>
        <button
          onClick={onClear}
          className="text-label-sm text-secondary dark:text-secondary-fixed-dim hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="py-4 border-t border-outline-variant/30 dark:border-outline/30">
        <h3 className="text-label-md text-primary dark:text-inverse-primary mb-3">Job Type</h3>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => toggleJobType(type)}
                className="rounded border-outline text-secondary focus:ring-secondary/50"
              />
              <span className="text-body-md text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
                {JOB_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="py-4 border-t border-outline-variant/30 dark:border-outline/30">
        <h3 className="text-label-md text-primary dark:text-inverse-primary mb-3">Date Posted</h3>
        <div className="flex flex-col gap-2">
          {DATE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="datePosted"
                value={opt.value}
                checked={filters.datePosted === opt.value}
                onChange={() => setDatePosted(opt.value)}
                className="border-outline text-secondary focus:ring-secondary/50"
              />
              <span className="text-body-md text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
