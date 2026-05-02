export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#050505] animate-pulse">
      {/* Hero Header Skeleton */}
      <section className="relative h-[70dvh] w-full overflow-hidden bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 max-w-6xl mx-auto w-full z-10">
          <div className="flex flex-col gap-6 max-w-4xl">
            {/* Back Button Skeleton */}
            <div className="h-4 w-24 bg-white/10 rounded" />
            
            <div className="space-y-4">
              {/* Title Skeleton */}
              <div className="h-12 md:h-24 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-12 md:h-24 w-1/2 bg-white/10 rounded-xl" />
            </div>

            {/* Meta Skeleton */}
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="h-6 w-32 bg-white/10 rounded" />
              <div className="h-6 w-32 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Project Info Skeleton */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="space-y-6">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                  <div className="h-4 w-4/6 bg-white/10 rounded" />
                </div>
              </div>

              <div className="h-14 w-full bg-white/5 rounded-2xl" />
            </div>

            {/* Media Gallery Skeleton */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              <div className="aspect-[16/9] w-full rounded-[2.5rem] bg-white/5" />
              <div className="aspect-[16/9] w-full rounded-[2.5rem] bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
