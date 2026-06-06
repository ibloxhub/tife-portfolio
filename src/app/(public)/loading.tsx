export default function PublicLoading() {
  return (
    <div className="w-full min-h-screen bg-black flex flex-col pt-40 pb-32 px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-16 animate-pulse">
        {/* Shimmer Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="h-4 w-24 bg-white/5 rounded-full" />
          <div className="h-12 md:h-16 w-64 md:w-96 bg-white/5 rounded-2xl" />
          <div className="h-4 w-72 md:w-96 bg-white/5 rounded-full" />
        </div>
        
        {/* Shimmer Gallery Filters */}
        <div className="flex justify-center gap-3">
          <div className="h-10 w-20 md:w-24 bg-white/5 rounded-full" />
          <div className="h-10 w-28 md:w-32 bg-white/5 rounded-full" />
          <div className="h-10 w-24 md:w-28 bg-white/5 rounded-full" />
        </div>

        {/* Shimmer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="aspect-[4/5] bg-white/5 rounded-[2rem]" />
          <div className="aspect-[3/4] bg-white/5 rounded-[2rem]" />
          <div className="aspect-[4/5] bg-white/5 rounded-[2rem]" />
        </div>
      </div>
    </div>
  )
}
