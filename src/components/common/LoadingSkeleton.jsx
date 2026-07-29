export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="h-4 bg-slate-200 rounded w-8 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded flex-1 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
      </div>
      
      {/* Body Skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-4 bg-slate-100 rounded w-6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-28 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded flex-1 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-32 animate-pulse" />
            <div className="h-6 bg-slate-100 rounded-full w-16 animate-pulse" />
            <div className="flex gap-2 w-20 justify-center">
              <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
