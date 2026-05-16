export default function JobCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/30 dark:border-outline/30 flex flex-col h-full animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-surface-container-high flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-surface-container dark:bg-surface-container-high rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface-container dark:bg-surface-container-high rounded w-1/2" />
        </div>
      </div>
      <div className="h-5 bg-surface-container dark:bg-surface-container-high rounded w-full mb-2" />
      <div className="h-5 bg-surface-container dark:bg-surface-container-high rounded w-2/3 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-surface-container dark:bg-surface-container-high rounded-lg" />
        <div className="h-6 w-20 bg-surface-container dark:bg-surface-container-high rounded-lg" />
      </div>
      <div className="h-9 bg-surface-container dark:bg-surface-container-high rounded-lg mt-auto" />
    </div>
  )
}
