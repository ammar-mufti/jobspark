'use client'

interface SearchBarProps {
  query: string
  location: string
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSearch,
}: SearchBarProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-0 bg-surface-container-lowest dark:bg-surface-container rounded-xl shadow-sm dark:shadow-none border border-outline-variant/50 dark:border-outline overflow-hidden"
    >
      <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 dark:border-outline/30 py-3 md:py-0">
        <span className="material-symbols-outlined text-on-surface-variant mr-3 flex-shrink-0">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0 outline-none"
          placeholder="Job title, keywords, or company"
        />
      </div>

      <div className="flex-1 flex items-center px-4 py-3 md:py-0">
        <span className="material-symbols-outlined text-on-surface-variant mr-3 flex-shrink-0">location_on</span>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0 outline-none"
          placeholder="City, state, or remote"
        />
      </div>

      <button
        type="submit"
        className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-8 py-4 md:py-3 hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        Search
      </button>
    </form>
  )
}
