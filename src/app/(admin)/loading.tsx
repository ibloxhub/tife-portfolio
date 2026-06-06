export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col gap-8 max-w-6xl mx-auto w-full animate-pulse min-h-screen">
      {/* Header Shimmer */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold/30" />
          <div className="h-3 w-24 bg-white/5 rounded-full" />
        </div>
        <div className="h-10 w-48 bg-white/5 rounded-xl" />
        <div className="h-4 w-72 bg-white/5 rounded-full" />
      </div>

      {/* Toolbar Shimmer */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search bar shimmer */}
          <div className="h-11 w-full sm:w-72 bg-white/5 rounded-2xl" />
          {/* Filter shimmer */}
          <div className="h-11 w-full sm:w-48 bg-white/5 rounded-2xl" />
          {/* Tabs shimmer */}
          <div className="h-11 w-full sm:w-48 bg-white/5 rounded-2xl" />
        </div>
        {/* Action button shimmer */}
        <div className="h-11 w-32 bg-white/5 rounded-2xl shrink-0" />
      </div>

      {/* Grid Cards Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-[2.5rem] bg-white/[0.02] p-6 border border-white/[0.05] flex flex-col gap-4">
            {/* Aspect Ratio block */}
            <div className="aspect-[16/10] bg-white/5 rounded-[2rem] w-full" />
            {/* Title shimmer */}
            <div className="h-5 w-2/3 bg-white/5 rounded-xl mt-2" />
            {/* Category badge shimmer */}
            <div className="h-4 w-1/4 bg-white/5 rounded-lg" />
            {/* Description shimmer */}
            <div className="h-3 w-full bg-white/5 rounded-full" />
            <div className="h-3 w-4/5 bg-white/5 rounded-full" />
            {/* Button shimmer */}
            <div className="h-10 bg-white/5 rounded-xl mt-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
